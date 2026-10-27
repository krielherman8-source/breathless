# Breathless

**Current version: v0.4.1** (pre-release; builds stay on v0.x and v1.0 is reserved for the official release).

First-person survival game (Subnautica-style view, Oxygen Not Included-style systems). Oxygen management is the core. A new game starts at a crashed escape pod with the objective FIND SHELTER, and the objective chain ends at BREATHING ROOM.

- `index.html` — the whole game (Three.js, `lib/three.module.js`). Serve this folder with `python3 -m http.server <port>` (for example 8766) and open `http://localhost:<port>/`.
- `DESIGN.md` — design brief, user rules and per-slice build log.
- `play/` — screenshots, selftest results and test scripts. Run selftests with `?selftest` (CDP runner `play/run_selftest.mjs`). `?playthrough` runs the scripted new-game → ending playthrough; `?playthrough&labor` does the same with crew labour instead of scrap top-ups. `play/run_deathflow.mjs` checks the death screen's continue and new-game paths.
- `.backup/` — snapshots of index.html before each slice.

## Version history
Older builds were labelled "prototype X.Y" or "vX.Y". Read them as **v0.X.Y**: prototype 0.1-0.9 = v0.0.x, 1.x = v0.1.x, 2.x (to 2.9.1) = v0.2.x, and v3.0-v3.3 = v0.3.0-v0.3.3. Builds since then are v0.3.4, v0.3.5, v0.3.6, v0.3.7, v0.3.8 (Cell 4 landfill methane power) v0.3.9 (crew-labour pacing with a bench queue) v0.4.0 (crew routes between sealed zones) and v0.4.1 (current, cave-ins, shoring and dig breaches). Old saves still load. The full table is in `DESIGN.md`.

## v0.4.1: cave-ins, shoring and breaches (slice 43)
- **Rock stress**: a soft roof spanning more than 2 cells from a wall or support builds stress (0.02/s per extra cell). Dust appears at about 15 s, a creak and one LUCID line at about 30 s, and the roof falls at about 50 s (span 3). It is never random, and rock roofs never fall.
- **Cave-in**: a 3×3 footprint refills as rubble. Whoever is under it loses 30 % suit reserve or (crew) goes DOWN. Pipes and hoses pinch until dug clear, and cables stay broken until repaired. Crew re-plan around the fall or refuse cleanly.
- **Shoring prop**: costs 2 scrap and holds radius 1. +3 scrap upgrades it to T2 (header beam and braces, radius 2, 6→12 parts).
- **Rubble**: re-digs at 0.6× the time for scrap or ore.
- **Breaches**: digging into ARK-01's east hull opens a hole that equalises air with the drift pocket and hisses. ARK-01 drains in about 70 s, or 10 % as fast under rubble. Patch it by holding [E] (wall patch: 4 scrap, 1.5 s; bare scrap: 3 scrap, 4 s). LUCID gives one hint before the first breach.
- **Saves**: rubble, props, breaches and stress are saved. Old saves grandfather their existing spans.
- **Judgement calls**:
  - Breaches only happen where a hull exists.
  - Occupants are hurt rather than entombed.
  - Tells stay missable.
  - Nothing is free.
- **Tests**: selftest slice43. Full selftest 3×: 206/1 (the expected `slice8.A_noLink.remoteOk`). Playthroughs won: normal at 736 s (econ 824 s) and `&labor` at 1098 s (econ 1111 s), both with 0 collapses. Screenshots: `play/v041_s43_cavein.png`, `play/v041_s43_prop.png` and `play/v041_s43_breach.png`.

## v0.4.0: crew routes (slice 42)
- **Routes**: collared survivors (the crew) follow a zone and door graph across the base, the airlock, the surface lanes and ARK-01/02/03. There is a walk grid per zone (A* around colliders), and portals are the airlock doors and ARK hatches. On FOLLOW, crew walk through doors with you and ride the airlock with you. No more warping.
- **Doors**: crew cycle the airlock and hatches themselves. They wait for the cycle, the lock never has both doors open, and a crew member never cycles you outside. Bodies in the chamber ride along and don't block the lock.
- **Air**: a crew member crosses the surface only if its reserve covers the leg (×1.15 + 3 s). Otherwise the order is refused with a reason ("can't reach ARK-02: no air (needs 32s, has 6s)", "ARK-03 hatch sealed") and the job stays as it was. On the lane it turns back to the nearest refuge if its air won't last.
- **Orders to other zones**: `[Z]` on the LUCID or monitor crew panel picks the site (HERE, BASE, ARK-01/02/03). For example, LABOR @ ARK-02 walks the crew member to the ARK-02 bench.
- **Save/load mid-trip**: the trip goal is saved, and on load the crew member re-plans from where it stands.
- **Judgement calls**:
  - Crew lock cycles are quiet and still cost lock air.
  - Refusals go to the monitor log only, so they stay missable.
  - ARK air is finite (a worker in ARK-02 uses it up).
  - Two crew going opposite ways take turns in roster order.
  - Same-room moves keep the old steering.
  - Nothing became free.
- **Tests**: selftest slice42 (door cycling, airlock safety, cross-zone order, save mid-path). Full selftest 3×: 196/1 (the expected `slice8.A_noLink.remoteOk`). Playthroughs won: normal at 827 s and `&labor` at 1118 s. Screenshots: `play/v040_s42_airlock.png` and `play/v040_s42_route.png`.
