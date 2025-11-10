export const lightTheme = {
  token: {
    colorPrimary: "#1890ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1890ff",
    colorBgBase: "#ffffff",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBorder: "#d9d9d9",
    colorBorderSecondary: "#f0f0f0",
    colorText: "#000000d9",
    colorTextSecondary: "#00000073",
    colorTextTertiary: "#00000040",
    borderRadius: 8,
    wireframe: false,
    fontSize: 14,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
      boxShadow:
        "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
    },
    Layout: {
      headerBg: "#ffffff",
      headerPadding: "0 24px",
      siderBg: "#001529",
    },
    Menu: {
      itemBorderRadius: 8,
    },
  },
};

export const darkTheme = {
  token: {
    colorPrimary: "#177ddc",
    colorSuccess: "#49aa19",
    colorWarning: "#d89614",
    colorError: "#dc4446",
    colorInfo: "#177ddc",
    colorBgBase: "#141414",
    colorBgContainer: "#1f1f1f",
    colorBgElevated: "#262626",
    colorBorder: "#434343",
    colorBorderSecondary: "#303030",
    colorText: "#ffffffd9",
    colorTextSecondary: "#ffffff73",
    colorTextTertiary: "#ffffff40",
    borderRadius: 8,
    wireframe: false,
    fontSize: 14,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
      boxShadow:
        "0 1px 2px 0 rgba(255, 255, 255, 0.03), 0 1px 6px -1px rgba(255, 255, 255, 0.02), 0 2px 4px 0 rgba(255, 255, 255, 0.02)",
    },
    Layout: {
      headerBg: "#1f1f1f",
      headerPadding: "0 24px",
      siderBg: "#001529",
    },
    Menu: {
      itemBorderRadius: 8,
    },
  },
};

export const customColors = {
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  secondary: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
};

export const breakpoints = {
  xs: "480px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1600px",
};

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  xxl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
};
