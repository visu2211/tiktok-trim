# TikTok Trim

A Safari extension for iPhone and Mac that strips the tracking junk off TikTok links so they open properly on your phone:

```
https://www.tiktok.com/@user/video/7312345678901234567?is_from_webapp=1&sender_device=pc&web_id=...
→ https://www.tiktok.com/@user/video/7312345678901234567
```

## Using it
- **iPhone:** on a TikTok video in Safari, tap the page menu (left of the address bar) → **TikTok Trim**. Copy the clean link, share it, or open the video in the TikTok app.
- **Mac:** click the toolbar button, or right-click any TikTok link → "Copy clean TikTok link".

## Layout
| Folder | What it is |
| --- | --- |
| `extension/` | The web extension source (manifest, popup, trimming logic). Edit here. |
| `iOS/` | Xcode project that packages the extension as an iPhone app. |
| `macOS/` | Xcode project that packages the extension as a Mac app. |

The Xcode projects keep their own copy of the extension files. After editing `extension/`, sync them:

```bash
for p in "iOS/TikTok Trim" macOS; do cp extension/*.js extension/*.html "$p/TikTok Trim Extension/Resources/"; done
```

## Installing on iPhone (free Apple ID)
1. Open `iOS/TikTok Trim/TikTok Trim.xcodeproj` in Xcode and sign in under Xcode → Settings → Accounts.
2. In the project's Signing & Capabilities, choose your Personal Team. Change the bundle ID if `com.visu22.tiktoktrim` is taken.
3. Plug in the iPhone, turn on Settings → Privacy & Security → Developer Mode, pick the phone as the run destination, and press ⌘R.
4. On the phone: Settings → General → VPN & Device Management → trust your Apple ID.
5. Settings → Apps → Safari → Extensions → TikTok Trim: turn it on and allow it on tiktok.com.

Apps signed with a free account expire after 7 days; re-run from Xcode to renew.

## Installing on Mac
Open `macOS/TikTok Trim.xcodeproj` and press ⌘R. In Safari, turn on Settings → Advanced → "Show features for web developers", then Developer → "Allow unsigned extensions", then enable TikTok Trim in Settings → Extensions. Safari turns "Allow unsigned extensions" off every time it quits.

## No-install option: a bookmarklet
Save a bookmark with this as its address and tap it on a TikTok page:

```
javascript:(()=>{const u=new URL(location.href),m=u.pathname.match(/^\/(@[^/]*)\/(video|photo)\/(\d+)/),c=m?`https://www.tiktok.com/${m[1]}/${m[2]}/${m[3]}`:u.origin+u.pathname;navigator.clipboard.writeText(c).then(()=>alert('Copied: '+c),()=>prompt('Copy this:',c))})()
```
