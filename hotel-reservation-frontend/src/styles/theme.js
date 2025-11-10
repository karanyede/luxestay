// Consistent theme configuration for the entire application
// This ensures uniform colors and responsive breakpoints across all components

export const breakpoints = {
  xs: "480px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1600px",
};

export const lightTheme = {
  // Primary brand colors
  primary: "#1890ff",
  primaryHover: "#40a9ff",
  primaryActive: "#096dd9",

  // Background colors
  background: "#f5f5f5",
  surface: "#ffffff",
  surfaceSecondary: "#fafafa",

  // Text colors
  textPrimary: "#262626",
  textSecondary: "#595959",
  textDisabled: "#bfbfbf",

  // Border colors
  border: "#d9d9d9",
  borderLight: "#f0f0f0",

  // Status colors
  success: "#52c41a",
  warning: "#faad14",
  error: "#ff4d4f",
  info: "#1890ff",

  // Shadow
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowHover: "rgba(0, 0, 0, 0.15)",
};

export const darkTheme = {
  // Primary brand colors (consistent with light theme)
  primary: "#1890ff",
  primaryHover: "#40a9ff",
  primaryActive: "#096dd9",

  // Background colors
  background: "#141414",
  surface: "#1f1f1f",
  surfaceSecondary: "#262626",

  // Text colors
  textPrimary: "#ffffff",
  textSecondary: "#d9d9d9",
  textDisabled: "#595959",

  // Border colors
  border: "#434343",
  borderLight: "#303030",

  // Status colors (slightly adjusted for dark theme)
  success: "#52c41a",
  warning: "#faad14",
  error: "#ff4d4f",
  info: "#1890ff",

  // Shadow
  shadow: "rgba(0, 0, 0, 0.3)",
  shadowHover: "rgba(0, 0, 0, 0.4)",
};

// Responsive design utilities
export const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,

  // Min-width queries
  smUp: `@media (min-width: ${breakpoints.sm})`,
  mdUp: `@media (min-width: ${breakpoints.md})`,
  lgUp: `@media (min-width: ${breakpoints.lg})`,
  xlUp: `@media (min-width: ${breakpoints.xl})`,
};

// Common spacing values
export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
};

// Common animation durations
export const animations = {
  fast: "0.15s",
  normal: "0.3s",
  slow: "0.45s",
};

// Ant Design theme configuration
export const getAntdTheme = (isDark) => ({
  token: {
    colorPrimary: isDark ? darkTheme.primary : lightTheme.primary,
    colorBgBase: isDark ? darkTheme.background : lightTheme.background,
    colorBgContainer: isDark ? darkTheme.surface : lightTheme.surface,
    colorText: isDark ? darkTheme.textPrimary : lightTheme.textPrimary,
    colorTextSecondary: isDark
      ? darkTheme.textSecondary
      : lightTheme.textSecondary,
    colorBorder: isDark ? darkTheme.border : lightTheme.border,
    borderRadius: 8,
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    Layout: {
      headerBg: isDark ? darkTheme.surface : lightTheme.surface,
      colorBgSider: isDark ? darkTheme.surface : lightTheme.surface,
    },
    Menu: {
      colorBgContainer: isDark ? darkTheme.surface : lightTheme.surface,
    },
    Card: {
      colorBgContainer: isDark ? darkTheme.surface : lightTheme.surface,
    },
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
  },
});
