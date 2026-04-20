export function parseProductImages(imagesJson: string): string[] {
  try {
    const v = JSON.parse(imagesJson) as unknown;
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
