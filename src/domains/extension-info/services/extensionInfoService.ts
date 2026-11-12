import type { ExtensionInfo } from "../types";

interface BrowserSignature {
  name: string;
  versionPattern: RegExp;
}

/**
 * Edge and Opera user agents also contain "Chrome", so they must be matched first.
 */
const BROWSER_SIGNATURES: BrowserSignature[] = [
  { name: "Edge", versionPattern: /Edg\/(\d+)/ },
  { name: "Opera", versionPattern: /OPR\/(\d+)/ },
  { name: "Firefox", versionPattern: /Firefox\/(\d+)/ },
  { name: "Chrome", versionPattern: /Chrome\/(\d+)/ },
];

function detectBrowserLabel(userAgent: string): string {
  for (const { name, versionPattern } of BROWSER_SIGNATURES) {
    const versionMatch = userAgent.match(versionPattern);

    if (versionMatch) {
      return `${name} ${versionMatch[1]}`;
    }
  }

  return "Inconnu";
}

export function getExtensionInfo(): ExtensionInfo {
  const { name, version } = browser.runtime.getManifest();

  return {
    name,
    version,
    browserLabel: detectBrowserLabel(navigator.userAgent),
  };
}
