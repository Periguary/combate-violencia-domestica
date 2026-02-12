import { describe, expect, it, beforeEach } from 'vitest';
import {
  generateEncryptionKey,
  encryptData,
  decryptData,
  hashIP,
  hashUserAgent,
  generateAnonymousToken,
  isValidEncryptionKey,
} from './encryptionService';

describe('EncryptionService', () => {
  let encryptionKey: string;

  beforeEach(() => {
    encryptionKey = generateEncryptionKey();
  });

  describe('generateEncryptionKey', () => {
    it('deve gerar uma chave válida', () => {
      const key = generateEncryptionKey();
      expect(key).toBeDefined();
      expect(key.length).toBe(64); // 32 bytes em hex = 64 caracteres
    });

    it('deve gerar chaves diferentes a cada chamada', () => {
      const key1 = generateEncryptionKey();
      const key2 = generateEncryptionKey();
      expect(key1).not.toBe(key2);
    });
  });

  describe('encryptData e decryptData', () => {
    it('deve criptografar e descriptografar dados corretamente', () => {
      const plaintext = 'Dados sensíveis de denúncia';
      const encrypted = encryptData(plaintext, encryptionKey);

      expect(encrypted.encrypted).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.tag).toBeDefined();

      const decrypted = decryptData(
        encrypted.encrypted,
        encrypted.iv,
        encrypted.tag,
        encryptionKey
      );

      expect(decrypted.verified).toBe(true);
      expect(decrypted.data).toBe(plaintext);
    });

    it('deve criptografar dados JSON', () => {
      const data = {
        tipoViolencia: 'fisica',
        descricao: 'Agressão com objeto contundente',
        nomeVitima: 'João Silva',
      };
      const plaintext = JSON.stringify(data);
      const encrypted = encryptData(plaintext, encryptionKey);

      const decrypted = decryptData(
        encrypted.encrypted,
        encrypted.iv,
        encrypted.tag,
        encryptionKey
      );

      expect(decrypted.verified).toBe(true);
      const decryptedData = JSON.parse(decrypted.data);
      expect(decryptedData).toEqual(data);
    });

    it('deve falhar na descriptografia com chave errada', () => {
      const plaintext = 'Dados sensíveis';
      const encrypted = encryptData(plaintext, encryptionKey);

      const wrongKey = generateEncryptionKey();
      const decrypted = decryptData(
        encrypted.encrypted,
        encrypted.iv,
        encrypted.tag,
        wrongKey
      );

      expect(decrypted.verified).toBe(false);
      expect(decrypted.data).toBe('');
    });

    it('deve falhar na descriptografia com IV alterado', () => {
      const plaintext = 'Dados sensíveis';
      const encrypted = encryptData(plaintext, encryptionKey);

      // Alterar um caractere do IV
      const alteredIv = encrypted.iv.substring(0, encrypted.iv.length - 1) + 'X';

      const decrypted = decryptData(
        encrypted.encrypted,
        alteredIv,
        encrypted.tag,
        encryptionKey
      );

      expect(decrypted.verified).toBe(false);
    });


  });

  describe('hashIP', () => {
    it('deve gerar hash consistente para o mesmo IP', () => {
      const ip = '192.168.1.1';
      const hash1 = hashIP(ip);
      const hash2 = hashIP(ip);

      expect(hash1).toBe(hash2);
    });

    it('deve gerar hashes diferentes para IPs diferentes', () => {
      const hash1 = hashIP('192.168.1.1');
      const hash2 = hashIP('192.168.1.2');

      expect(hash1).not.toBe(hash2);
    });

    it('deve retornar um hash SHA-256 válido', () => {
      const hash = hashIP('127.0.0.1');
      expect(hash.length).toBe(64); // SHA-256 em hex = 64 caracteres
    });
  });

  describe('hashUserAgent', () => {
    it('deve gerar hash consistente para o mesmo User Agent', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
      const hash1 = hashUserAgent(ua);
      const hash2 = hashUserAgent(ua);

      expect(hash1).toBe(hash2);
    });

    it('deve gerar hashes diferentes para User Agents diferentes', () => {
      const hash1 = hashUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
      const hash2 = hashUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');

      expect(hash1).not.toBe(hash2);
    });

    it('deve retornar um hash SHA-256 válido', () => {
      const hash = hashUserAgent('Chrome/120.0');
      expect(hash.length).toBe(64);
    });
  });

  describe('generateAnonymousToken', () => {
    it('deve gerar um token válido', () => {
      const token = generateAnonymousToken();
      expect(token).toBeDefined();
      expect(token.length).toBe(64); // 32 bytes em hex = 64 caracteres
    });

    it('deve gerar tokens diferentes a cada chamada', () => {
      const token1 = generateAnonymousToken();
      const token2 = generateAnonymousToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('isValidEncryptionKey', () => {
    it('deve validar uma chave válida', () => {
      const validKey = generateEncryptionKey();
      expect(isValidEncryptionKey(validKey)).toBe(true);
    });

    it('deve rejeitar uma chave muito curta', () => {
      const shortKey = 'abc123';
      expect(isValidEncryptionKey(shortKey)).toBe(false);
    });

    it('deve rejeitar uma chave muito longa', () => {
      const longKey = 'a'.repeat(128);
      expect(isValidEncryptionKey(longKey)).toBe(false);
    });

    it('deve rejeitar uma chave inválida (não hex)', () => {
      const invalidKey = 'z'.repeat(64);
      expect(isValidEncryptionKey(invalidKey)).toBe(false);
    });

    it('deve rejeitar uma string vazia', () => {
      expect(isValidEncryptionKey('')).toBe(false);
    });
  });
});
