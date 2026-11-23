'use strict';

import bcrypt from 'bcryptjs';
import { execFile } from 'node:child_process';
import { createHash, createPrivateKey, createPublicKey, randomBytes } from 'node:crypto';
import ExecProps from '../types/ExecProps'
import Client from '../types/Client';

export function isValidIPv4(str: string): boolean {
  const blocks: string[] = str.split('.');
  if (blocks.length !== 4) return false;

  for (const value of blocks) {
    const number = parseInt(value, 10);
    if (Number.isNaN(number)) return false;
    if (number < 0 || number > 255) return false;
  }

  return true;
}

/**
 * Runs an executable with its arguments as a list: no shell, so nothing in an argument is
 * ever interpreted.
 */
export async function run(
  file: string,
  args: string[],
  props: ExecProps = { log: true }
): Promise<string> {
  if (typeof props.log === 'string') {
    // eslint-disable-next-line no-console
    console.log(`$ ${props.log}`);
  } else if (props.log === true) {
    // eslint-disable-next-line no-console
    console.log(`$ ${[file, ...args].join(' ')}`);
  }

  if (process.platform !== 'linux') {
    return '';
  }

  return new Promise((resolve, reject) => {
    execFile(file, args, (err, stdout, stderr) => {
      if (err) {
        err.message = `${err.message}\n${String(stderr).trim()}`.trim();
        return reject(err);
      }
      return resolve(String(stdout).trim());
    });
  });
}

/**
 * A Curve25519 key pair in WireGuard's format (base64), generated in-process:
 * the private key never appears on a command line or in a log.
 */
export function generateKeyPair(): { privateKey: string, publicKey: string } {
  const key = randomBytes(32);

  // Clamped exactly as `wg genkey` does.
  key.writeUInt8(key.readUInt8(0) & 248, 0);
  key.writeUInt8((key.readUInt8(31) & 127) | 64, 31);

  const privateKey = key.toString('base64');
  return { privateKey, publicKey: derivePublicKey(privateKey) };
}

/** The fixed DER header of a PKCS#8 X25519 private key; the 32 raw bytes follow it. */
const X25519_PKCS8_PREFIX = Buffer.from('302e020100300506032b656e04220420', 'hex');

/** The public key of a WireGuard private key, both in base64. */
export function derivePublicKey(privateKey: string): string {
  const d = Buffer.from(privateKey, 'base64');
  if (d.length !== 32) {
    throw new Error('A WireGuard private key is 32 bytes long.');
  }

  const keyObject = createPrivateKey({
    key: Buffer.concat([X25519_PKCS8_PREFIX, d]),
    format: 'der',
    type: 'pkcs8',
  });
  const spki = createPublicKey(keyObject).export({ format: 'der', type: 'spki' });

  // The raw public key is the last 32 bytes of its SubjectPublicKeyInfo.
  return spki.subarray(spki.length - 32).toString('base64');
}

/** A WireGuard preshared key: 32 random bytes, as `wg genpsk` makes them. */
export function generatePresharedKey(): string {
  return randomBytes(32).toString('base64');
}

export function generateDefaultNft(
  net: string, 
  port: number, 
  dev: string
): { 
  postUp: string, 
  postDown: string 
} {  
  const postUp = [
    `nft 'add table inet wg_filter_${dev}'`,
    `nft 'add chain inet wg_filter_${dev} input { type filter hook input priority filter; }'`,
    `nft 'add chain inet wg_filter_${dev} forward { type filter hook forward priority filter; }'`,
    `nft 'add rule inet wg_filter_${dev} input udp dport ${port} accept'`,
    `nft 'add rule inet wg_filter_${dev} forward iifname "${dev}" accept'`,
    `nft 'add rule inet wg_filter_${dev} forward oifname "${dev}" accept'`,
    `nft 'add table ip wg_nat_${dev}'`,
    `nft 'add chain ip wg_nat_${dev} postrouting { type nat hook postrouting priority srcnat; }'`,
    `nft 'add rule ip wg_nat_${dev} postrouting ip saddr ${net} masquerade'`
  ].join('; ');

  const postDown = [
    `nft 'delete table inet wg_filter_${dev}'`,
    `nft 'delete table ip wg_nat_${dev}'`
  ].join('; ');

  return { postUp, postDown };
};

const MAX_CACHE_SIZE = 50;
const cache = new Map<string, boolean>();

