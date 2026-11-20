# Breathless — Game Bible

**Build documented:** v0.4.2 (pre-release, slice 44)  
**Sources:** `DESIGN.md`, `README.md`, and the v0.4.2 build in this repo  
**Date:** 20 November 2026  
**Owner:** Granite (Breathless Builder)

This bible describes the game as it is built today. Features that exist in the live build are written in the present tense. Anything that is not in the build — including the whole monetisation section, and every new roadmap item — is marked **PROPOSAL, needs Granite's approval**.

v1.0 is reserved for the official release. Builds stay on v0.x until then.

---

## 1. Concept and pitch

**Pitch:** a first-person survival game with a Subnautica-style view and Oxygen Not Included-style systems. Oxygen management is the core of the game.

You are the first human to test a teleporter built so humanity can reach the Kuiper belt. The jump goes wrong. You are trapped in a time bubble while the world outside ages, fights a nuclear war, and nearly dies. When the bubble bursts you have not aged a minute. The station is worn down, the surface has almost no air, and you crash-land beside a ruined bunker in a world that has already ended.

The fantasy is not a shootout. It is keeping a sealed room breathable — then a crew, then a chain of ARK bunkers — while quiet faults pile up until a crisis you could have prevented finally arrives.

### Design pillars (signed off, already in the build)

- **Oxygen first.** Every system either makes air, spends air, or fails in a way that threatens air.
- **It feels fine until it suddenly isn't.** Quiet degradation first (filter wear, a slow leak, dust in a tunnel). Then a cascade from neglect, never from a random roll. Warnings exist and can be missed.
- **Nothing is free.** Scrap, watts, water, hose length, collar charge and suit reserve all have a cost. Upgrades are earned by exploring and scanning, not by opening a menu.
- **Visible growth.** Every object is one mesh that grows. Tiers are bolt-on add-ons (a vice on the bench, a collar on a pipe, a burner kit on a generator), chosen from a T1–T5 dropdown, not a swapped model.
- **Scan once, keep the blueprint.** The omni-tool scan unlocks a recipe permanently. Crafting then costs materials only.
- **AAA graphics, quality only goes up.** The High preset is today's look. Ultra and Ultra+ only raise pixel ratio, supersampling, shadows and anisotropy. Quality options never lower the picture.
- **Cyan / red holograms.** A valid placement ghost is cyan/teal. An invalid one turns red and cannot be confirmed.

---

## 2. Core loop

