# Media slots

Drop the real files here with exactly these names. The site picks them up with
no code change; until a file exists, its slot shows a labelled placeholder
instead of a broken image.

| File          | Where it appears            | Suggested size        |
| ------------- | --------------------------- | --------------------- |
| `logo.PNG`    | master artwork (supplied)    | as delivered          |
| `logo-mark.png` | header, derived, transparent | 512 px wide         |
| `logo-word.png` | header wordmark, derived   | 1000 px wide          |
| `logo-full.png` | footer lockup, derived     | 1000 px wide          |
| `furnace.jpg` | Process gallery — the melt   | 1600 × 1067, 3:2      |
| `casting.jpg` | Process gallery — casting pit | 1600 × 1067, 3:2     |
| `billets.jpg` | Process gallery — finished billets | 1600 × 1067, 3:2 |
| `lab.jpg`     | Laboratory section           | 1600 × 1000, 16:10    |

Keep each JPEG under ~400 KB — they are served as-is. If the photos are hosted
on ImageKit instead, replace the `src` values in `components/sections/*.tsx`
with the ImageKit URLs and add the transformation chain there.

`og.jpg` (1200 × 630) is worth adding too, for link previews; wire it into
`openGraph.images` in `app/layout.tsx` once it exists.


## Regenerating the logo cut-outs

`logo-mark.png`, `logo-word.png` and `logo-full.png` were keyed out of
`logo.PNG` by flood-filling its smooth vignette background from the borders
(tolerance 4 levels) and trimming. If the master artwork is ever replaced,
regenerate the three derivatives the same way — the components load them by
name and nothing else needs to change.
