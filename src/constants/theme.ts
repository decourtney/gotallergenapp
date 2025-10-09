export const COLORS = {
  // Primary colors from branding
  primary: "#4CAF50", // Green (cow's magnifying glass)
  primaryLight: "#E8F5E9", // Light green
  primaryDark: "#388E3C", // Dark green

  // Secondary colors
  secondary: "#2196F3", // Blue (milk bottle/background)
  secondaryLight: "#E3F2FD", // Light blue
  secondaryDark: "#1976D2", // Dark blue

  // Accent colors
  accent: "#00BCD4", // Cyan/turquoise
  accentLight: "#E0F7FA", // Light cyan

  // Status colors
  success: "#4CAF50", // Green for safe
  successLight: "#E8F5E9", // Light green background
  warning: "#FF9800", // Orange for warnings
  warningLight: "#FFF3E0", // Light orange background
  danger: "#F44336", // Red for allergens detected
  dangerLight: "#FFEBEE", // Light red background

  // Neutral colors
  text: "#212121", // Dark text
  textLight: "#757575", // Medium gray text
  textMuted: "#9E9E9E", // Light gray text
  background: "#F5F5F5", // Light gray background
  white: "#FFFFFF",
  border: "#E0E0E0", // Light border
  shadow: "#00000015", // Subtle shadow
  overlay: "rgba(0,0,0,0.5)", // Dark overlay
  clear: "rgba(0,0,0,0)",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
};

export const FONT_WEIGHT = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};
