// Paleta de colores corporativa - Plataforma Boliviana
// Seguir estrictamente este orden y valores HEX

export const BRAND_COLORS = {
  // Color Primario (Morado Principal)
  primary: '#744C7A',
  primaryRgb: 'rgb(116, 76, 122)',
  
  // Color Secundario (Rosa/Fucsia)
  secondary: '#D93069',
  secondaryRgb: 'rgb(217, 48, 105)',
  
  // Color Terciario (Morado Oscuro)
  tertiary: '#5A3B85',
  tertiaryRgb: 'rgb(90, 59, 133)',
  
  // Color Cuaternario (Amarillo/Dorado)
  quaternary: '#F4B942',
  quaternaryRgb: 'rgb(244, 185, 66)',
  
  // Color Quinto (Turquesa)
  fifth: '#1BB5A0',
  fifthRgb: 'rgb(27, 181, 160)',
  
  // Colores Neutros Permitidos
  white: '#FFFFFF',
  black: '#000000',
  grayDark: '#333333',
  grayLight: '#F8F9FA',
} as const;

// Gradientes Permitidos
export const BRAND_GRADIENTS = {
  // Gradiente Principal
  primary: 'linear-gradient(135deg, #744C7A 0%, #5A3B85 100%)',
  
  // Gradiente Secundario
  secondary: 'linear-gradient(135deg, #D93069 0%, #744C7A 100%)',
  
  // Gradiente Complementario
  complementary: 'linear-gradient(135deg, #1BB5A0 0%, #F4B942 100%)',
} as const;

// Tipografías
export const BRAND_FONTS = {
  // Tipografía Principal: Dimbo
  primary: "'Dimbo', sans-serif",
  
  // Tipografía Secundaria: Helvetica LT Std
  secondary: "'Helvetica LT Std', 'Helvetica Neue', Arial, sans-serif",
  
  // Fallback para Web
  fallback: "'Helvetica Neue', 'Arial', 'Roboto', sans-serif",
} as const;

// Espaciado modular
export const BRAND_SPACING = {
  xs: '16px',
  sm: '24px',
  md: '32px',
  lg: '48px',
  xl: '64px',
} as const;

// Tamaños de iconos estándar
export const ICON_SIZES = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
} as const;