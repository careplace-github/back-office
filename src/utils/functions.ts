export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }

  return `${str.slice(0, maxLength)}...`;
}

export const formatTaxNumber = (taxNumber: string) => {
  const taxNumberWithoutSpaces = taxNumber.replaceAll(' ', '');
  if (taxNumberWithoutSpaces.length === 9) {
    return `${taxNumberWithoutSpaces.slice(0, 3)} ${taxNumberWithoutSpaces.slice(
      3,
      6
    )} ${taxNumberWithoutSpaces.slice(6)}`;
  }
  return taxNumber;
};
