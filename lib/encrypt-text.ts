import crypto from "crypto";

const algorithm = process.env.CRYPTO_ALGORITHM;
const encryptionKey = process.env.CRYPTO_KEY;
const ivLength = 16;

export function encryptText(
  text: string,
  encoding: BufferEncoding = "hex",
  separator = ":",
) {
  if (!algorithm || !encryptionKey) return text;

  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv,
  );

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString(encoding) + separator + encrypted.toString(encoding);
}

export function decryptText(
  text: string,
  encoding: BufferEncoding = "hex",
  separator = ":",
) {
  if (!algorithm || !encryptionKey) return text;

  const [ivText, ...textParts] = text.split(separator);

  const iv = Buffer.from(ivText, encoding);
  const encryptedText = Buffer.from(textParts.join(separator), encoding);

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv,
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
