# Breathless

**Current version: v0.3.8** (pre-release; builds stay on v0.x and v1.0 is reserved for the official release).

First-person survival game (Subnautica-style view, Oxygen Not Included-style systems). Oxygen management is the core. A new game starts at a crashed escape pod with the objective FIND SHELTER, and the objective chain ends at BREATHING ROOM.

- `index.html` — the whole game (Three.js, `lib/three.module.js`). Serve this folder with `python3 -m http.server <port>` (for example 8766) and open `http://localhost:<port>/`.
- `DESIGN.md` — design brief, user rules and per-slice build log.
- `play/` — screenshots, selftest results and test scripts. Run selftests with `?selftest` (CDP runner `play/run_selftest.mjs`). `?playthrough` runs the scripted new-game → ending playthrough; `?playthrough&labor` does the same with crew labour instead of scrap top-ups. `play/run_deathflow.mjs` checks the death screen's continue and new-game paths.
- `.backup/` — snapshots of index.html before each slice.

## Version history
Older builds were labelled "prototype X.Y" or "vX.Y". Read them as **v0.X.Y**: prototype 0.1-0.9 = v0.0.x, 1.x = v0.1.x, 2.x (to 2.9.1) = v0.2.x, and v3.0-v3.3 = v0.3.0-v0.3.3. Builds since then are v0.3.4, v0.3.5, v0.3.6, v0.3.7 and v0.3.8 (current, Cell 4 landfill methane power). Old saves still load. The full table is in `DESIGN.md`.

