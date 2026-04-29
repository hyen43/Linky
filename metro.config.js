const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

const finalConfig = withNativeWind(config, { input: "./global.css" });

// zustand v5 conditional exports resolve to ESM (.mjs) which uses import.meta,
// crashing on web (Metro/Hermes). Force Metro to use the CJS builds instead.
finalConfig.resolver = {
  ...finalConfig.resolver,
  resolveRequest: (context, moduleName, platform) => {
    const cjsOverrides = {
      "zustand/middleware": "zustand/middleware.js",
      "zustand/shallow":    "zustand/shallow.js",
      "zustand/vanilla":    "zustand/vanilla.js",
    };
    if (cjsOverrides[moduleName]) {
      return {
        filePath: path.resolve(__dirname, "node_modules", cjsOverrides[moduleName]),
        type: "sourceFile",
      };
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = finalConfig;
