// Turns any TikTok URL into its bare form, e.g.
// https://www.tiktok.com/@user/video/123?is_from_webapp=1&sender_device=pc&web_id=...
//   -> https://www.tiktok.com/@user/video/123
function trimTikTokUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (!/(^|\.)tiktok\.com$/.test(url.hostname)) return null;

  // Video / photo post: keep only /@user/video/<id>
  const post = url.pathname.match(/^\/(@[^/]*)\/(video|photo)\/(\d+)/);
  if (post) return `https://www.tiktok.com/${post[1]}/${post[2]}/${post[3]}`;

  // Old mobile-site form: m.tiktok.com/v/<id>.html
  const mobile = url.pathname.match(/^\/v\/(\d+)/);
  if (mobile) return `https://www.tiktok.com/@/video/${mobile[1]}`;

  // Feed pages that carry the video id in the query string
  const id = url.searchParams.get("item_id") || url.searchParams.get("share_item_id");
  if (id && /^\d+$/.test(id)) return `https://www.tiktok.com/@/video/${id}`;

  // Short links (vm.tiktok.com/XXXX, tiktok.com/t/XXXX) and profiles: drop query + hash
  return `${url.protocol}//${url.hostname}${url.pathname.replace(/\/+$/, "")}`;
}

if (typeof module !== "undefined") module.exports = { trimTikTokUrl };
