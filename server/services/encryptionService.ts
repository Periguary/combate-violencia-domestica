import crypto from 'crypto';

/**
 * Serviço de criptografia para denúncias
 * Utiliza AES-256-GCM para criptografia autenticada
 */

interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
}

interface DecryptedData {
  data: string;
  verified: boolean;
}

/**
 * Gera uma chave de criptografia segura
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Criptografa dados usando AES-256-GCM
 */
export function encryptData(plaintext: string, encryptionKey: string): EncryptedData {
  try {
    const key = Buffer.from(encryptionKey, 'hex');
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    const encryptedBuffer = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted: encryptedBuffer.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64'),
    };
  } catch (error) {
    console.error('[EncryptionService] Erro ao criptografar:', error);
    throw new Error('Falha ao criptografar dados');
  }
}

/**
 * Descriptografa dados usando AES-256-GCM
 */
export function decryptData(
  encryptedData: string,
  iv: string,
  tag: string,
  encryptionKey: string
): DecryptedData {
  try {
    const key = Buffer.from(encryptionKey, 'hex');
    const encryptedBuffer = Buffer.from(encryptedData, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');
    const tagBuffer = Buffer.from(tag, 'base64');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuffer);
    decipher.setAuthTag(tagBuffer);
    
    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]);
    
    return {
      data: decryptedBuffer.toString('utf8'),
      verified: true,
    };
  } catch (error) {
    console.error('[EncryptionService] Erro ao descriptografar:', error);
    
    if (error instanceof Error && error.message.includes('Unsupported state or unable to authenticate data')) {
      return {
        data: '',
        verified: false,
      };
    }
    
    throw new Error('Falha ao descriptografar dados');
  }
}

/**
 * Gera hash de IP para rastreamento anônimo
 */
export function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

/**
 * Gera hash de User Agent para rastreamento anônimo
 */
export function hashUserAgent(userAgent: string): string {
  return crypto.createHash('sha256').update(userAgent).digest('hex');
}

/**
 * Gera um token anônimo para rastreamento de denúncia
 */
export function generateAnonymousToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Valida se uma chave de criptografia é válida
 */
export function isValidEncryptionKey(key: string): boolean {
  try {
    const buffer = Buffer.from(key, 'hex');
    return buffer.length === 32;
  } catch {
    return false;
  }
}
