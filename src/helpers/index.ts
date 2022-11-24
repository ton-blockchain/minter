export const makeElipsisAddress = (address?: string | null, padding?: number): string => {
  const paddingValue = padding || 10;
  if (!address) return "";
  const firstPart = address.substring(0, paddingValue);
  const secondPart = address.substring(address.length - paddingValue);
  return `${firstPart}...${secondPart}`;
};

export function checkImageURL(url: string) {
  return url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null;
}

export function checkDecimals(value: string) {
  if (!value) return true;
  if (value.includes(".")) return false;

  const num = parseInt(value);
  return num >= 0 && num <= 255;
}
