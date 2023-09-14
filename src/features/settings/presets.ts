// theme
import palette from '../../theme/palette';
//
import { ThemeColorPresetsValue } from './types/types';

// ----------------------------------------------------------------------

const themePalette = palette('light');

export const presets = [
  // DEFAULT
  {
    name: 'default',
    ...themePalette.primary,
  },
];

export const defaultPreset = presets[0];
export const cyanPreset = presets[1];
export const purplePreset = presets[2];
export const bluePreset = presets[3];
export const orangePreset = presets[4];
export const redPreset = presets[5];

export const presetsOption = presets.map(color => ({
  name: color.name,
  value: color.main,
}));

export function getPresets(key: ThemeColorPresetsValue) {
  return {
    default: defaultPreset,
    cyan: cyanPreset,
    purple: purplePreset,
    blue: bluePreset,
    orange: orangePreset,
    red: redPreset,
  }[key];
}
