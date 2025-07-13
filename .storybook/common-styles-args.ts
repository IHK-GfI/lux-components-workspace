import { ArgTypes } from '@storybook/angular';

export const luxButtonBadgeColor: ArgTypes<any> = {
  luxButtonBadgeColor: {
    control: 'select',
    options: ['primary', 'accent', 'warn', undefined]
  }

};
export const luxColor: ArgTypes<any> = {
  luxColor: {
    control: 'select',
    options: ['primary', 'accent', 'warn', undefined]
  }
};

export const luxTextboxColor: ArgTypes<any> = {
  luxColor: {
    control: 'select',
    options: ['red', 'blue', 'green', 'yellow', undefined]
  }
};

export const iconSize: ArgTypes<any> = {
  iconSize: {
    control: 'select',
    options: ['1x', '2x', '3x', '4x', '5x']
  }
};

export const luxBgBaseColor: ArgTypes<any> = {
  luxColor: {
    control: 'select',
    options: ['red', 'green', 'purple', 'blue', 'gray', 'orange', undefined]
  }
};
