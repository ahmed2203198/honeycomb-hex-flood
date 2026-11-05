/**
 * HoneycombHexFlood - App.tsx is the state-machine ONLY.
 * No gameplay lives here: every screen owns its own logic.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BOARD_SIZES, BoardSizeKey, GameMode } from './src/constants/config';
import { theme } from './src/constants/theme';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen, GameResult } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { PantryScreen, PantrySection } from './src/screens/PantryScreen';
import { Settings, SettingsScreen } from './src/screens/SettingsScreen';
import { useProgress } from './src/hooks/useProgress';
import {
  firstFrameOfSeason,
  seasonIndexOfFrame,
  slackForFrame,
} from './src/game/progression';
import { dailySeed } from './src/utils/rng';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'pantry' | 'settings';

interface Session {
  frame: number;
  mode: GameMode;
  seed: number;
  size: BoardSizeKey;
  slack: number;
  seasonIndex: number;
  round: number;
}

const DEFAULT_SETTINGS: Settings = {
  colorblind: true,
  sound: true,
  haptics: true,
  boardSize: 'MEDIUM',
};

const frameSeed = (frame: number): number => frame * 7919 + 101;

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [season, setSeason] = useState(0);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [pantrySection, setPantrySection] = useState<PantrySection>('JARS');
  const [result, setResult] = useState<GameResult | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const { progress, record, reset, avgSpare } = useProgress();
  const unlockedSeason = seasonIndexOfFrame(progress.frame);

  const startSession = useCallback(
    (mode: GameMode, frame: number) => {
      const size: BoardSizeKey = mode === 'daily' ? 'MEDIUM' : settings.boardSize;
      let seed = frameSeed(frame);
      if (mode === 'daily') {
        seed = dailySeed();
      } else if (mode === 'relax') {
        seed = Math.floor(Math.random() * 900000) + 1000;
      }
      setSession({
        frame,
        mode,
        seed,
        size,
        slack: mode === 'daily' ? 2 : slackForFrame(frame),
        seasonIndex: mode === 'relax' ? 1 : seasonIndexOfFrame(frame),
        round: Date.now(),
      });
      setScreen('game');
    },
    [settings.boardSize],
  );

  const handlePlay = useCallback(() => {
    const target = Math.max(progress.frame, firstFrameOfSeason(season));
    startSession('frame', target);
  }, [progress.frame, season, startSession]);

  const handleRelax = useCallback(() => {
    startSession('relax', 1);
  }, [startSession]);

  const handleDaily = useCallback(() => {
    startSession('daily', progress.frame);
  }, [startSession, progress.frame]);

  const handleGameOver = useCallback(
    (r: GameResult) => {
      record({
        win: r.win,
        frame: r.frame,
        spare: r.spare,
        tier: r.tier,
        relax: r.mode === 'relax',
        daily: r.mode === 'daily',
      });
      setResult(r);
      setScreen('gameover');
    },
    [record],
  );

  const handlePlayAgain = useCallback(() => {
    if (!result) {
      setScreen('menu');
      return;
    }
    const nextFrame = result.win && result.mode === 'frame' ? result.frame + 1 : result.frame;
    startSession(result.mode, nextFrame);
  }, [result, startSession]);

  const handleMenu = useCallback(() => {
    setScreen('menu');
  }, []);

  const handleLoaderDone = useCallback(() => {
    setScreen('menu');
  }, []);

  const openPantry = useCallback(() => {
    setPantrySection('JARS');
    setScreen('pantry');
  }, []);

  const openTips = useCallback(() => {
    setPantrySection('TIPS');
    setScreen('pantry');
  }, []);

  const openSettings = useCallback(() => {
    setScreen('settings');
  }, []);

  const dims = useMemo(
    () => BOARD_SIZES[session ? session.size : settings.boardSize],
    [session, settings.boardSize],
  );

  let body: React.ReactNode = null;

  if (screen === 'loader') {
    body = <LoaderScreen onDone={handleLoaderDone} />;
  } else if (screen === 'menu') {
    body = (
      <MenuScreen
        frame={progress.frame}
        jars={progress.jars.length}
        streak={progress.streak}
        season={season}
        unlockedSeason={unlockedSeason}
        onSelectSeason={setSeason}
        onPlay={handlePlay}
        onRelax={handleRelax}
        onDaily={handleDaily}
        onPantry={openPantry}
        onTips={openTips}
        onSettings={openSettings}
      />
    );
  } else if (screen === 'game' && session) {
    body = (
      <GameScreen
        key={session.round}
        frame={session.frame}
        mode={session.mode}
        seed={session.seed}
        rows={dims.rows}
        cols={dims.cols}
        seasonIndex={session.seasonIndex}
        slack={session.slack}
        colorblind={settings.colorblind}
        onExit={handleMenu}
        onGameOver={handleGameOver}
      />
    );
  } else if (screen === 'gameover' && result) {
    body = (
      <GameOverScreen result={result} onPlayAgain={handlePlayAgain} onMenu={handleMenu} />
    );
  } else if (screen === 'pantry') {
    body = (
      <PantryScreen
        progress={progress}
        avgSpare={avgSpare}
        initialSection={pantrySection}
        onMenu={handleMenu}
      />
    );
  } else if (screen === 'settings') {
    body = (
      <SettingsScreen
        settings={settings}
        onChange={setSettings}
        onResetProgress={reset}
        onMenu={handleMenu}
      />
    );
  } else {
    body = (
      <MenuScreen
        frame={progress.frame}
        jars={progress.jars.length}
        streak={progress.streak}
        season={season}
        unlockedSeason={unlockedSeason}
        onSelectSeason={setSeason}
        onPlay={handlePlay}
        onRelax={handleRelax}
        onDaily={handleDaily}
        onPantry={openPantry}
        onTips={openTips}
        onSettings={openSettings}
      />
    );
  }

  return <View style={styles.root}>{body}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
});
