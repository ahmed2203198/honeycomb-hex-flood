import { useCallback, useMemo, useState } from 'react';
import { JarTier } from '../game/progression';
import { clampFrame } from '../game/progression';

export interface JarRecord {
  frame: number;
  tier: JarTier;
}

export interface ProgressState {
  frame: number;
  jars: JarRecord[];
  bestSpare: number;
  combsFilled: number;
  spareTotal: number;
  streak: number;
  bestStreak: number;
  relaxBoards: number;
  dailyDays: number;
}

const INITIAL: ProgressState = {
  frame: 1,
  jars: [],
  bestSpare: 0,
  combsFilled: 0,
  spareTotal: 0,
  streak: 0,
  bestStreak: 0,
  relaxBoards: 0,
  dailyDays: 0,
};

export interface RoundOutcome {
  win: boolean;
  frame: number;
  spare: number;
  tier: JarTier;
  relax: boolean;
  daily: boolean;
}

/**
 * Local-only progression. No network, no account, no currency - honey jars are
 * a collection counter and buy nothing.
 */
export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(INITIAL);

  const record = useCallback((outcome: RoundOutcome) => {
    setProgress(prev => {
      if (outcome.relax) {
        return outcome.win ? { ...prev, relaxBoards: prev.relaxBoards + 1 } : prev;
      }
      if (!outcome.win) {
        return { ...prev, streak: 0 };
      }
      const alreadyEarned = prev.jars.some(j => j.frame === outcome.frame);
      const jars = alreadyEarned
        ? prev.jars
        : prev.jars.concat([{ frame: outcome.frame, tier: outcome.tier }]);
      const streak = prev.streak + 1;
      return {
        ...prev,
        jars,
        frame: outcome.daily ? prev.frame : clampFrame(Math.max(prev.frame, outcome.frame + 1)),
        bestSpare: Math.max(prev.bestSpare, outcome.spare),
        combsFilled: prev.combsFilled + 1,
        spareTotal: prev.spareTotal + outcome.spare,
        streak,
        bestStreak: Math.max(prev.bestStreak, streak),
        dailyDays: outcome.daily ? prev.dailyDays + 1 : prev.dailyDays,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setProgress(INITIAL);
  }, []);

  const avgSpare = useMemo(() => {
    if (progress.combsFilled === 0) {
      return '0.0';
    }
    return (progress.spareTotal / progress.combsFilled).toFixed(1);
  }, [progress.combsFilled, progress.spareTotal]);

  return { progress, record, reset, avgSpare };
}
