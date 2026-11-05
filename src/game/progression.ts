import { FRAMES_PER_SEASON, SEASONS, SEASON_SLACK, TOTAL_FRAMES } from '../constants/config';

export type JarTier = 'BRONZE' | 'SILVER' | 'GOLD';

export function seasonIndexOfFrame(frame: number): number {
  const i = Math.floor((frame - 1) / FRAMES_PER_SEASON);
  return Math.max(0, Math.min(SEASONS.length - 1, i));
}

export function seasonName(frame: number): string {
  return SEASONS[seasonIndexOfFrame(frame)];
}

export function slackForFrame(frame: number): number {
  return SEASON_SLACK[seasonIndexOfFrame(frame)];
}

export function firstFrameOfSeason(seasonIndex: number): number {
  return seasonIndex * FRAMES_PER_SEASON + 1;
}

export function jarTier(spare: number): JarTier {
  if (spare >= 3) {
    return 'GOLD';
  }
  if (spare >= 1) {
    return 'SILVER';
  }
  return 'BRONZE';
}

export function jarTierColor(tier: JarTier): string {
  if (tier === 'GOLD') {
    return '#E0A100';
  }
  if (tier === 'SILVER') {
    return '#A9A392';
  }
  return '#C98F00';
}

export function clampFrame(frame: number): number {
  if (frame < 1) {
    return 1;
  }
  if (frame > TOTAL_FRAMES) {
    return TOTAL_FRAMES;
  }
  return frame;
}

export function fillPercent(owned: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.round((owned / total) * 100);
}
