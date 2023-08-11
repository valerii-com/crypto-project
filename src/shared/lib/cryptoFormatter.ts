import utils from 'web3-utils';

export function cryptoFormatter(value: string): number {
  let cryptoValue = utils.fromWei(value, 'ether') as any;

  if (cryptoValue.indexOf('.') !== '-1') {
    cryptoValue = cryptoValue.substring(0, cryptoValue.indexOf('.') + 4);
  }

  return parseFloat(cryptoValue);
}
