import * as moment from 'moment';
import * as tinycolor from 'tinycolor2';
export interface Color {
    name: string;
    hex: string;
    darkContrast: boolean;
}

export function getTransactionDate(): string{
    return moment().format('YYYYMMDD000000000');
}

export function savePrimaryColor(colorCode?: string ): void {
    const primaryColor = colorCode || localStorage.getItem('color') || '#E02C2B';
    const primaryColorPalette = computeColors(primaryColor);
    for (const color of primaryColorPalette) {
      const key1 = `--primary-${color.name}`;
      const value1 = color.hex;
      const key2 = `--primary-contrast-${color.name}`;
      const value2 = color.darkContrast ? 'rgba(black, 0.87)' : 'white';
      document.documentElement.style.setProperty(key1, value1);
      document.documentElement.style.setProperty(key2, value2);
    }
    document.documentElement.style.getPropertyPriority('--primary-50')
}

export function  computeColors(hex: string): Color[] {
  return [
    getColorObject(tinycolor(hex).lighten(52), '50'),
    getColorObject(tinycolor(hex).lighten(37), '100'),
    getColorObject(tinycolor(hex).lighten(26), '200'),
    getColorObject(tinycolor(hex).lighten(12), '300'),
    getColorObject(tinycolor(hex).lighten(6), '400'),
    getColorObject(tinycolor(hex), '500'),
    getColorObject(tinycolor(hex).darken(6), '600'),
    getColorObject(tinycolor(hex).darken(12), '700'),
    getColorObject(tinycolor(hex).darken(18), '800'),
    getColorObject(tinycolor(hex).darken(24), '900'),
    getColorObject(tinycolor(hex).lighten(50).saturate(30), 'A100'),
    getColorObject(tinycolor(hex).lighten(30).saturate(30), 'A200'),
    getColorObject(tinycolor(hex).lighten(10).saturate(15), 'A400'),
    getColorObject(tinycolor(hex).lighten(5).saturate(5), 'A700')
  ];
}

export function  getColorObject(value: any, name: any): Color {
  const c = tinycolor(value);
  return {
    name,
    hex: c.toHexString(),
    darkContrast: c.isLight()
  };
}

export function getContactId(): string {
  return localStorage.getItem('contactId') || '';
}