import bcrypt from "bcryptjs";
import cryptoJs from "crypto-js";

class CryptoUtil {
  randomUUID() {
    return crypto.randomUUID();
  }

  async slowHash(text: string, salt: number) {
    return await bcrypt.hash(text, salt);
  }

  async verifySlowHash(text: string, hash: string) {
    return await bcrypt.compare(text, hash);
  }

  encrypt = (text: string, secret: string): string => {
    const salt = cryptoJs.lib.WordArray.random(128 / 8); // 16 bytes
    const iv = cryptoJs.lib.WordArray.random(128 / 8); // 16 bytes

    const key = cryptoJs.PBKDF2(secret, salt, {
      keySize: 256 / 32, // 256 bits = 32 bytes
      iterations: 1000, // Slow brute-force attempts
    });

    const encrypted = cryptoJs.AES.encrypt(text, key, { iv });

    return [
      encrypted.ciphertext.toString(cryptoJs.enc.Base64),
      iv.toString(cryptoJs.enc.Hex),
      salt.toString(cryptoJs.enc.Hex),
    ].join(".");
  };

  decrypt = (encrypted: string, secret: string): string => {
    const [ciphertext, ivHex, saltHex] = encrypted.split(".");

    const iv = cryptoJs.enc.Hex.parse(ivHex);
    const salt = cryptoJs.enc.Hex.parse(saltHex);

    const key = cryptoJs.PBKDF2(secret, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });

    const decrypted = cryptoJs.AES.decrypt(ciphertext, key, { iv });

    return decrypted.toString(cryptoJs.enc.Utf8);
  };

  generateCode = (length: number) => {
    let numbers = "0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
      const RNG = Math.floor(Math.random() * numbers.length);
      result += numbers[RNG];
    }

    return result;
  };

  hmacSHA256 = (text: string, secret: string) => {
    return cryptoJs.HmacSHA256(text, secret).toString(cryptoJs.enc.Hex);
  };
}

export default CryptoUtil;