/**
 * Checks if `password` matches the PASSWORD_HASH.
 *
 * If environment variable is not set, the password is always invalid.
 *
 * @param {string} password String to test
 * @returns {boolean} true if matching environment, otherwise false
 */
export function isPasswordValid(
  password: string, 
  hash: string | undefined
): boolean {
  if (typeof password !== 'string' || !hash) return false;

  const key = createHash('sha256').update(password).digest('hex');

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const isValid = bcrypt.compareSync(password, hash);

  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) cache.delete(oldestKey);
  }

  cache.set(key, isValid);
  return isValid;
}

/**
 * Extracts username and password from an Authorization header with Basic scheme.
 * 
 * Format: "Basic base64(username:password)"
 * 
 * @returns { username: string, password: string } or undefined if invalid
 */
export function extractBasicCredentials(
  authHeader: string | string[] | undefined
): { 
  username: string; 
  password: string 
} | undefined {
  if (Array.isArray(authHeader)) {
    authHeader = authHeader[0];
  }

  if (!authHeader || typeof authHeader !== 'string') {
    return undefined;
  }

  const match = authHeader.match(/^Basic\s+(.+)$/i);
  if (!match || !match[1]) {
    return undefined;
  }

  try {
    const decoded = Buffer.from(match[1], 'base64').toString('utf-8');
    
    const colonIndex = decoded.indexOf(':');
    if (colonIndex === -1) {
      return undefined;
    }

    const username = decoded.substring(0, colonIndex);
    const password = decoded.substring(colonIndex + 1);

    return { username, password };
  } catch {
    return undefined;
  }
}

export function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

export function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >> 16) & 255,
    (int >> 8) & 255,
    int & 255,
  ].join('.');
}

export function parseCIDR(addressWithMask: string) {
  const [ip, maskStr] = addressWithMask.split('/');
  if (!ip || !maskStr) {
    throw new Error(`Tried to parse an invalid CIDR: ${addressWithMask}`);
  }

  const mask = parseInt(maskStr, 10);
  if (isNaN(mask) || mask < 0 || mask > 32) {
    throw new Error(`Invalid netmask found during parsing: ${maskStr}`);
  }
  if (!ip || !isValidIPv4(ip)) {
    throw new Error(`Invalid IPv4 address found during parsing: ${ip}`);
  }

  const ipInt = ipToInt(ip);
  const netmaskInt = mask === 0 ? 0 : (~((1 << (32 - mask)) - 1)) >>> 0;
  const networkInt = (ipInt & netmaskInt) >>> 0;
  const broadcastInt = (networkInt | (~netmaskInt >>> 0)) >>> 0;

  return { ip, mask, ipInt, networkInt, broadcastInt, netmaskInt };
}

export function getFirstAvailableIPv4Address(
  serverAddress: string, 
  subnetMask: string,
  clients: { [key: string]: Client }
): string | undefined {

  const serverCidr = `${serverAddress}/${subnetMask}`;
  const { 
    networkInt, 
    broadcastInt, 
    ipInt: serverIpInt 
  } = parseCIDR(serverCidr);
     
  for (let currentInt = networkInt + 1; currentInt < broadcastInt; currentInt++) {

    if (currentInt === serverIpInt) continue;
    
    const currentIp = intToIp(currentInt);
    const isUsed = Object.values(clients).some(
      (client) => client.address === currentIp
    );
     
    if (!isUsed) {
      return currentIp;
    }
  }

  return undefined
}

export function validateIPv4AddressOnUpdate(
  clientId: string,
  newAddress: string,
  serverAddress: string, 
  subnetMask: string,
  clients: { [key: string]: Client }
): void {
  if (!newAddress || !isValidIPv4(newAddress)) {
    throw new Error(`Invalid IPv4 address on update: ${newAddress}`);
  }
   
  const serverCidr = `${serverAddress}/${subnetMask}`;
  const { networkInt, broadcastInt, ipInt: serverIpInt } = parseCIDR(serverCidr);
  const targetIpInt = ipToInt(newAddress);
  
  if (targetIpInt <= networkInt || targetIpInt >= broadcastInt) {
    throw new Error(`Address ${newAddress} is not in usable range for subnet ${serverCidr}.`);
  }
  
  if (targetIpInt === serverIpInt) {
    throw new Error(`Address ${newAddress} is reserved for the WireGuard server.`);
  }
  
  const existingClient = Object.entries(clients).find(
    ([id, c]) => c.address === newAddress && id !== clientId
  );
  
  if (existingClient) {
    throw new Error(`Address ${newAddress} already belongs to another client.`);
  }
}