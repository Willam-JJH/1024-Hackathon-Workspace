import { basePreset, elementPlusPreset, miniprogramBasePreset } from 'tailwind-extensions';
import { isMp, isQuickapp } from '@uni-helper/uni-env';

const presets = [basePreset];
if (isMp || isQuickapp) {
  presets.push(
      elementPlusPreset({
        baseSelectors: [':root', 'page'],
      }),
      miniprogramBasePreset,
  );
} else {
  presets.push(elementPlusPreset());
}

const theme= {};
if (isMp || isQuickapp) theme.screens = {};

const config= {
  content: ['./public/index.html','./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  presets,
  theme,
    important: true,
};

export default config;