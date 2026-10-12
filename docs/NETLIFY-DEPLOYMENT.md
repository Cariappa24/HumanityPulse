# HumanityPulse — Netlify deployment

Use `HumanityPulse-Netlify.zip` for Netlify. It is a self-contained React/Vite website with Netlify Functions and Netlify Blobs caching. It does not require Cloudflare, D1, a paid map tile provider, or an AI API.

## What changed

MapLibre v6 requires a separate module worker. The first build bundled the main library but omitted the worker and its shared dependency. The repaired build ships both under `public/maplibre/6.12.0/` and sets the worker URL explicitly. Do not delete that directory.

An interactive SVG world map appears immediately while WebGL loads. If WebGL or its worker fails, the SVG map continues to support zoom controls, dragging, keyboard panning, country filtering and incident selection. The list view remains available. The SVG fallback does not cluster markers; WebGL mode does.

## Recommended: deploy from a GitHub repository

1. Download and extract `HumanityPulse-Netlify.zip`.
2. Open the extracted `HumanityPulse-Netlify` folder. Confirm `package.json`, `index.html`, `netlify.toml`, `public`, and `netlify/functions` are immediately inside it.
3. Create a new GitHub repository for this project. Upload the **contents** of that folder into the repository root. Include `public/maplibre`, all `lib`/`data`/`components` files, and `netlify/functions`. Do not upload a `node_modules` folder or your local `.env` files.
4. Sign in to Netlify. Use **Add new project → Import an existing project** (labels may vary), choose GitHub, and select the repository.
5. Set or confirm these values:

| Field | Value |
|---|---|
| Base directory | Leave empty when `package.json` is at repository root |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` (already in netlify.toml) |
| Node version | `22` (already in netlify.toml) |

6. Deploy. Netlify installs the package dependencies and builds the website. The bundled `netlify.toml` routes `/api/*` to Functions and deep links to the app.
7. Open the assigned `https://...netlify.app` address. Use Ctrl+Shift+R on Windows for a hard refresh if your browser previously loaded an older build.
8. Verify these paths:
   - `/` — world map and incident list.
   - `/api/health` — JSON with `status: "ok"`.
   - `/api/incidents` — source records and freshness labels. The first fetch can take several seconds.
   - `/maplibre/6.12.0/maplibre-gl-worker.mjs` — JavaScript, not an HTML 404 page.
   - `/maplibre/6.12.0/maplibre-gl-shared.mjs` — JavaScript, not an HTML 404 page.
   - `/help`, `/support`, `/sources` — working pages after a direct refresh.
9. Add your own domain using Netlify's domain settings if desired.

**Do not simply drag the source ZIP or a `dist` folder into Netlify Drop for the live application.** Static drag-and-drop alone does not deploy these source Functions. Use Git import or the CLI method below. Without Functions, the map still renders but official feed requests and payment configuration cannot work.

## Optional local check / command-line deployment

Install Node.js 22 LTS. Open PowerShell or a terminal in the extracted folder, then run:

```powershell
npm install
npm run typecheck
npm run build
npx netlify-cli login
npx netlify-cli init
npx netlify-cli deploy --build
```

Review the draft URL and confirm map/API behavior. Then deploy to production:

```powershell
npx netlify-cli deploy --build --prod
```

`netlify.toml` supplies the build, publish and Functions settings. `npx netlify-cli dev` is the local option that includes Functions; plain `npm run dev` serves only the frontend and does not supply live API endpoints. A local CLI session may need a linked Netlify project for Blobs integration. Public source fetches can still succeed without a writable local cache; that limitation is shown in source status.

Commit the generated `package-lock.json` after the first `npm install` to make future installs reproducible.

## Payment and contact settings

No payment destinations are invented. Start with all settings empty. Once the deployment works, add these in **Project configuration → Environment variables** (or the corresponding settings screen):

| Variable | Example format / purpose |
|---|---|
| CONTACT_EMAIL | Your public contact email |
| PAYPAL_URL | Your official account/payment URL on paypal.com or paypal.me |
| PATREON_URL | Your creator-page URL on patreon.com |
| COFFEE_URL | Your creator-page URL on buymeacoffee.com |
| BTC_ADDRESS | Your Bitcoin **mainnet** destination |
| ETH_ADDRESS | Your Ethereum **mainnet** destination |
| USDC_ETH_ADDRESS | Your USDC destination on **Ethereum mainnet / ERC-20** |
| INGEST_TOKEN | Optional random server token, at least 24 characters |

If Netlify asks for variable scopes, include **Functions**. These values belong in server-side runtime settings, not variables named `VITE_*` and not public source files. Trigger a new deploy after changing settings, then check `/support`. No Blobs service token or provider API key is required by the three current official-feed adapters.

Project contributions support the website operator. Relief donations go directly to the linked relief organization. Publish the operator identity and finalize contact/legal notices before enabling public fundraising.

## Runtime differences and costs

This Netlify version uses Blobs for the latest provider snapshots with a 15-minute cache and Netlify CDN cache headers. Same-instance requests are coalesced; there is no distributed ingestion lock, relational database or immutable revision archive in this version. It does not import the Cloudflare-specific D1 runtime. Source retrieval failures use retained real records and show their original timestamps; no demo records are silently substituted.

This is a client-rendered app with working deep links; it does not supply server-rendered event-specific Open Graph previews. Connected sources and factual limitations are the same as the original release. No background schedule is enabled. If the site is unused, it does not continuously poll sources.

Netlify Functions, Blobs, builds, requests and bandwidth may consume plan usage/credits. Check your account's current limits before launching; no unlimited-free claim is made.

## Validation performed during delivery

The repaired Sites/Workers build and the separate Netlify frontend build were executed. Automated checks verify worker packaging, fallback geography, shared ingestion rules and Netlify function behavior with controlled source responses. Netlify account provisioning and a production deploy into your own account were not performed. Browser/touch/WebGL checks remain unverified because no approved browser-control capability was available in the execution environment.

## Troubleshooting

- **Map visible but no records:** Open `/api/health` and `/api/incidents`. If they return HTML, Functions were not deployed or redirects are missing. Redeploy from Git/CLI with `netlify.toml` at the repository root.
- **WebGL does not load:** Inspect the two `/maplibre/6.12.0/*.mjs` URLs. The SVG map remains usable. Confirm those files were uploaded and that a browser extension is not blocking workers.
- **Build cannot find a file:** Ensure the entire exported source folder was uploaded, not just `index.html` or the `components` directory.
- **Netlify detects Next.js:** You uploaded the original Cloudflare source package. Use the separate `HumanityPulse-Netlify.zip`, which contains a small Vite package without Next.js/Vinext dependencies.
- **Support buttons disabled:** Set the correct environment variables for Functions, then redeploy. Invalid provider domains and malformed wallet addresses are rejected.
- **Cached-source warning:** The upstream feed could not refresh. Check the source page for retrieval timestamps and provider status. It does not imply the real-world crisis has ended.

Official references:
- https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/
- https://docs.netlify.com/build/functions/overview/
- https://docs.netlify.com/build/data-and-storage/netlify-blobs/
- https://docs.netlify.com/build/configure-builds/file-based-configuration/
