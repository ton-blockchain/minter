export const makeElipsisAddress = (address?: string | null, padding?: number): string => {
    const paddingValue = padding || 10;
    if (!address) return '';
    const firstPart = address.substr(0, paddingValue);
    const secondPart = address.substr(address.length - paddingValue);
    return `${firstPart}...${secondPart}`;
};