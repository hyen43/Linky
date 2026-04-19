// Hermes doesn't define `document` — polyfill so HMR code doesn't throw ReferenceError
if (typeof (global as any).document === "undefined") {
  (global as any).document = undefined;
}

import "expo-router/entry";
