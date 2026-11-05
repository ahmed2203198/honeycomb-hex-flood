/**
 * Fixed Codex asset contract - reference NOTHING that is not listed here.
 */
export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  sprite1: require('../../assets/sprite_1.png'), // honeybee
  sprite2: require('../../assets/sprite_2.png'), // honey jar
  sprite3: require('../../assets/sprite_3.png'), // honey droplet
  sprite4: require('../../assets/sprite_4.png'), // wildflower
  sprite5: require('../../assets/sprite_5.png'), // wax comb chunk
  buttonRect: require('../../assets/button_rect.png'),
  buttonRound: require('../../assets/button_round.png'),
};

export type AssetKey = keyof typeof assets;
