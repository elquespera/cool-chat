import { createHash, createHmac } from "crypto";

const defaultSecret = process.env.OLLAMA_API_HMAC_SECRET!;

export function generateHMAC(
  url: string,
  method: string,
  body?: BodyInit | null,
  hmacSecret = defaultSecret,
) {
  const hmac = createHmac("sha256", hmacSecret);
  const time = Date.now().toString();

  hmac.update(time);
  hmac.update(method);
  hmac.update(new URL(url).pathname);

  if (body) {
    const contentHash = createHash("md5");
    contentHash.update(String(body));
    hmac.update(contentHash.digest("hex"));
  }

  return `HMAC ${time}:${hmac.digest("hex")}`;
}

export function fetchHMAC(
  url: string,
  { method, headers, body, ...rest }: RequestInit = {},
  hmacSecret = defaultSecret,
) {
  return fetch(url, {
    ...rest,
    method,
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Authorization: generateHMAC(url, method || "GET", body, hmacSecret),
    },
    body,
  });
}
