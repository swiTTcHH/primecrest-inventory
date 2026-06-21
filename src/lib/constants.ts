const orange_light = '#fd7b01';
const orange_dark = '#f75e01';
const blue_light = '#013b61';
const blue_dark = '#012849';

export const Colors = {
    light: {
        text: blue_dark,
        textSecondary: blue_light,
        background: '#ffffff',
        backgroundElement: '#F0F0F3',
        backgroundSelected: '#E0E1E6',
        accent: blue_light,
        accentDark: blue_dark,
        accentText: orange_light,
    },
    dark: {
        text: '#ffffff',
        background: blue_light,
        backgroundElement: '#212225',
        backgroundSelected: '#2E3135',
        textSecondary: '#B0B4BA',
        accent: orange_light,
        accentDark: orange_dark,
        accentText: blue_light,
    },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
