importScripts("trim.js");

// Right-click any TikTok link -> "Copy clean TikTok link" (Mac only; iOS Safari has no context menus)
if (chrome.contextMenus) chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copy-clean-tiktok",
    title: "Copy clean TikTok link",
    contexts: ["link", "page"],
    documentUrlPatterns: ["*://*.tiktok.com/*"],
  });
});

if (chrome.contextMenus) chrome.contextMenus.onClicked.addListener((info, tab) => {
  const clean = trimTikTokUrl(info.linkUrl || info.pageUrl);
  if (!clean || !tab) return;
  // Service workers can't touch the clipboard, so copy from inside the page.
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [clean],
    func: (text) => navigator.clipboard.writeText(text),
  });
});
