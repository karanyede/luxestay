// Responsive utility functions and hooks for consistent responsive behavior

import { useState, useEffect } from "react";
import { breakpoints } from "../styles/theme";

// Hook to detect screen size and provide responsive utilities
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenSize.width < parseInt(breakpoints.md);
  const isTablet =
    screenSize.width >= parseInt(breakpoints.md) &&
    screenSize.width < parseInt(breakpoints.lg);
  const isDesktop = screenSize.width >= parseInt(breakpoints.lg);
  const isLargeDesktop = screenSize.width >= parseInt(breakpoints.xl);

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoint: isMobile
      ? "mobile"
      : isTablet
      ? "tablet"
      : isDesktop
      ? "desktop"
      : "large",
  };
};

// Responsive grid utilities
export const getResponsiveGrid = (
  mobile = 24,
  tablet = 12,
  desktop = 8,
  large = 6
) => ({
  xs: mobile,
  sm: mobile,
  md: tablet,
  lg: desktop,
  xl: large,
  xxl: large,
});

// Responsive padding/margin utilities
export const getResponsiveSpacing = (mobile = 16, desktop = 24) => ({
  padding: `${mobile}px`,
  "@media (min-width: 768px)": {
    padding: `${desktop}px`,
  },
});

// Container max-widths for different screen sizes
export const containerMaxWidths = {
  sm: "540px",
  md: "720px",
  lg: "960px",
  xl: "1140px",
  xxl: "1320px",
};

// Responsive typography utilities
export const getResponsiveFontSize = (mobile, desktop) => ({
  fontSize: mobile,
  "@media (min-width: 768px)": {
    fontSize: desktop,
  },
});

// Common responsive configurations for Ant Design components
export const responsiveConfigs = {
  // Card spacing
  cardPadding: {
    xs: 16,
    sm: 16,
    md: 24,
    lg: 24,
    xl: 32,
  },

  // Layout sider
  siderWidth: {
    collapsed: 80,
    expanded: 256,
  },

  // Header height
  headerHeight: {
    mobile: 56,
    desktop: 64,
  },

  // Form layouts
  formLayout: {
    mobile: "vertical",
    desktop: "horizontal",
  },

  // Table scroll
  tableScroll: {
    x: 800, // Minimum width before horizontal scroll
    y: 400, // Maximum height before vertical scroll
  },
};

// Utility function to get responsive props for Ant Design components
export const getResponsiveProps = (component, breakpoint) => {
  const configs = {
    Layout: {
      mobile: {
        style: { minHeight: "100vh" },
      },
      desktop: {
        style: { minHeight: "100vh" },
      },
    },
    Sider: {
      mobile: {
        width: 0,
        collapsedWidth: 0,
        breakpoint: "lg",
        zeroWidthTriggerStyle: { top: 16 },
      },
      desktop: {
        width: responsiveConfigs.siderWidth.expanded,
        collapsedWidth: responsiveConfigs.siderWidth.collapsed,
        breakpoint: "lg",
      },
    },
    Header: {
      mobile: {
        style: {
          height: responsiveConfigs.headerHeight.mobile,
          lineHeight: `${responsiveConfigs.headerHeight.mobile}px`,
          padding: "0 16px",
        },
      },
      desktop: {
        style: {
          height: responsiveConfigs.headerHeight.desktop,
          lineHeight: `${responsiveConfigs.headerHeight.desktop}px`,
          padding: "0 24px",
        },
      },
    },
    Card: {
      mobile: {
        bodyStyle: { padding: "16px" },
        size: "small",
      },
      desktop: {
        bodyStyle: { padding: "24px" },
        size: "default",
      },
    },
    Form: {
      mobile: {
        layout: "vertical",
        requiredMark: false,
      },
      desktop: {
        layout: "horizontal",
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
    },
  };

  return configs[component]?.[breakpoint] || {};
};
