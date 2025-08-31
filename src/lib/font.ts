const fontDataCache = new Map<string, ArrayBuffer>();

export const loadFontData = async (
  fontName: string,
  fontUrl: string | URL,
): Promise<ArrayBuffer> => {
  const cacheKey = `${fontName}-${fontUrl}`;

  const cacheData = fontDataCache.get(cacheKey);
  if (cacheData) {
    return cacheData;
  }

  const fontResponse = await fetch(fontUrl);

  if (!fontResponse.ok) {
    throw new Error(`Failed to load font: ${fontName}`);
  }

  const fontData = await fontResponse.arrayBuffer();
  fontDataCache.set(cacheKey, fontData);
  return fontData;
};
