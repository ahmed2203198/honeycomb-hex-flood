import { Dimensions } from 'react-native';

export const SCREEN_W = Dimensions.get('window').width;
export const SCREEN_H = Dimensions.get('window').height;

/** Rule #13 - EXACTLY 8000ms, anything shorter races the screenshot gate. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_PROGRESS_MS = 7600;
export const LOADER_FADE_MS = 320;

export const HEADER_PAD_TOP = 44;
export const HEADER_CONTENT_H = 72;

/** Board geometry (rules #4 / #5). */
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 8
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const TRAY_RESERVE = 132;

export type BoardSizeKey = 'SMALL' | 'MEDIUM' | 'LARGE';

export const BOARD_SIZES: Record<BoardSizeKey, { rows: number; cols: number }> = {
  SMALL: { rows: 8, cols: 6 },
  MEDIUM: { rows: 9, cols: 7 },
  LARGE: { rows: 11, cols: 8 },
};

export const BOARD_SIZE_ORDER: BoardSizeKey[] = ['SMALL', 'MEDIUM', 'LARGE'];

export const BOARD_SIZE_LABEL: Record<BoardSizeKey, string> = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
};

/** Timings. */
export const RING_STAGGER_MS = 40;
export const JIGGLE_MS = 180;
export const SWEEP_MS = 600;
export const BEE_LOOP_MS = 2400;
export const METER_MS = 240;
export const ENTER_MS = 240;
export const RESULT_DELAY_MS = 480;

/** Progression. */
export const TOTAL_FRAMES = 200;
export const FRAMES_PER_SEASON = 50;
export const SEASONS: string[] = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];
export const SEASON_SLACK: number[] = [4, 3, 2, 1];

/** Generation. */
export const CLUSTER_CHANCE = 0.38;
export const UNDO_STACK_MAX = 20;
export const DROP_CHANCE = 0.05;
export const WALL_CHANCE: number[] = [0, 0, 0.06, 0.1];
export const MAX_SEED_ATTEMPTS = 40;
export const SOLVER_CAP = 60;

export type GameMode = 'frame' | 'relax' | 'daily';
