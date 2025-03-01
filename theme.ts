import { iOSColors } from "react-native-typography";

export const theme = {
  colors: {
    white: "#FFFFFF",
    blue: iOSColors.blue,
    green: iOSColors.green,
    red: iOSColors.red,
    gray100: "#9C9CA1",
    gray200: "#8E8E93",
    gray300: "#636366",
    gray400: "#48484A",
    gray500: "#3A3A3C",
    gray600: "#2C2C2E",
    gray700: "#1C1C1E",
    gray800: "#19191B",
    gray900: "#161618",
  },
  fontSize: {
    xs: 11,
    sm: 12,
    md: 13,
    lg: 15,
    xl: 17,
    "2xl": 19,
    "3xl": 21,
    "4xl": 24,
    "5xl": 27,
    "6xl": 32,
  },

  shadowColor: "#000",

  shadow: {
    none: {},
    xs: {
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,

      elevation: 1,
    },
    sm: {
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,

      elevation: 4,
    },
    md: {
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,

      elevation: 8,
    },
    lg: {
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,

      elevation: 12,
    },
    xl: {
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,

      elevation: 16,
    },
    "2xl": {
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.51,
      shadowRadius: 13.16,

      elevation: 20,
    },
  },

  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    "2xl": 16,
    circle: 99999,
  },

  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 24,
    "2xl": 32,
    "3xl": 64,
    "-xs": -4,
    "-sm": -6,
    "-md": -8,
    "-lg": -12,
    "-xl": -24,
    "-2xl": -32,
    "-3xl": -64,
  },
};
