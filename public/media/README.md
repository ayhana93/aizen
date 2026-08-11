# Media slots

Drop the real files here with exactly these names. The site picks them up with
no code change; until a file exists, its slot shows a labelled placeholder
instead of a broken image.

| File          | Where it appears            | Suggested size        |
| ------------- | --------------------------- | --------------------- |
| `logo.png`    | header (transparent PNG/SVG) | height ≥ 120 px       |
| `furnace.jpg` | Process gallery — the melt   | 1600 × 1067, 3:2      |
| `casting.jpg` | Process gallery — casting pit | 1600 × 1067, 3:2     |
| `billets.jpg` | Process gallery — finished billets | 1600 × 1067, 3:2 |
| `lab.jpg`     | Laboratory section           | 1600 × 1000, 16:10    |

Keep each JPEG under ~400 KB — they are served as-is. If the photos are hosted
on ImageKit instead, replace the `src` values in `components/sections/*.tsx`
with the ImageKit URLs and add the transformation chain there.

`og.jpg` (1200 × 630) is worth adding too, for link previews; wire it into
`openGraph.images` in `app/layout.tsx` once it exists.
