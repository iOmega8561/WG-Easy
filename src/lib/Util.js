'use strict';

const childProcess = require('child_process');

module.exports = class Util {

  static isValidIPv4(str) {
    const blocks = str.split('.');
    if (blocks.length !== 4) return false;

    for (let value of blocks) {
      value = parseInt(value, 10);
      if (Number.isNaN(value)) return false;
      if (value < 0 || value > 255) return false;
    }

    return true;
  }

  static promisify(fn) {
    // eslint-disable-next-line func-names
    return function(req, res) {
      Promise.resolve().then(async () => fn(req, res))
        .then((result) => {
          if (res.headersSent) return;

          if (typeof result === 'undefined') {
            return res
              .status(204)
              .end();
          }

          return res
            .status(200)
            .json(result);
        })
        .catch((error) => {
          if (typeof error === 'string') {
            error = new Error(error);
          }

          // eslint-disable-next-line no-console
          console.error(error);

          return res
            .status(error.statusCode || 500)
            .json({
              error: error.message || error.toString(),
              stack: error.stack,
            });
        });
    };
  }

  static async exec(cmd, {
    log = true,
  } = {}) {
    if (typeof log === 'string') {
      // eslint-disable-next-line no-console
      console.log(`$ ${log}`);
    } else if (log === true) {
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

  static generateDefaultNft = (net, port, dev) => {  
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
};
