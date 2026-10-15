/** Read a public POST body with a hard size cap, including chunked requests. */
export async function readLimitedBody(request: Request, maxBytes: number): Promise<Buffer | null> {
  if (Number(request.headers.get("content-length")) > maxBytes) return null;
  if (!request.body) return Buffer.alloc(0);
  const reader = request.body.getReader();
  const chunks: Buffer[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, size);
}
