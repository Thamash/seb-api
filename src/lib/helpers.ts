export const getRandomIpAddress = (): string => {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
}

export const getUrlWithoutParams = (url: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
  }
  const urlObj = new URL(`${baseUrl}/${url}`);
  urlObj.search = '';
  return urlObj.toString();
};

export const resolveParams = async <T>(params: Promise<T>): Promise<T> => await params;
