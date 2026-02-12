import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { criarDenuncia, obterDenuncia, listarDenuncias, atualizarStatusDenuncia } from '../services/denunciasService';
import { generateEncryptionKey, isValidEncryptionKey } from '../services/encryptionService';
import { TRPCError } from '@trpc/server';

// Chave de criptografia (deve ser armazenada de forma segura)
const ENCRYPTION_KEY = process.env.DENUNCIAS_ENCRYPTION_KEY || generateEncryptionKey();

export const denunciasRouter = router({
  /**
   * Criar nova denúncia anônima
   */
  criar: publicProcedure
    .input(
      z.object({
        tipoViolencia: z.string().min(1, 'Tipo de violência é obrigatório'),
        descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
        nomeVitima: z.string().optional(),
        idadeVitima: z.number().optional(),
        telefone: z.string().optional(),
        email: z.string().email().optional(),
        endereco: z.string().optional(),
        dataOcorrencia: z.string().optional(),
        testemunhas: z.string().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const ip = ctx.req.headers['x-forwarded-for'] as string || 'unknown';
        const userAgent = ctx.req.headers['user-agent'] as string || 'unknown';
        
        const resultado = await criarDenuncia(input, ENCRYPTION_KEY, ip, userAgent);
        
        return {
          sucesso: true,
          id: resultado.id,
          token: resultado.token,
          mensagem: resultado.mensagem,
        };
      } catch (error) {
        console.error('[DenunciasRouter] Erro ao criar denúncia:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Falha ao registrar denúncia. Tente novamente mais tarde.',
        });
      }
    }),

  /**
   * Obter denúncia usando token anônimo
   */
  obter: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive('ID inválido'),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const ip = ctx.req.headers['x-forwarded-for'] as string || 'unknown';
        
        const denuncia = await obterDenuncia(input.id, ENCRYPTION_KEY, ip);
        
        return {
          sucesso: true,
          denuncia,
        };
      } catch (error) {
        console.error('[DenunciasRouter] Erro ao obter denúncia:', error);
        
        if (error instanceof Error && error.message === 'Denúncia não encontrada') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Denúncia não encontrada',
          });
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Falha ao recuperar denúncia',
        });
      }
    }),

  /**
   * Listar todas as denúncias (apenas para admins)
   */
  listar: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem acessar esta funcionalidade',
        });
      }
      
      const denuncias = await listarDenuncias(ENCRYPTION_KEY);
      
      return {
        sucesso: true,
        total: denuncias.length,
        denuncias,
      };
    } catch (error) {
      console.error('[DenunciasRouter] Erro ao listar denúncias:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Falha ao listar denúncias',
      });
    }
  }),

  /**
   * Atualizar status de denúncia (apenas para admins)
   */
  atualizarStatus: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive('ID inválido'),
        status: z.enum(['novo', 'em_analise', 'resolvido', 'arquivado']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Apenas administradores podem atualizar denúncias',
          });
        }
        
        await atualizarStatusDenuncia(input.id, input.status, ctx.user?.id);
        
        return {
          sucesso: true,
          mensagem: 'Status atualizado com sucesso',
        };
      } catch (error) {
        console.error('[DenunciasRouter] Erro ao atualizar status:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Falha ao atualizar status',
        });
      }
    }),

  /**
   * Obter chave de criptografia (apenas para admins)
   * Retorna a chave apenas uma vez por sessão
   */
  obterChave: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem acessar a chave de criptografia',
        });
      }
      
      return {
        sucesso: true,
        chave: ENCRYPTION_KEY,
        aviso: 'Esta chave é sensível. Não a compartilhe ou exponha em logs.',
      };
    } catch (error) {
      console.error('[DenunciasRouter] Erro ao obter chave:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Falha ao obter chave',
      });
    }
  }),
});
