# Last Night

One app for iPhone, tablet and desktop, maintained in the root `index.html`, `css/` and `js/`. The duplicate versions have been removed. No account, backend, analytics, external fonts or third-party scripts are used.

## Run locally

From this directory run `python3 -m http.server 8765 --bind 127.0.0.1` and open http://127.0.0.1:8765. Use a web server rather than double-clicking the HTML. This development server is for local use only.

## Publish safely

Run `python3 scripts/package.py`. Deploy only the contents of `/tmp/last-night-deploy.zip` to an HTTPS static host. Do not publish the entire workspace. The package uses an explicit list of public files, excluding notes, tests, hidden files, credentials and backups. Update the allowlist when adding a public asset.

`_headers` supplies security headers for hosts that support that format (for example Netlify and Cloudflare Pages). On other hosts configure equivalent response headers yourself. GitHub Pages does not apply this file. The HTML also includes a Content Security Policy; anti-framing protection requires the hosting response header. Inline styles are allowed for the existing dynamic visual effects; inline scripts are blocked.

Everything delivered to the browser is public code: never put passwords, tokens or private content in HTML, JavaScript, CSS, icons or the manifest. Hiding an element does not secure its contents. Private services added in future need server-side credentials and access control.

On iPhone open the HTTPS address in Safari, then Share → Add to Home Screen. Use the same address on desktop. Offline support is available after the first successful online load. The app checks the network for its public assets on each load and falls back to its scoped cache offline. Worker changes activate after existing app windows close. Hosting should revalidate HTML, JavaScript, CSS and `sw.js` rather than applying long immutable cache lifetimes.

## Your data

Fridge data stays in this browser's local storage under `fridge.v1`. It is not sent to a server and does not sync between devices. It is not encrypted or protected from someone using your browser profile. Back up and Restore in Settings transfers it manually; keep exported JSON files private. Existing data on the same origin is retained, while changing host or browser requires backup/restore. Back up before moving an existing deployment.

## Checks

Run `node scripts/check.cjs` and `python3 scripts/package.py`. These check application rendering logic, import and saved-state validation, escaping, and deployment contents. Real-device checks are still needed for iPhone installation, keyboard layout, safe areas and offline relaunch.
