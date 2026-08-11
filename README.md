# AIZEN METAL

Website for an aluminium billet foundry in Radinovo, North Industrial Zone,
Plovdiv — scrap intake, remelting, and cast homogenised extrusion billets in
EN AW-6060 and EN AW-6063, certified by the plant's own laboratory.

Bulgarian first, English one click away.

## The idea

The hero runs the plant's own sequence on a loop, in WebGL: metal pours from
the launder into the mould, the cast billet cools on camera from white-hot to
brushed aluminium, billets stack into a strapped bundle, and a flatbed pulls in
to take it away. The stage chips under the copy steer it — click one and the
reel jumps there — and the readout beside them tracks the temperature of the
metal in that stage, 720 °C down to ambient.

The interface itself is aluminium: buttons, chips and accents are milled metal
with a bevel and a specular sweep, and fire only ever appears inside the
furnace. The laboratory section cuts hard to daylight white, because that is
where the metal stops glowing and starts being measured.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- react-three-fiber / three — custom GLSL, no model files, no HDR downloads
- The logo is the supplied artwork, background-keyed to transparency and split
  into mark / wordmark / stacked lockup (`public/media/logo-*.png`)
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
- Photos: see `public/media/README.md`. The logo is already in place; the
  master file stays at `public/media/logo.PNG` and the three derived PNGs are
  generated from it.

## Content

All copy lives in `lib/content.ts`, both languages side by side. Adding a
string means adding it to `bg` and `en` — TypeScript enforces the shape.
