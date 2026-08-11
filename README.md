# AIZEN METAL

Website for an aluminium billet foundry in Radinovo, North Industrial Zone,
Plovdiv — scrap intake, remelting, and cast homogenised extrusion billets in
EN AW-6060 and EN AW-6063, certified by the plant's own laboratory.

Bulgarian first, English one click away.

## The idea

The page runs at the temperature of the metal. A single value — `--heat`,
0 for a cold billet and 1 for the melt at 720 °C — is driven by scroll
position and read by everything else: the WebGL billet's blackbody shader, the
ember particles, the accent colour, and the fixed temperature gauge on the
right. Scrolling into the furnace heats the page up; scrolling on to dispatch
and the laboratory cools it back down, and the laboratory section cuts hard to
daylight white because that is where the metal stops glowing and starts being
measured.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- react-three-fiber / three — custom GLSL, no model files, no HDR downloads
- Lenis for smooth scrolling
- Hand-written CSS with design tokens; no UI framework
- Zod-validated inquiry endpoint

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Environment variables

| Variable         | Required | What it does                                              |
| ---------------- | -------- | --------------------------------------------------------- |
| `RESEND_API_KEY` | no       | Enables email delivery of inquiries via Resend             |
| `INQUIRY_TO`     | no       | Recipient mailbox (defaults to `site.email`)               |
| `INQUIRY_FROM`   | no       | Sender identity, must be a domain verified in Resend       |
| `PORT`           | no       | Set by Railway automatically                               |

Without `RESEND_API_KEY` the form still validates and returns success, and the
inquiry is written to the server log — so nothing is lost while the mailbox is
being set up. Wire the key in before launch.

## Before this goes public

Everything marked `PLACEHOLDER` in `lib/site.ts` is a guess and needs the real
value:

- `email`, `phone`, `phoneHref`
- `domain` / `url`
- `geo` — coordinates currently point at Radinovo village, not the plant gate

Also worth confirming:

- `site.diameters` and `site.lengths` — the configurator offers Ø152/178/203/228
  and 500–6000 mm. Trim to what the plant actually casts.
- The EN 573-3 composition table in `lib/content.ts` is reference data. Batch
  certificates are the authority; if the plant publishes tighter internal
  limits, use those.
- Photos: see `public/media/README.md`.

## Content

All copy lives in `lib/content.ts`, both languages side by side. Adding a
string means adding it to `bg` and `en` — TypeScript enforces the shape.
