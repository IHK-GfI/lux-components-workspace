import { ArgTypes } from '@storybook/angular';
import luxIcons from '../../../node_modules/@ihk-gfi/lux-components-icons-and-fonts/assets/icons/lux-icons.json';

const iconNames = luxIcons.map(icon => {
  return icon.iconName.split('--')[0];
});

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

export const luxIconName: ArgTypes<any> = {
  luxIconName: {
    control: 'select',
    options: iconNames
  }
};

export const luxMenuIconName: ArgTypes<any> = {
  luxMenuIconName: {
    control: 'select',
    options: iconNames
  }
};
