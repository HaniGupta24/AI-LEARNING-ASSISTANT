export const chunkText = (text, chunkSize = 1000) => {
  if (!text) return [];

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize;
  }

  return chunks;
};