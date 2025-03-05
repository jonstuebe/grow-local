const fontFamily = "System";

export const theme = {
  colors: {
    white: "#FFFFFF",
    blue: "#0A84FF",
    green: "#30D158",
    red: "#FF453A",
    gray050: "#E5E5EA",
    gray100: "#9C9CA1",
    gray200: "#8E8E93",
    gray300: "#636366",
    gray400: "#48484A",
    gray500: "#3A3A3C",
    gray600: "#2C2C2E",
    gray700: "#1C1C1E",
    gray800: "#19191B",
    gray900: "#161618",

    materials: {
      thick: "#353535",
    },

    fills: {
      primary: "rgba(120, 120, 128, .36)",
      secondary: "rgba(120, 120, 128, .32)",
      tertiary: "rgba(118, 118, 128, .24)",

      vibrantPrimary: "rgba(127, 127, 127, .5)",
      vibrantSecondary: "rgba(127, 127, 127, .4)",
      vibrantTertiary: "rgba(127, 127, 127, .2)",
    },

    labels: {
      primary: "#FFFFFF",
      secondary: "rgba(235, 235, 245, .6)",
      tertiary: "rgba(235, 235, 245, .3)",
      quaternary: "rgba(235, 235, 245, .16)",

      vibrantPrimary: "#FFFFFF",
      vibrantSecondary: "rgba(127, 127, 127, .5)",
      vibrantTertiary: "rgba(127, 127, 127, .4)",
      vibrantQuaternary: "rgba(127, 127, 127, .2)",
    },

    separators: {
      opaque: "#38383A",
      nonOpaque: "rgba(84, 84, 88, 0.45)",
    },

    rowContainer: "#1C1C1E",
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

  text: {
    rowLabel: {
      title: {
        fontSize: 17,
        lineHeight: 22,
        fontFamily,
      },
      subtitle: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily,
      },
    },
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

    rowContainer: 10,
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
