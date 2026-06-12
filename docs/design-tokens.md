# docs/design-tokens.md — the look + the voice

> White base, deep blue accent, light blue tints, soft and rounded, alive. The exact tokens live in
> `frontend/tailwind.config.js`; this is the reference. **The voice section is part of the spec** —
> the human, playful copy is a feature, not decoration.

---

## Colors

| Token | Hex | Use |
|---|---|---|
| `blue` (primary) | `#002B5C` | deep navy (M.C. Dean brand) — primary buttons, active nav, accents, chart |
| `blue-hover` | `#1464B4` | hover on primary — royal blue from the brand chevron |
| `blue-tint` | `#DCEDFA` | light blue — soft backgrounds, badges, icon squares |
| `blue-card` | `#F0F7FD` | lightest blue — card surfaces (`Card`, progress rows) |
| `ink` | `#1A1A2E` | text, dark avatars |
| page bg | `#FFFFFF` | white, with a faint light-blue radial glow top-right |

**Status colors** (rendered as pill badges, pulsing dot on processing):

| Status | Color | Meaning |
|---|---|---|
| processing | amber `#F59E0B` | reading screens now |
| done | green `#16A34A` | paperwork ready |
| failed | red `#DC2626` | didn't go through |
| queued | gray `#9CA3AF` | waiting |

---

## Type

- **Font:** Inter (Google Fonts, loaded in `index.html`), weights 400–900.
- Headings: extrabold, tight tracking. Numbers: extrabold.
- Body: 14–15px, `text-ink` at 55–70% opacity for secondary text.

---

## Shape & motion

- **Radius:** `rounded-2xl` (1rem) cards, `rounded-xl` inputs/buttons, `rounded-full` pills/avatars.
- **Shadows:** `shadow-card` (resting), `shadow-soft`, `shadow-lift` (blue-tinted, on hover). Soft,
  never hard.
- **Motion:** `.lift` (hover translate-up), `.press` (active scale 0.97), `animate-fade-in`,
  `animate-pop-in`, `animate-bounce-in`, `animate-pulse-dot`, striped `.bar-animated` progress,
  hand-rolled confetti on batch completion.

---

## Components (where the patterns live)

| Pattern | File |
|---|---|
| Button (primary/secondary/subtle/ghost/danger) | `components/ui/Button.jsx` |
| Card | `components/ui/Card.jsx` |
| Modal / Drawer | `components/ui/{Modal,Drawer}.jsx` |
| Skeleton loaders | `components/ui/Skeleton.jsx` |
| Empty state | `components/ui/EmptyState.jsx` |
| Searchable picker (+ add-new) | `components/ui/SearchSelect.jsx` |
| Status pill (pulsing dot) | `components/StatusBadge.jsx` |
| Reusable runs table | `components/RunsTable.jsx` |

---

## Voice — how MC DEAN Optimus talks (NON-NEGOTIABLE)

Simple words, short punchy lines, a little playful. The app talks *to* the user. **Never** robotic
("Operation completed successfully" is banned). Match these — they're the ones already shipped:

| Moment | Copy |
|---|---|
| Empty dashboard | "Nothing here yet. Let's change that. 🚀" → Start your first run |
| Upload zone | "Drop your screenshots here — MC DEAN Optimus will do the boring part" |
| Processing | "MC DEAN Optimus is reading your screens… ☕ grab a coffee" |
| Done | "Paperwork's ready. You didn't lift a finger. 📄✨" |
| Failed | human reason + "One click to retry." |
| Run confirm | "Ready to fire off 7 devices?" |
| Batch complete | "All 20 devices completed ✅ That just saved you hours." |
| Toast: start | "Run started — sit back 😎" |
| Toast: zip | "ZIP is ready to grab" |
| Toast: invite | "Invite sent ✉️" |
| Validation: too few | "Need at least 2 screenshots to work the magic" |
| Validation: too many | "4 is the max — MC DEAN Optimus has limits 😅" |
| Validation: wrong type | "PNG or JPG only, please" |

When you add a new string, write it like a friendly coworker would say it out loud.
