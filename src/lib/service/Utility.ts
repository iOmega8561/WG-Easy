'use strict';

import bcrypt from 'bcryptjs';
import childProcess from 'child_process';

import ExecProps from '../types/ExecProps'

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

export async function exec(
  cmd: string, 
  props: ExecProps = { log: true }
): Promise<string> {
  if (typeof props.log === 'string') {
    // eslint-disable-next-line no-console
    console.log(`$ ${props.log}`);
  } else if (props.log === true) {
    // eslint-disable-next-line no-console
    console.log(`$ ${cmd}`);
  }

  if (process.platform !== 'linux') {
    return '';
  }

  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, {
      shell: 'bash',
    }, (err, stdout) => {
      if (err) return reject(err);
      return resolve(String(stdout).trim());
    });
  });
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
  if (typeof password !== 'string') {
    return false;
  }

  if (hash) {
    return bcrypt.compareSync(password, hash);
  }

  return false;
};