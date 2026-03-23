import { randomBytes } from 'crypto';


export const createPrefixedNumericId = (length: number = 16, prefix: string = ''): string => {
  
  const randomId = BigInt(`0x${randomBytes(Math.ceil(length / 2)).toString('hex')}`)
    .toString()                     
    .padStart(length, '0')          
    .slice(0, length);          

  return `${prefix.toUpperCase()}${randomId}`;
}