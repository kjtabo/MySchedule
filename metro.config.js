// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Firebase/Expo SDK 53 workaround metro.config.js
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