A new game starts outside, next to a crashed escape pod. The first objective is **FIND SHELTER**: reach the bunker airlock and cycle in before the suit (stretched by the pod's emergency bottle) runs out.

From there the loop is:

1. **Breathe.** Live off room air when it is good; spend the suit reserve when it is not.
2. **Stabilise the bunker.** Wake LUCID, keep the oxygen plant watered, put a pump on the air, and keep power and pipes inside their ratings.
3. **Explore.** Cross the thin-air surface to ARK-01 (grow lab, first omni-tool), ARK-02 (robotics / LUCID body lab) and ARK-03 (power / mining works).
4. **Scan and build.** Scan a find once, craft it, place the cyan hologram, and bolt on higher tiers as you can afford them.
5. **Collar a crew.** Trap a feral survivor, fit a mood-dampener collar, and keep that collar charged. Crew breathe your air and are the main source of scrap.
6. **Expand carefully.** Dig, shore, pipe, and send crew through doors and airlocks to work in other zones. Wide unsupported tunnels and hull cuts have consequences.
7. **Bring power home.** Restart the ARK-03 turbine, sleeve the pylon line, and hold the bunker steady.

The loop ends at **BREATHING ROOM**: keep the ARK-03 feed live, at least two living collared crew, base O2 at 19% or higher and CO2 under 2%, for 300 seconds. A lapse bleeds the timer back at 2× rather than resetting it. A win card shows time, crew, ARKs, crises and relapses, then offers **Keep playing**. The sandbox continues. The ARK-03 hall slowly starving under a continuous turbine burn (about 17 minutes after the win) is intended — a quiet epilogue crisis, not a bug.

Day to day, the player is mostly attending: watering, swapping filters, charging collars, patching a hiss, sending someone to the ARK-02 bench, noticing a pipe load that has crept into amber. The spectacular failures (burst pipes, fires, cave-ins, a relapsed survivor) are what happen when that attention slips.

---

## 3. Mechanics and systems

### 3.1 Air, gas and life support

The player breathes the local volume (base, airlock, a dug pocket, an ARK, or the surface). If that air is unbreathable, the suit reserve drains. Empty reserve is game over, with a continue-from-save or new-game path.

Gases live in pockets and rooms and move through a pipe network. Pipes sit on a 0.5 m grid, are explicitly linked, and are reinforced in place — never replaced. Overload is `(flow − max) / max`:

| Overload | What happens |
|---|---|
| 0–20% | Safe |
| 20–30% | Slow crack (minutes) with a growing leak, creaks and a faint hiss |
| 30–75% | Fails faster (about 40–8 s) |
| 75%+ | Bursts in about 3 s |

Segments have ±15% tolerance, so the weakest lets go first. Leaks and bursts dump the pumped gas back into the room. Repair is a hold-[E]; a reinforce collar raises the tier and adds visible bands. The first pipe off each outlet shows **PIPE LOAD %** (green up to 100, amber 100–120, orange 120–130, red over 130, flashing over 175). Flow splits equally per open outlet before the pipe, then equally at junctions.

Gas pumps are free-standing cones with a full-circumference intake, a front monitor (power, flow, filter wear), a side filter hatch and an empty side socket for a later control-link module. They can floor-mount (heavy gases) or auto-flip on a roof (light gases); the monitor and hatch stay upright. Filters wear with throughput (300 L per cartridge); below 30% wear, flow drops, and at 0% the pump stops. Intake and extra outlets are visible add-ons.

**Rich air has no hard cap.** Above 30% base O2 there is one quiet, missable LUCID line and a "sharp, metallic" smell. Fire risk then grows with excess O2, but only if a spark source is present (a strained or shorted cable, a burst pipe, or a running generator) and only after a ramp of about 10 minutes of sustained rich air. A small fire starts above 15% O2, grows above 24%, and starves below 17%. Hold [E] for 2.5 s to douse it (15 L of water from a tank if one is present). The craftable **O2 regulator** (5 scrap) vents base air above a setpoint of 23%, 25% (default) or 28%.

**Methane (CH4)** is a real, light gas used at the landfill. It pools at the ceiling, is breathable only in the sense that it displaces O2 (asphyxiation around 30%), and ignites only between 5% and 15% (a richer mix will not flash). An open inlet with no pipe leaks into the room; a spark in band can flash or blast.

An airlock with two doors stands between the bunker and the surface. A correct cycle never opens the base straight to the outdoors. Cycle-out vents the chamber to thin surface air; cycle-in pressurises from the base at a small O2 cost. **Force-opening the airlock and contaminating the base is not built.** **PROPOSAL, needs Granite's approval** if it is added later.

Dug space becomes its own air pocket, sealed by curtains and hatches. Pocket temperature and pressure physics are **not built**. **PROPOSAL, needs Granite's approval.**

### 3.2 Liquids, reservoirs and the sump

The **Wet bluff** hide three finite underground reservoirs: water (W-1, 1800 L plus a 2400 L aquifer that seeps at 4 L/s), brine (B-1, 650 L) and crude oil (O-1, 520 L plus a 300 L reserve). Soil near a reservoir is darker; brine leaves a pale crust, crude a black sheen. Ceilings drip. Holding [F] for 1.4 s x-ray-scans 3.2 m and shows type, volume and distance.

Digging a cell that touches a reservoir breaches it. Liquid fills from the bottom up, falls first, then spreads, then rises. An open tunnel mouth has a 0.3 m sill, so runoff leaves the flood at about 0.30 m. Closed seals block liquid; an open hatch equalises levels. Wading slows the player; depth of 1.55 m is submerged (suit drains ×2.6, murky view, death reads "You drowned…"). Crew will not step into liquid deeper than 0.35 m.

The **sump pump** (5 scrap) sits on a pocket floor and draws 1.6 L/s, densest liquid first. HOME sends water only to the base intake (brine or crude is refused as contamination). FUEL can send crude to a nearby generator (9 kJ/L). The sump needs grid power (4 W plus 120 W per running pump) through a surface-intake bulkhead, and it needs a player-laid **hose reel** (25 m, 3 scrap). No hose means NO HOSE; an unpiped header backs up. Hose overload uses the same 20 / 30 / 75% bands as pipes. A T1 hose on full sump flow (23% over) bursts after about 12 minutes; T2 or higher holds. [E] patches; [G] reinforces with visible yellow bands.

Liquid freeze is **not built**. **PROPOSAL, needs Granite's approval.**

### 3.3 Power

Pumps, belts, docks, drills, refineries and the sump are real watt consumers. A small fuel generator is rated **200 W**, burns briquettes (1 = 30 kJ = 150 s at full output, hopper of 3), and turns room O2 into CO2 while it runs. It starves if room O2 is below 5%. A scanned **generator manifold** bolts on and raises the rating to 350 W (and needs the 400 W manifold plus a T2 gas pipe to use landfill T3). The bench generator keeps its 200 W cap, so landfill T2 (225 W) and T3 (350 W) are real upgrades, not a free fuel swap.

Cables have tiers and the same overload idea as pipes. Breakers trip. Under a brownout, LUCID control chips set service priority: high-priority consumers run, low ones go quietly OFFLINE. Batteries store and discharge.

**Northfield Landfill Cell 4** sits on the surface north of ARK-03. It is an optional side job (a one-time +8 scrap payoff). Scanning a vent unlocks the gas family. Wellheads are tiered add-ons (T1 0.5 L/s, T2 + blower 0.9 L/s, T3 + laterals 1.4 L/s). A flare stack burns off excess; a filter/trap catches condensate. The field is finite (about 9000 L, ~2.25 MJ). Piped into a generator with the burner kit it makes 125 / 225 / 350 W at T1 / T2 / T3. Digging the mound can expose flashable pockets.

**ARK-03 turbine feed:** free the seized bearings, seat a control chip, sleeve the export stub to T3, load briquettes, and start. The turbine pushes up to 480 W, at the cost of ARK-03 hall air. Seven surface pylons carry the line home; under a full push, T1/T2 masts short. With the turbine running, export at T3 and every pylon intact at T3, the base station junction reads **ARK-03 FEED** and gains bulk watts. Indoor cable tiers, breakers and priority still apply.

Cable T4, wireless range and obstruction, chip power draw, generator wear, and a full heat simulation are **not built**. **PROPOSAL, needs Granite's approval.**

### 3.4 Digging, cave-ins and breaches

The omni-tool (claimed in ARK-01) digs soft soil and ore with hold-[V]. LUCID's dig-laser clears hard rock. Dug cells become walkable pockets. A 1-cell crawl is player-only; crew need about 1.5 m of clearance.

**Rock stress** applies to dug soil roofs, never to rock roofs or open sky. A span of 2 cells or less from a wall, support or prop is always safe. Each cell past that adds 0.02/s of stress. Dust at about 15 s (span 3), a creak, pebbles and one LUCID line at about 30 s, and the roof falls at about 50 s. There is no toast or beep before the fall, and **collapses are never random** — only from an unsupported span you dug and left.

A collapse refills a 3×3 footprint as rubble. Occupants are hurt, not entombed: the player loses 30% suit reserve, crew go DOWN. Pipes and hoses pinch until dug clear; crushed cables stay failed until repaired. Crew re-plan around the fall or refuse cleanly ("a cave-in blocks the way").

A **shoring prop** (2 scrap) holds radius 1. Three more scrap upgrades it to T2 (header beam and braces, radius 2). Rubble re-digs at 0.6× time and yields scrap or ore.

**Hull breaches** only happen where a hull exists — today, the soil drift against ARK-01's east wall. Digging that cell tears a hole. Air (and liquid, if present) equalises through it; the hiss scales with the gap; rubble cuts flow to 10%. Undisturbed, ARK-01 drains in about 70 s. Patch by holding [E]: a wall patch (4 scrap, 1.5 s) or bare scrap (3 scrap, 4 s). LUCID gives one missable hint before the first breach dig. The bunker itself has no exterior soil, so it cannot be breached this way.

Old saves load with their existing spans grandfathered, so a wide room from before this system does not fall on you after an update.

### 3.5 Building, crafting and industry

Before anything is placed, a holographic blueprint shows the footprint, ports, auto-flip and predicted pipe load. Cyan is valid; red cannot be confirmed. The build menu has a T1–T5 dropdown per object; locked tiers are greyed with a hint. A new object can be placed at any unlocked tier, already grown, and existing objects upgrade in place.

The workbench grows in public: T1 pliers and hammer, T2 vice, T3 bench drill, T4 turntable, T5 lathe. Higher tiers unlock more recipes. Crafting is no longer instant. A **queue of four** lets crew labour pay into the head item while you are away. Cancel refunds what was paid in. A job board on the bench shows labour count, rate, progress and ETA.

**Conveyor belts** move solids (briquettes, soil, ore, filters, scrap). A loader feeds a belt; an unloader feeds a generator, crate or the scrap pool. Unpowered belts freeze packets in place with no toast. Junctions and splitters beyond rotate-on-place, and auto-pickup of dig drops onto belts, are **not built**. **PROPOSAL, needs Granite's approval.**

The **mining drill** (T5, 24 scrap, 150 W; unlocked by scanning a worn head behind hard rock in ARK-03) auto-mines the facing cells when powered. A hardened bit bolts on for faster digging and rock. Output prefers an adjacent loader. The **ore refinery** (T3, 18 scrap, 100 W) turns 2 ore into 4 briquettes in 5 s (a crusher add-on cuts that to about 2.75 s). The table press remains a 2-ore → 3-briquette fallback that needs no power.

### 3.6 LUCID

LUCID is the only voice from before the crash: a suit-resident AI who delivers blueprints when you scan, and sparse, missable lines when something changes. The inert orb is found in the first bunker. Waking it makes a floating companion with visible empty sockets (arm, dig-laser, legs) so the upgrade path is readable before the parts exist. Scanning and bolting the arm, dig-laser and legs is built. The torso chassis (scanned in ARK-02) is a human-size floating upper body the orb seats into ("This will do. For now."). Unseating returns the free orb.

A late-game **control room** console (T5, 20 scrap) docks LUCID into the base ("I am the base now. Almost."). Companion follow pauses while it is installed. **Control chips** seated in device bays raise how many units LUCID can run (suit relay 6, control room 24) and unlock priority under brownout. Wireless range, obstruction and chip power draw are still open (see §9).

### 3.7 Progress, save and settings

A 10-step, state-driven objective chain runs in real play (not in selftests or screenshot modes). Steps already done on an old save are skipped silently. One short how-to toast fires per new step. The HUD strip can be turned off; when it is, "NEW OBJECTIVE" toasts are suppressed and H-help shows the current step.

Saves write to the browser (`breathless_save_v1`), every 60 s, after important unlocks, on F5, and when the tab hides. Schema is still 1, so old 2.x / 3.x / 0.3.x / 0.4.x saves still load. Export downloads the raw save string; import validates it, parks the previous save, and reloads. Death does not overwrite the last save. There are no cloud sync and no multiple slots in the build.

Settings (title and pause): mouse sensitivity, invert Y, FOV 60–100, master / effects / ambience volume, objective strip on/off, graphics quality High / Ultra / Ultra+, and a cutscene toggle. Settings persist in `breathless_settings_v1`.

### 3.8 Cutscenes

Two layers exist:

- **Lore intro (slice 19).** An eight-beat, skippable in-engine stub (~69 s) of the official opening: launch, station, news corridor (mission, ARKs, teleporter), portal mishap, time-bubble / war flash, meeting LUCID, crash, damaged visor. It uses title cards and simple geometry stand-ins, not finished character or face work. Returning players skip it (`breathless_seenIntro`); Shift on begin forces a replay.
- **Scripted live-engine scenes (v0.4.2).** Four short scenes rendered in the running world, with camera paths, letterbox, subtitles, fades and title cards:
  1. **Opening** — the pod falls burning, impact, blackout, waking, a pan to the bunker strobe, title *FIND SHELTER*. The objective clock starts only when you have the controls. Plays after the lore intro on a fresh crash start.
  2. **First collar** — a slow orbit as the collar ring lights; LUCID explains the charge deal.
  3. **First feed** — the ARK-03 turbine, then a cut down the pylon line as each mast lights toward the bunker.
  4. **Ending** — a crane up from the airlock, title *BREATHING ROOM*, fade, win card.

Each of the four plays **once per save**. Space or Esc skips. Settings can turn them off. The simulation freezes while a scene runs. Tests and playthroughs auto-skip them. Fuller production versions of the lore intro (face shots, generated stills, finished performance) are **not built**. **PROPOSAL, needs Granite's approval.**

---

## 4. World and story

### Premise

Earth is running out of resources. The Kuiper belt is too far for ordinary travel, so humanity built the first teleporter. The player is the first tester. Something goes wrong: a time bubble holds the player while nuclear war empties the Earth and the station. When the bubble ends, the player has not aged. They reach a shuttle, launch, and crash near an ARK with a damaged visor. That crash is where playable time begins.

The surface world is gone. Outdoor air is too thin to live on; the suit is a clock. A few plants still grow outside. Oxygen plants are rare and are a first source for the bunker, with a life cycle (seedling → mature → aging → withered) that needs water and replanting. A full outdoor life cycle for surface plants is only partly present (a rare seedling can be dug up). A finished outdoor plant ecology is **not built**. **PROPOSAL, needs Granite's approval.**

### Places

- **Crashed escape pod.** Scorched, tipped hull in a crater, torn chute, blown hatch, embers, smoke, a red strobe. A locker holds 4 scrap. A flight log is readable. The emergency bottle stretches suit time (~85 s from full instead of ~36 s) until shelter is sealed.
- **Bunker 1 (the base).** The starting sealed volume: plant, workbench, monitor, LUCID orb, airlock, later pumps, power, docks and planters. This is home air.
- **The surface.** A dark, ruined outdoor pad with thin air, waypoints and debris. Lanes run out to the ARKs and, past ARK-03, to the landfill. Mid-route shelters are **not built**. **PROPOSAL, needs Granite's approval.**
- **ARK-01 grow lab.** First bunker-like POI. Primary directive: life / grow. Hatch from the surface. Inside: the first **omni-tool**, strange plants, a locked deeper bulkhead (opened by restoring a local power junction and a gate breaker, or with a clearance chip), then a records alcove and hydroponics annex. Teal grow-lab palette. The east hull can be breached from the adjacent soil drift.
- **ARK-02 body lab.** Robotics / LUCID body fabrication. The hatch is packed with soil until the omni-tool digs it clear. Amber/copper palette. Torso chassis scan, orb housing bay, lore terminal.
- **ARK-03 power works.** Power and mining: "GENERATE / STORE / MINE." Furthest out. A dead hydraulic blast door needs a battery cradle and a sleeved feeder; a T1/T2 feeder shorts under the 360 W surge, T3 opens the slab. Amber industrial interior, dead turbine, ore rails, a hard-rock shaft that needs the dig-laser. This is where the drill, refinery die, manifold and turbine restart live. Hall air is finite; a running turbine burns it, with only modest life support, so a long unattended burn is a later crisis.
- **Northfield Landfill Cell 4.** Capped mound, vents, debris, leachate pond, hazard sign. Optional methane field.
- **Wet bluff.** Walk-in dig against the +x boundary, hiding the water, brine and oil reservoirs.

ARKs are Fallout-vault-like: each has a primary directive and a reward that gates the next kind of work (tool, body, power).

### Objective chain (built)

1. FIND SHELTER — cycle into the bunker.  
2. Wake LUCID.  
3. Keep the oxygen plant watered.  
4. Place a pump / start building.  
5. Reach ARK-01.  
6. Collar a survivor.  
7. Reach ARK-02.  
8. Reach ARK-03.  
9. Get the ARK-03 feed live.  
10. BREATHING ROOM — hold 300 s (feed live, 2+ crew, O2 ≥ 19%, CO2 < 2%).

---

## 5. Characters and creatures

### The player

An astronaut, first teleporter tester, un-aged after the bubble. Starts at the crash with a damaged visor and a finite suit. No combat skill tree: survival is systems, exploration and attention.

### LUCID

Suit AI, later a floating orb, later a seated torso, later the base itself when docked in the control room. Speaks sparingly. Delivers blueprints from scans. Lines are often one-shot and easy to miss on purpose. Walking lower-body legs for the torso are **not built**. **PROPOSAL, needs Granite's approval.**

### Feral survivors (the crew)

The original brief described small half-organic, half-robotic labour imps. **They were replaced.** The beings in the world now are ragged, irradiated human survivors: gaunt, mottled and peeling skin, holed salvage clothing, patchy hair, about 1.7 m tall. They are not monsters. They roam the surface and the ARKs.

- **Skittish** ones bolt if you come within 5.5 m.  
- **Hostile** ones stalk and lunge, taking 14% of the suit reserve (3.2 s cooldown).  
- Uncollared ferals run on adrenaline and are off the air books.  
- A fled feral left alone calms back to skittish, so a relapse cannot soft-lock the game by refusing bait forever.

**Trap.** Craft a snare cage (T1, 5 scrap) or a reinforced cage (T2, 8 scrap) and place it. A feral within 9 m drifts to the bait unless you stand over it. The gate drops. It thrashes (6 s / 4 s), then is calm (14 s / 22 s), then tears free and the cage bends.

**Collar.** Craft a mood-dampener collar (T1, 6 scrap). During the calm window, hold [E] for 2.2 s. Fitting during the thrash, or flinching, claws the suit and restarts the fit. When it locks, the survivor is sedated. Carry them with [Q] to good air and hold [E] to rouse them. They become **CREW-n** and take the old jobs: follow, wander, tend, labor, haul, plus LUCID / monitor remote orders and ALL.

**Charge.** The collar holds 1800 s (30 real minutes) and drains only while the survivor is awake.

| Charge | Behaviour |
|---|---|
| Below 25% | Amber LED and a quiet monitor note |
| Below 10% | Red blink, head twitches, a note, work speed ×0.72 |
| 0% | Relapse: bolts, or 50% chance of turning hostile if you are within 5 m. Cannot be roused again; must be re-trapped and re-collared |

A **collar dock** (T1, 6 scrap) draws 60 W while charging (2 W idle) and charges at 15 s/s (empty to full in 2 minutes). Crew below 30% walk to a free powered dock in their own zone. Hold [R] on crew to hand-charge at 6 s/s.

**Breathing.** A survivor uses 0.90 O2/s at rest (the player uses 1.0), ×1.35 when on labour (1.215) and ×1.1 when tending (0.99). A mature plant makes 1.9/s. One plant covers you plus one resting survivor exactly. Two survivors put the room 0.9/s in deficit unless you add an **O2 planter** (6 scrap, +1.9). Crew in a sealed ARK use that ARK's finite air; ARK-02 is not topped up for workers.

**Work and pathing (v0.4.0).** Crew walk a zone-and-door graph across the base, the airlock, the surface lanes and ARK-01/02/03. No warping. On FOLLOW they walk through doors with you and ride the airlock. They cycle hatches and the lock themselves, wait for the cycle, and never open both lock doors at once. They never cycle you outside: if you are in the chamber, the cycle is yours. Two crew going opposite ways take turns in roster order. Bodies in the chamber ride along and do not block the lock.

A surface crossing is allowed only if the reserve covers the leg (time × 1.15 + 3 s). Otherwise the order is refused with a reason ("can't reach ARK-02: no air (needs 32s, has 6s)", "ARK-03 hatch sealed", "a cave-in blocks the way"). Refusals go to the **monitor log only** — no toast, no beep — so they stay missable. Out on a lane, if remaining air will not last, the crew member turns back to the nearest refuge. `[Z]` on the LUCID or monitor panel sets the work site (HERE, BASE, ARK-01/02/03), so "LABOR @ ARK-02" is a real walk. A trip mid-save is stored and re-planned from where they stand on load.

Labour at the bench is the main scrap source (see §6). Crew will not walk into deep liquid. A cave-in makes them re-plan or refuse.

Crew schedules / shifts, and picking a specific plant or crate rather than the nearest, are **not built**. **PROPOSAL, needs Granite's approval.**

---

## 6. Progression and economy

Progression is exploration gated, then scan gated, then scrap gated.

- **ARK-01** gives the omni-tool, which unlocks digging, faster scans, and the rest of the surface.  
- **ARK-02** gives the torso path and the control-room schematic.  
- **ARK-03** gives heavy power, the drill, the refinery and the feed home.  
- **Cell 4** is optional extra power, found after ARK-03 (LUCID gives one quiet, missable line about the vents 25 s later).

Scanning a find **once** permanently unlocks its blueprint. The workbench tier caps which unlocked recipes you can actually make. Placed gear then upgrades in place with visible add-ons, up to T5.

### Scrap

**Crew labour is the main source**, plus modest salvage. This is a signed judgement call.

- Labour: 1 scrap per 20 s per worker at a T1 bench. Each bench tier above T1 adds +10%. Each extra worker adds +25% to the team, capped at 4 workers (×1.75). Example: two workers at T3 make about 1 scrap every 7 s.
- Salvage caches: six scannable caches (three in crash debris, one in each ARK). Scan once, then each [E] strip gives +2 scrap, three strips per cache, **36 scrap** in the world.
- Digging soil, ore and rubble yields materials. The landfill mound can also drop scrap and metal.
- Cell 4's +8 scrap payoff pays **once**.
- The pod locker starts you with 4 scrap.
- Queued craft deposits pocket scrap (and any ore) when you queue; crew labour funds the queue head before leftover scrap returns to the pocket. Cancel refunds the deposit.

Nothing in the core loop is sold for real money, and nothing important is given away. Props, patches, collars, hoses and reinforcements all cost scrap. Rubble pays out again only because it is real material.

Worked playthrough numbers (scripted, for balance reference, not a promise of player time): a normal run wins in roughly 12–14 minutes of simulated time with some scrap top-ups; a labour-only run wins in roughly 17–18 minutes with 0 scrap top-ups and about 57 scrap from crew.

---

## 7. Art and audio direction

### Picture

The game is a real-time first-person Three.js world, built to look as expensive as a single-file web client can. The rule from the owner is **keep the graphics AAA** and never downgrade them.

- Quality presets: **High** (the current default look, device pixel ratio capped at 2), **Ultra** (1.25×, cap 2.5), **Ultra+** (1.5×, cap 3). Options only go up.
- Blueprint language: **cyan/teal** for a valid ghost, **red** for invalid, with port and load preview in the hologram.
- Every machine is a readable object, not a primitive: cone pumps with grille, hatch, cartridge and monitor; regulators with a chest-height gauge and handwheel; landfill wellheads that grow a blower and laterals; shoring that gains a header beam at T2.
- Palettes tell you where you are: bunker and grow-lab teal, ARK-02 amber/copper, ARK-03 sodium-yellow industrial concrete and hazard chevrons, landfill hazard signage, water / brine / crude each with their own physical material (refraction, crust, iridescent black).
- Liquids use transmission, scrolling normals, wade ripples, murk and caustics. Fires, dust, hose tears and hull-patch scars are visible in the world, not only in the UI.
- Cutscenes are shot in this same world (letterbox, fades, title cards). The slice-19 lore intro is still stand-in geometry. Finishing that intro to the same standard as the rest of the game is a proposal (see §9). A known visual fault: the opening crash shot can be too dark to read the falling pod clearly.

### Sound

All voices run through effects and ambience buses into a master gain, so Settings volume works. Suit breathing is a layer that is calm in room air, closer in the helmet, faster under 25% reserve, and gasping when the suit is empty. The room hum muffles through a low-pass as you go onto suit air. Pipes creak and hiss as they crack; hoses drip and spray; fires roar and crackle; caches, valves and the win chord have their own stings. Crew airlock cycles are deliberately quiet. One-shot LUCID lines and a two-note objective chime are the main "someone is talking to you" sounds. Warnings are allowed to be missed.

---

## 8. Monetisation

**Nothing in this section is built. The whole section is a proposal.**

Breathless is a single-player survival game with a closed loop (air, scrap, labour, a win, then free play). Paid shortcuts to scrap, air, collars or craft time would break the "nothing is free" rule and the quiet-crisis pacing. The following is offered only as a starting point.

**PROPOSAL, needs Granite's approval:**

1. **Premium, one-time purchase** as the default model (for example itch.io and later Steam). You buy the game once; the full objective chain, ARKs, crew and sandbox are included. No ads, no energy timers, no loot boxes, and no real-money sales of scrap, oxygen, collars or convenience skips.
2. **A free playable slice** that stops after FIND SHELTER, or after the first collar, so someone can feel the air systems before buying. Where that slice is hosted, and whether the current public GitHub repo stays the canonical free build, is Granite's call.
3. **Optional paid extras after 1.0**, only if a storefront exists and only if they do not touch survival balance: soundtrack, art book / bible PDF, maybe cosmetic visor or monitor skins. Not required for 1.0.
4. **No live-service schedule and no battle pass.** New systems belong in ordinary versioned updates (v1.1+), not in a season pass.

Until Granite approves a model, the project has no price, no store page, and no in-game store.

---

## 9. Roadmap

### Already shipped (v0.x)

Older labels were "prototype X.Y" or "v3.x". Read them as **v0.X.Y**. Official 1.0 has not been used.

| Version | What landed |
|---|---|
| v0.0.x – v0.2.x | Sealed room, pumps and pipes, workbench tiers, scan unlocks, power and cables, liquids, LUCID link and orb, airlock and surface, ARK-01/02/03, conveyors, voxels and pockets, labour creatures (later replaced), torso and control room, drill, refinery, saves, turbine line home |
| v0.3.0 | Underground reservoirs, breach floods, sump |
| v0.3.1 / v0.3.1.1 | Crash start, feral survivors and collars, pod-stuck hotfix |
| v0.3.2 | 10-step objective chain and BREATHING ROOM ending |
| v0.3.3 | Settings, audio buses, save export/import, quality presets that only go up |
| v0.3.4 | Player-laid sump hose, breathing audio, performance (no visual loss) |
| v0.3.5 – v0.3.7 | Scripted playthrough, rich-air fire risk and O2 regulator, salvage caches, air-safety polish |
| v0.3.8 | Northfield Landfill Cell 4 methane power |
| v0.3.9 | Crew-labour pacing and a 4-item bench queue |
| v0.4.0 | Crew routes between sealed zones; safe airlock cycling; air-gated crossings |
| v0.4.1 | Rock stress, cave-ins, shoring, ARK-01 hull breaches |
| **v0.4.2 (current)** | Four skippable in-engine cutscenes (pod crash, first collar, first feed, ending) |

The game is feature-complete for a vertical slice through the ending. Automated selftests and both scripted playthroughs (normal and labour) reach SUCCESS on this build.

### Proposed next work

**Everything in this subsection is a proposal and needs Granite's approval.** Order and scope can change. v1.0 stays reserved until Granite signs the release.

**PROPOSAL, needs Granite's approval — v0.4.3 polish and bug-fix pass.** No new major system. Raise the opening crash shot so the falling pod is readable. Sweep remaining UX nits (hint timing, dark shots, help text), confirm old saves and both playthroughs still win, and generally tighten the current feature set for public play. This matches the pass already named as next after cutscenes; it is listed here so the scope is explicit.

**PROPOSAL, needs Granite's approval — later v0.4.x / v0.5.x, only if wanted.** These are still-open items from the design brief and build log, not promises:

- Production-quality lore intro (face shots or generated stills in place of the slice-19 stand-in geometry).
- Force-open airlock risk (a way to contaminate the base by doing the cycle wrong).
- Pocket temperature and pressure, and liquid freeze.
- Walking lower-body legs for the LUCID torso.
- Wireless link range and obstruction; control-chip power draw; generator wear / servicing; a fuller heat model.
- Cable T4 heavy feeder.
- Mid-route surface shelters between ARKs.
- Crew schedules / shifts, and picking a specific plant or crate rather than the nearest.
- Conveyor junctions / splitters, and dig-drop auto-pickup onto belts.
- A finished outdoor oxygen-plant life cycle.
- Save slots (export/import already exists).

**PROPOSAL, needs Granite's approval — v1.0 official release.** Ship when Granite is satisfied that the current loop (crash → shelter → crew → three ARKs → landfill as optional power → BREATHING ROOM → keep playing), plus whatever of the list above was accepted, is the 1.0 promise: stable, documented, and balanced. Not before.

---

## Appendix — signed judgement calls (already in the build)

These are not proposals. They are decisions already shipped and should not be quietly reversed:

- Crew labour is the main scrap source; salvage is modest.
- High O2 has a fire risk and a regulator, and no hard cap.
- The unreinforced starter hose lasts about 12 minutes at full sump flow.
- The post-win ARK-03 hall starvation stays.
- The bench generator keeps its 200 W cap; higher landfill tiers need the manifold.
- Objective pop-ups are hidden when the objective strip is off.
- Warnings stay missable; nothing is free; collapses are never random.
- Hull breaches only happen where a hull exists.
- Occupants of a cave-in are hurt, not entombed.
- Crew never cycle the player outside. Refusals stay on the monitor log.
- Graphics quality options only go up.
- v1.0 is the official release label only.
