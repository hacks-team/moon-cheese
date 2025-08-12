import { defineTokens } from '@pandacss/dev';

export const colors = defineTokens.colors({
  current: { value: 'currentColor' },

  neutral: {
    '01_black': {
      value: '#171717',
    },
    '02_gray': {
      value: '#505050',
    },
    '03_gray': {
      value: '#767676',
    },
    '04_gray': {
      value: '#BEBEBE',
    },
    '05_white': {
      value: '#ffffff',
    },
  },
  primary: {
    '01_primary': {
      value: '#FFC821',
    },
  },

  secondary: {
    '01_brown': {
      value: '#BF6300',
    },
    '02_orange': {
      value: '#FD9206',
    },
    '03_light-orange': {
      value: '#FFA938',
    },
  },
  state: {
    red: {
      value: '#FA1414',
    },
    green: {
      value: '#16A349',
    },
  },
  background: {
    '01_white': {
      value: '#FFFFFF',
    },
    '02_light-gray': {
      value: '#F7F7F8',
    },
    '03_gray': {
      value: '#F2F2F2',
    },
    '04_yellow': {
      value: '#FEFAE7',
    },
    '05_green': {
      value: '#E8F6ED',
    },
    '06_brown': {
      value: '#F9EFE5',
    },
  },
  border: {
    '01_gray': {
      value: '#E5E5EC',
    },
  },

  transparent: { value: 'rgb(0 0 0 / 0)' },
});
