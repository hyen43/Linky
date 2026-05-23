#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const appJsonPath = path.join(ROOT, "app.json");
const infoPlistPath = path.join(ROOT, "ios/linky/Info.plist");

// app.json 업데이트
const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
const [major, minor, patch] = appJson.expo.version.split(".").map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;
const newBuildNumber = String(Number(appJson.expo.ios.buildNumber) + 1);

appJson.expo.version = newVersion;
appJson.expo.ios.buildNumber = newBuildNumber;
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + "\n");

// Info.plist 업데이트
let plist = fs.readFileSync(infoPlistPath, "utf8");
plist = plist.replace(
  /(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]+(<\/string>)/,
  `$1${newVersion}$2`
);
plist = plist.replace(
  /(<key>CFBundleVersion<\/key>\s*<string>)[^<]+(<\/string>)/,
  `$1${newBuildNumber}$2`
);
fs.writeFileSync(infoPlistPath, plist);

console.log(`✅ 버전 업: ${newVersion} (빌드 ${newBuildNumber})`);
