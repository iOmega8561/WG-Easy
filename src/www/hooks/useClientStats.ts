import { useState, useEffect, useRef } from 'react';
import Api from '../data/Api';
import Client from '../data/Client';
import ClientStats from '../data/ClientStats';

const HISTORY_LENGTH = 30;

function useClientStats(authenticated: boolean) {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<Record<string, ClientStats>>({});
  
  const prevClientsRef = useRef<Client[]>(new Array());
  const lastFetchRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!authenticated) {
      setClients([]);
      return;
    }

    let isMounted = true;
    let timeoutId: number;

    const pollData = async () => {
      try {
        const newClients = await Api.getClients();
        if (!isMounted) return;

        const now = Date.now();
        const timeDiff = (now - lastFetchRef.current) / 1000;

        const prevClientsMap = new Map(prevClientsRef.current.map(c => [c.id, c]));

        setStats(prevStats => {
          const nextStats = { ...prevStats };

          newClients.forEach(client => {
            const prevClient = prevClientsMap.get(client.id);

            const prevRx = prevClient?.transferRx ?? client.transferRx ?? 0;
            const prevTx = prevClient?.transferTx ?? client.transferTx ?? 0;
          
            const rxSpeed = Math.max(0, ((client.transferRx ?? 0) - prevRx) / timeDiff);
            const txSpeed = Math.max(0, ((client.transferTx ?? 0) - prevTx) / timeDiff);
          
            const existingHistoryRx = nextStats[client.id]?.historyRx || Array(HISTORY_LENGTH).fill(0);
            const existingHistoryTx = nextStats[client.id]?.historyTx || Array(HISTORY_LENGTH).fill(0);
            
            nextStats[client.id] = {
              rxSpeed,
              txSpeed,
              historyRx: [...existingHistoryRx.slice(1), rxSpeed],
              historyTx: [...existingHistoryTx.slice(1), txSpeed],
            };
          });
          return nextStats;
        });

        setClients(newClients);

        prevClientsRef.current = newClients;
        lastFetchRef.current = now;

      } finally {
        if (isMounted) {
          timeoutId = setTimeout(pollData, 1000); 
        }
      }
    };

    pollData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [authenticated]) 

  return { clients, setClients, stats };
};

export default useClientStats;