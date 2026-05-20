import { useEffect, useState } from "react"

namespace Utility {

  export function useIsDark(): string {
    const [isDark, setIsDark] = useState(() =>
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )

    useEffect(() => {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    }, [])

    return isDark ? 'dark' : 'light'
  }

  export function formatBytes (bytes: number, decimals = 2): string {
    if (bytes === 0 || !bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };
}

export default Utility;