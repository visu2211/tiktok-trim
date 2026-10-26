const api = globalThis.browser ?? globalThis.chrome;
const $ = (id) => document.getElementById(id);
const statusEl = $("status");
const urlEl = $("url");

function hide(...ids) {
  ids.forEach((id) => $(id).classList.add("hidden"));
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    statusEl.textContent = "✓ Clean link copied";
    return;
  } catch {}
  urlEl.focus();
  urlEl.setSelectionRange(0, text.length);
  statusEl.textContent = document.execCommand("copy")
    ? "✓ Clean link copied"
    : "Tap “Copy clean link” to copy";
}

// The page URL, either from the tab itself or, if Safari withholds it, from inside the page.
async function currentUrl(tab) {
  if (tab?.url) return tab.url;
  try {
    const [res] = await api.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => location.href,
    });
    return res?.result;
  } catch {
    return undefined;
  }
}

(async () => {
  let tab, raw;
  try {
    [tab] = await api.tabs.query({ active: true, currentWindow: true });
    raw = await currentUrl(tab);
  } catch (e) {
    $("debug").textContent = String(e);
  }

  if (!raw) {
    statusEl.textContent = "Safari didn’t give TikTok Trim this page. Allow it on tiktok.com: aA menu → Manage Extensions, or Settings → Apps → Safari → Extensions → TikTok Trim.";
    hide("url", "copy", "share", "open");
    return;
  }

  const clean = trimTikTokUrl(raw);
  if (!clean) {
    statusEl.textContent = "Not a TikTok page";
    $("debug").textContent = raw;
    hide("url", "copy", "share", "open");
    return;
  }

  urlEl.value = clean;
  $("copy").onclick = () => copy(clean);

  if (navigator.share) $("share").onclick = () => navigator.share({ url: clean }).catch(() => {});
  else hide("share");

  // TikTok's app URL scheme opens a video directly by its id
  const id = clean.match(/\/(?:video|photo)\/(\d+)/);
  if (id) $("open").onclick = () => api.tabs.update(tab.id, { url: `snssdk1233://aweme/detail/${id[1]}` });
  else hide("open");

  if (!/\/(video|photo)\/\d+/.test(clean)) {
    $("debug").textContent = "No video id in this page’s address. Open the video itself (tap into it) and try again.";
  }

  await copy(clean);
})();
