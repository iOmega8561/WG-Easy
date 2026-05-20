import { useMemo } from "react";
import Props from "../data/Props"

const Waveform: React.FC<Props.Waveform> = ({ 
  rx, 
  tx 
}) => {
  const pointsRx = useMemo(() => {
    const max = Math.max(...rx, 1024); // Baseline minima di 1KB/s per scala
    return rx.map((val, i) => `${(i / (rx.length - 1)) * 100},${50 - (val / max) * 50}`).join(' ');
  }, [rx]);

  const pointsTx = useMemo(() => {
    const max = Math.max(...tx, 1024);
    return tx.map((val, i) => `${(i / (tx.length - 1)) * 100},${50 + (val / max) * 50}`).join(' ');
  }, [tx]);

  return (
    <svg 
      preserveAspectRatio="none" 
      className="
      absolute inset-0 -z-10
      w-full h-full 
      opacity-10 dark:opacity-20 
      pointer-events-none" 
      viewBox="0 0 100 100"
    >
      <polygon points={`0,50 ${pointsRx} 100,50`} fill="currentColor" className="text-gray-900 dark:text-white" />
      <polygon points={`0,50 ${pointsTx} 100,50`} fill="currentColor" className="text-gray-900 dark:text-white" />
    </svg>
  );
};

export default Waveform;