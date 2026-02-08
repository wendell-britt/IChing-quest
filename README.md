# I Ching → BAR → QUEST (Party Artifact Widget)

An I Ching “smart quest” widget designed for parties: players **draw a hexagram**, it’s stored as a **`BAR`**, then a `BAR` can be **minted into an actionable `QUEST`** (hexagram + trigram archetype + story moment) that can be redeemed for **vibeulons**.

The intended vibe is *Meow Wolf / OmegaMart*: a found “orientation terminal” that helps people locate themselves in space/time during the party.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`).

## What’s implemented (MVP)

- **Draw Hexagram → BAR**: 3-coin method simulated; moving lines glow.
- **BAR Vault**: BARs are persisted in `localStorage`.
- **Trigram → Archetype**: each trigram maps to an archetype.
- **BAR → QUEST**: choose a story moment + archetype, mint a quest, redeem for vibeulons.

## Next up

- Calibration wizard: let players modify their archetype profile over time.
- Optional multiplayer sync (QR codes or a tiny backend) so multiple devices share the same ledger.