interface ClientStats {
  rxSpeed: number;
  txSpeed: number;
  historyRx: number[];
  historyTx: number[];
}

export default ClientStats;