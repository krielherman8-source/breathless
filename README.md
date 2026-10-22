# Breathless

First-person survival game (Subnautica-style view, Oxygen Not Included-style systems). Oxygen management is the core.

- `index.html` — the whole game (Three.js, `lib/three.module.js`). Serve with `python3 -m http.server 8765` and open http://localhost:8765/.
- `DESIGN.md` — design brief, user rules and per-slice build log.
- `play/` — screenshots, selftest results and test scripts. Run selftests with `?selftest`.
- `.backup/` — snapshots of index.html before each slice.

Public playable build: https://krielherman8-source.github.io/breathless-play/
