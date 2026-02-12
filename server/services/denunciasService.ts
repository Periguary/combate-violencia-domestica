import { getDb } from '../db';
import { denuncias, denunciasAuditLog } from '../../drizzle/schema';
import { encryptData, decryptData, hashIP, hashUserAgent, generateAnonymousToken } from './encryptionService';
import { eq } from 'drizzle-orm';

interface DenunciaInput {
  tipoViolencia: string;
  descricao: string;
  nomeVitima?: string;
  idadeVitima?: number;
  telefone?: string;
  email?: string;
  endereco?: string;
  dataOcorrencia?: string;
  testemunhas?: string;
  observacoes?: string;
}

interface DenunciaResponse {
  id: number;
  token: string;
  status: string;
  criadoEm: Date;
  mensagem: string;
}

interface DenunciaDetalhes {
  id: number;
  dados: DenunciaInput;
  status: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export async function criarDenuncia(
  input: DenunciaInput,
  encryptionKey: string,
  ip: string,
  userAgent: string
): Promise<DenunciaResponse> {
  const db = await getDb();
  if (!db) {
    throw new Error('Banco de dados não disponível');
  }

  try {
    const token = generateAnonymousToken();
    const dadosParaCriptografar = JSON.stringify(input);
    const { encrypted, iv, tag } = encryptData(dadosParaCriptografar, encryptionKey);
    const ipHash = hashIP(ip);
    const userAgentHash = hashUserAgent(userAgent);
    
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + 90);
    
    await db.insert(denuncias).values({
      encryptedData: encrypted,
      encryptionIv: iv,
      encryptionTag: tag,
      status: 'novo',
      tipoViolencia: input.tipoViolencia,
      ipHash,
      userAgentHash,
      dataExpiracao,
    });
    
    const result = await db.select().from(denuncias).where(eq(denuncias.ipHash, ipHash));
    const denunciaId = result[result.length - 1]?.id;
    
    if (denunciaId) {
      await db.insert(denunciasAuditLog).values({
        denunciaId,
        acao: 'criada',
        ipHash,
      });
    }
    
    return {
      id: denunciaId || 0,
      token,
      status: 'novo',
      criadoEm: new Date(),
      mensagem: 'Denúncia registrada com sucesso. Guarde este token para acompanhar sua denúncia.',
    };
  } catch (error) {
    console.error('[DenunciasService] Erro ao criar denúncia:', error);
    throw new Error('Falha ao registrar denúncia');
  }
}

export async function obterDenuncia(
  denunciaId: number,
  encryptionKey: string,
  ip: string
): Promise<DenunciaDetalhes> {
  const db = await getDb();
  if (!db) {
    throw new Error('Banco de dados não disponível');
  }

  try {
    const result = await db
      .select()
      .from(denuncias)
      .where(eq(denuncias.id, denunciaId));
    
    if (result.length === 0) {
      throw new Error('Denúncia não encontrada');
    }
    
    const denuncia = result[0];
    const ipHash = hashIP(ip);
    
    await db.insert(denunciasAuditLog).values({
      denunciaId,
      acao: 'visualizada',
      ipHash,
    });
    
    const { data, verified } = decryptData(
      denuncia.encryptedData,
      denuncia.encryptionIv,
      denuncia.encryptionTag,
      encryptionKey
    );
    
    if (!verified) {
      throw new Error('Falha na verificação de integridade dos dados');
    }
    
    const dadosDescriptografados = JSON.parse(data) as DenunciaInput;
    
    return {
      id: denuncia.id,
      dados: dadosDescriptografados,
      status: denuncia.status,
      criadoEm: denuncia.criadoEm,
      atualizadoEm: denuncia.atualizadoEm,
    };
  } catch (error) {
    console.error('[DenunciasService] Erro ao obter denúncia:', error);
    throw error;
  }
}

export async function listarDenuncias(
  encryptionKey: string,
  filtros?: {
    status?: string;
    tipoViolencia?: string;
  }
): Promise<DenunciaDetalhes[]> {
  const db = await getDb();
  if (!db) {
    throw new Error('Banco de dados não disponível');
  }

  try {
    const result = await db.select().from(denuncias);
    const denunciasDescriptografadas: DenunciaDetalhes[] = [];
    
    for (const denuncia of result) {
      if (filtros?.status && denuncia.status !== filtros.status) continue;
      
      try {
        const { data, verified } = decryptData(
          denuncia.encryptedData,
          denuncia.encryptionIv,
          denuncia.encryptionTag,
          encryptionKey
        );
        
        if (verified) {
          const dadosDescriptografados = JSON.parse(data) as DenunciaInput;
          denunciasDescriptografadas.push({
            id: denuncia.id,
            dados: dadosDescriptografados,
            status: denuncia.status,
            criadoEm: denuncia.criadoEm,
            atualizadoEm: denuncia.atualizadoEm,
          });
        }
      } catch (error) {
        console.warn('[DenunciasService] Erro ao descriptografar denúncia', denuncia.id);
      }
    }
    
    return denunciasDescriptografadas;
  } catch (error) {
    console.error('[DenunciasService] Erro ao listar denúncias:', error);
    throw error;
  }
}

export async function atualizarStatusDenuncia(
  denunciaId: number,
  novoStatus: string,
  usuarioId?: number
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error('Banco de dados não disponível');
  }

  try {
    await db
      .update(denuncias)
      .set({ status: novoStatus as any })
      .where(eq(denuncias.id, denunciaId));
    
    await db.insert(denunciasAuditLog).values({
      denunciaId,
      acao: 'atualizada',
      usuarioId,
    });
  } catch (error) {
    console.error('[DenunciasService] Erro ao atualizar status:', error);
    throw error;
  }
}
