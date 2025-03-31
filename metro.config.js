// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { mergeConfig } = require("metro-config");

const defaultConfig = getDefaultConfig(__dirname);

/** @type {import('expo/metro-config').MetroConfig} */
const config = {
  resolver: {
    unstable_enablePackageExports: true,
    unstable_conditionNames: ["import"],
  },
};

module.exports = mergeConfig(defaultConfig, config);
