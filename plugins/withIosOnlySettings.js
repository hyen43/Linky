const { withXcodeProject } = require("@expo/config-plugins");

/**
 * iPhone 전용 설정 플러그인
 * - Mac Catalyst 비활성화
 * - Mac/XR designed for iPhone/iPad 비활성화
 * prebuild --clean 후에도 설정이 유지됩니다.
 */
module.exports = withXcodeProject((config) => {
  const project = config.modResults;

  const settings = {
    SUPPORTS_MACCATALYST: "NO",
    SUPPORTS_MAC_DESIGNED_FOR_IPHONE_IPAD: "NO",
    SUPPORTS_XR_DESIGNED_FOR_IPHONE_IPAD: "NO",
    SUPPORTED_PLATFORMS: '"iphoneos iphonesimulator"',
  };

  ["Debug", "Release"].forEach((buildConfig) => {
    const section = project.pbxXCBuildConfigurationSection();
    Object.values(section).forEach((entry) => {
      if (entry.name === buildConfig && entry.buildSettings) {
        Object.entries(settings).forEach(([key, value]) => {
          entry.buildSettings[key] = value;
        });
      }
    });
  });

  return config;
});
