import { useMemo } from "react";
import Props from "../../data/Props"

const Waveform: React.FC<Props.Waveform> = ({ 
  rx, 
  tx 
}) => {
  const SCALE_FACTOR = 0.4;

  const pointsRx = useMemo(() => {
    const max = Math.max(...rx, 1024);
    return rx.map((val, i) => 
      `${(i / (rx.length - 1)) * 100},${(val / max) * 50 * SCALE_FACTOR}`
    ).join(' ');
  }, [rx]);

  const pointsTx = useMemo(() => {
    const max = Math.max(...tx, 1024);
    return tx.map((val, i) => 
      `${(i / (tx.length - 1)) * 100},${100 - (val / max) * 50 * SCALE_FACTOR}`
    ).join(' ');
  }, [tx]);

  return (
    <svg 
      preserveAspectRatio="none" 
      className="
      absolute inset-0 w-full h-full 
      opacity-5 dark:opacity-10 
      pointer-events-none" 
      viewBox="0 0 100 100"
    >
      <polygon 
        points={`0,0 ${pointsRx} 100,0`} 
        fill="currentColor" 
        className="text-gray-900 dark:text-white"
      />

      <polygon 
        points={`0,100 ${pointsTx} 100,100`} 
        fill="currentColor" 
        className="text-gray-900 dark:text-white" 
      />
    </svg>
  );
};

export default Waveform;