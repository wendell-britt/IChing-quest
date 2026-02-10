# I Ching → BAR → QUEST (Party Artifact Widget)

An I Ching “smart quest” widget designed for parties: players **draw a hexagram**, it’s stored as a **`BAR`**, then a `BAR` can be **minted into an actionable `QUEST`** (hexagram + trigram archetype + story moment) that can be redeemed for **vibeulons**.

The intended vibe is *Meow Wolf / OmegaMart*: a found “orientation terminal” that helps people locate themselves in space/time during the party.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`).

## Test on iPhone (Safari)

You need **some computer/server** to run the app and expose it via a URL your phone can reach.

### Option A0 (no extra services): GitHub Pages (recommended)

- **What you need**: GitHub repo admin access to enable Pages once.
- **How it works**: GitHub Actions builds the app and publishes it to Pages as a public HTTPS site.

Steps:
- In GitHub: repo → **Settings → Pages**
- Under “Build and deployment” set **Source** to **GitHub Actions**
- Then go to **Actions** → run “Deploy to GitHub Pages” (or just push a commit)
- Your iPhone link will be:
  - `https://<your-username>.github.io/IChing-quest/`

Once enabled for this repo, the expected URL is:
- `https://wendell-britt.github.io/IChing-quest/`

### Option A (easiest): Vercel/Netlify preview URLs

- **What you need**: a Vercel or Netlify account connected to GitHub.
- **How it works**: every push gets a **public HTTPS URL** you can open on iPhone.

Steps (Vercel):
- Import the GitHub repo
- Framework preset: **Vite**
- Build command: `npm run build`
- Output dir: `dist`
- **Important**: your working app is currently on branch `cursor/i-ching-quest-widget-2953`.
  - Fastest: in Vercel project settings → **Git** → set **Production Branch** to `cursor/i-ching-quest-widget-2953`
  - Or: open a PR into `main` and use Vercel’s **Preview Deployment** URL
- Deploy, then open the generated URL on your iPhone

If Vercel deploy is failing:
- In Vercel → Project → **Deployments** → open the latest failed deployment → **View Build Logs**
- Common fixes:
  - **Node version**: set Node to **20.x** in Vercel project settings (this repo includes `.nvmrc` = 20)
  - **Root Directory**: ensure it’s the repo root (where `package.json` lives)
  - **Build/Output**: `npm run build` and `dist`
  - If you imported the repo before the branch existed, hit **Redeploy** after refreshing the Git connection

Steps (Netlify):
- Add new site → Import from Git
- Build command: `npm run build`
- Publish directory: `dist`
- Deploy, then open the generated HTTPS URL on your iPhone

### Option B: GitHub Codespaces (live dev, port forwarding)

- **What you need**: GitHub Codespaces enabled for your account.
- **How it works**: run the dev server in Codespaces, then use the **forwarded HTTPS port URL** on iPhone.

Steps:
- Create/open a Codespace for the repo
- In the Codespace terminal:

```bash
npm install
npm run dev:host
```

- In “Ports”, set port `5173` to **Public** (or at least reachable), then open the forwarded URL in Safari.

### Option C: Run on your own machine + tunnel (ngrok / Cloudflare Tunnel)

- **What you need**: a laptop/desktop running the dev server + a tunneling tool.
- Run:

```bash
npm install
npm run dev:host
```

- Then expose `5173` using your tunnel provider and open the HTTPS link on iPhone.

## What’s implemented (MVP)

- **Draw Hexagram → BAR**: 3-coin method simulated; moving lines glow.
- **BAR Vault**: BARs are persisted in `localStorage`.
- **Trigram → Archetype**: each trigram maps to an archetype.
- **BAR → QUEST**: choose a story moment + archetype, mint a quest, redeem for vibeulons.

## Next up

- Calibration wizard: let players modify their archetype profile over time.
- Optional multiplayer sync (QR codes or a tiny backend) so multiple devices share the same ledger.