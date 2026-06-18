import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AntiCheatOptions {
  enabled: boolean;
  onInfraction: () => void;
}

export function useAntiCheat({ enabled, onInfraction }: AntiCheatOptions) {
  const [infractions, setInfractions] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // The user switched tabs or minimized the browser
        setInfractions((prev) => prev + 1);
        toast.error("SECURITY INFRACTION: Tab switching is strictly prohibited during active tests.", {
          duration: 5000,
        });
        onInfraction();
      }
    };

    const handleBlur = () => {
      // The user clicked outside the window (another monitor, etc.)
      setInfractions((prev) => prev + 1);
      toast.error("SECURITY INFRACTION: Window focus lost. Keep your attention on the test.", {
        duration: 5000,
      });
      onInfraction();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [enabled, onInfraction]);

  return { infractions };
}
