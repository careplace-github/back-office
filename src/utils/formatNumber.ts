import numeral from 'numeral';

// ----------------------------------------------------------------------

type InputValue = string | number | null | undefined;

export function fNumber(number: InputValue) {
  return numeral(number).format();
}

export function fCurrency(number: InputValue) {
  const format = number ? numeral(number).format('0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number: InputValue) {
  const format = numeral(Number(number) / 100).format('0.0%');

  return format !== '0.0%' ? result(format, '.0') : '0%';
}

export function fShortenNumber(number: InputValue) {
  const format = number !== undefined && number !== null ? numeral(number).format('0.00a') : '0.00';

  return result(format, '.00');
}

export function fData(number: InputValue) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format: string, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
