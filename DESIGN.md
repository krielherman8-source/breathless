# BREATHLESS - Game Design Brief (from the user, verbatim intent)

Pitch: First-person survival like Subnautica, with Oxygen Not Included (ONI) style systems. Oxygen management is the biggest point of the game.

## Opening / cutscenes (in-engine scripted cutscenes + generated stills)
1. Astronaut MC (the player) face shot, walking toward a futuristic launch shuttle.
2. Launch to the space station. 3. Landing/docking.
4. Tutorial 1: walk from the shuttle down a corridor with wall-mounted monitors broadcasting news. Observant players learn: the mission, the ARKS (bunker-like POIs needed for progression), and why: Earth is running out of resources, the Kuiper belt must be mined, too far for normal travel, so humanity built the world's first teleporter. The player is the lucky first tester.
5. Prep, step through the portal. Something goes wrong: player is stuck in a time bubble where no time passes.
6. Cutscene: outside world moves at extreme speed, camera pans out, time races by, nuclear war breaks out, most life on Earth gone, fewer and fewer people aboard the station. Then the bubble ends; player has not aged a minute.
7. Tutorial 2 (game mechanics): station is worn down. Player must return to the shuttle but takes a different route that leads to LUCID, the advanced AI on board, who becomes companion/guide and later the link to the base.
8. Player reaches shuttle, launches, crash lands near an ARK. Game proper starts: visor damaged, must reach the ARK.

## World
- Surface world is gone; very little oxygen.
- ARKS are like Fallout vaults: each has a primary directive. First ARK is a grow lab; it holds the first omni tool (base building + digging). ARK-02 = robotics / LUCID body lab (slice 20). ARK-03 = power / mining works (slice 26).
- Some plants on the surface. Oxygen plants are rare on the surface and are a first oxygen source for the base, but have a life cycle.
- Omni tool can scan objects to get blueprints and upgrades (blueprints are delivered by LUCID).

## Building / systems
- Voxel-style block digging (Minecraft-like, but better).
- Baseline: all gases, liquids and solids from ONI, plus equipment like gas pumps, liquid pumps.
- Unlike ONI: conveyor belts transport solids.
- Pumps start with 1 inlet and 1 outlet at X flow. Unlockables add 2nd, 3rd, 4th outlet; flow divides equally (2 outlets = 50% each, 4 = 25% each). Input can be upgraded.
- Pipes have tiers with max flow. Example: first liquid pump = 10 L/hour, first pipe set handles that as its set pressure. A bigger pump on un-upgraded pipes makes them BURST (causes problems). You do not replace pipes, you REINFORCE them.

## LUCID
- Only connection to the past; gives blueprints when you scan new things.
- Starts downloaded into the player's suit.
- Later, player finds an orb in another ARK = a body for him. Orb floats near the player; upgradable: arms, digging lasers, little legs.
- Prototype 0.9 (slice 9): early body is in THIS first ARK as an inert findable (exploration beat). Empty sockets already visible on the orb — arm hardpoint, dig-laser mount, leg stub — so the player sees the upgrade path before parts exist. Scanning/bolting arm landed in slice 13; dig-laser + legs in slice 14.
- Late game: human-size robotic torso. Place LUCID (orb) into the torso chest. Torso can float like the orb; he wants a body.
- Eventually unlock a control room schematic where LUCID is installed; gives a craftable chip that can be installed in devices for central control of the entire base (late game, equipment needs chip). Through this LUCID becomes the base itself.

## Creatures
- Small humanoid imp-like creatures, half organic and half robotic, created in the old world for hard labor. They breathe oxygen and produce CO2. Found in the world; usable in the base (oxygen/CO2 cycle).

## Notes
- User says there is more design to come; this is what is known so far. Build an expandable architecture.

## Build log
- 2026-10-03: Prototype 0.1 at /workspace/breathless/index.html (Three.js in lib/, serve with `python3 -m http.server 8765` in this folder, open http://localhost:8765/). Sealed room, room gas container (O2/CO2), player breathes room air else suit reserve, oxygen plant with life cycle (seedling > mature > aging > withered, needs water, replant), game over at 0. Code stubs: GasContainer/Link/GasNetwork (pumps, pipes, burst, reinforce), VoxelWorld, EventBus (LUCID, cutscenes), Entity base class.
- Placeholders (prototype 0.1): airlock door (replaced in slice 10), base monitor LUCID text, empty second planter, workbench; no voxels, pumps, conveyors, LUCID, cutscenes, surface, creatures, sound beyond beeps.
- 2026-10-05: Slice 2 (prototype 0.2, same single index.html): gas pump + tier-1 pipes + holographic blueprints.
  - Free-standing cone gas pump (floor mount, roof mount auto-flips body; monitor/hatch/socket stay upright): full-circumference intake grille with visible fan, 2 cast-in ports on top (2nd capped), front monitor (PWR, FLOW L/s, FILTER %), side FILTER SERVICE hatch with pull-out cartridge, empty unexplained side socket, 4 bolted corner brackets. Intake tiers I2/I3 and outlets 3/4 show as visible add-ons. One pump starts in the room (OFF) piped to a wall exhaust vent ('EXHAUST > SURFACE'); a second vent is free for outlet 2.
  - Pipes sit on a 0.5 m build grid (same size planned for voxels), explicitly linked (parallel runs don't merge), quick-connect to pump ports and vents by cell. Flow = min(intake, capacity) x filter, split equally per open outlet BEFORE the pipe, then equally at junctions. Open ends / uncoupled outlets spill into the room. First pipe off each outlet has a PIPE LOAD % readout (green/amber/orange/red, flashing >175%).
  - Overload ratio implemented: <=20% over safe; 20-30% slow crack (~2-4 min to fail) with a growing leak, creaks and faint hiss; 30-75% fails in 40-8 s; >75% bursts in ~3 s. Segments have +/-15% tolerance so the weakest one lets go first. Leaks/bursts dump the pumped (CO2-rich) gas back into the room; repair = hold E. Reinforce in place (debug G) raises tier with visible collars.
  - Filter wears with throughput (300 L per cartridge); below 30% flow drops linearly to 20%, at 0% the pump stops. E on hatch swaps the cartridge (instant, animated).
  - Floor intake samples the heavy layer (CO2 share x6, ONI-style stand-in); exhaust goes to the surface, so a running pump also bleeds O2 once the CO2 layer is thin: quiet cost, not a free scrubber.
  - Build mode (B): 1 = pump, 2 = pipe, LMB place, R rotate, X remove, RMB exit. Cyan hologram = valid, red = blocked (with reason), pipe blueprint previews predicted load % and warns 'EXCEEDS PIPE RATING'.
  - Quiet-then-crisis: no HUD alarms for pipes or filters; info lives on the diegetic monitors, sounds and particles. A burst is a bang plus one low-key line of text.
  - Debug keys (aim at pump): O / Shift+O outlets, I intake tier, [ ] flow trim; T time x8, P reset room air. Tests: ?selftest (sim checks), ?keytest (real input handlers), ?shot=NAME (screenshots in play/slice2_*.png).
  - Placeholders / not yet: power grid (pump power is a switch), filter cartridges are infinite, liquid pumps, LUCID control link module, real per-cell gas layering, pipe tiers above T1 in the build menu (tier dropdown), omni tool for repair.

- 2026-10-05: Slice 3 (prototype 0.3, same single index.html): crafting workbench with visible tier growth + build-menu tier dropdown.
  - Crafting table entity (replaces the decorative workbench prop): same base table grows add-ons — T1 pliers+hammer, T2 bench vice, T3 bench drill, T4 turntable (rotating), T5 lathe (chuck/work/cutter). Teal/steel palette matches the gas pump; front edge has five tier lights.
  - Build menu: [3] Craft table. Tier buttons T1–T5 in the build HUD (click or ,/.); locked tiers greyed with requirement hint. Placing at T3 arrives with T1+T2+T3 add-ons already bolted on. Hologram previews the chosen tier (cyan valid / red invalid).
  - In-place upgrade: aim at a placed table in build mode (craft selected) and LMB or E to bolt on the next unlocked add-on.
  - Unlock progression (debug for now): start with T1 only; [U] unlocks the next craft-table tier (up to T5). No scan/LUCID yet.
  - Craft UI stub: [E] on table opens an on-screen recipe list gated by table tier (T1 repair kit / pipe segment; T2 filter cartridge; T3–T5 placeholders for intake upgrade / outlet kit / reinforce collar). Consumes a simple scrap counter ([+] adds scrap). Cursor released while the menu is open.
  - Tests: ?selftest includes slice3 block; ?shot=craft_t1|craft_t3|craft_t5|craft_bp|craft_ui → play/slice3_*.png.

- 2026-10-05: Slice 4 (prototype 0.4, same single index.html): crafting matters + LUCID/scan unlock loop.
  - Player inventory for crafted items (filter cartridges, repair kits, reinforce collars, outlet kits, intake upgrade kits, pipe segments). HUD strip shows scrap + owned counts.
  - Filter hatch swap consumes 1 filter cartridge (craft at T2+); denied without one.
  - Pipe repair: hold E still works (slower, 2.4 s); with a repair kit it finishes in ~0.35 s and consumes the kit. Burst repair salvages +1 scrap.
  - Reinforce collar: [G] on a pipe consumes a collar to raise tier (visible bands). Shift+G remains free debug reinforce.
  - Outlet kit [O] / intake upgrade [I] on an aimed pump consume from inventory (Shift+O/I stay debug free).
  - Scrap crate in the room ([E] salvage +2, limited stock); scrap still a craft cost (+ debug).
  - LUCID: wall monitor line + brief companion HUD. Starts offline; first omni-tool scan brings it online (sparse lines, quiet-then-crisis).
  - Omni-tool scan: hold [F] on room findables (damaged filter, burst pipe sample, intake module, outlet stub). First scan permanently unlocks the matching craft blueprint and raises craft-table unlock to that recipe's tier. LUCID: "Blueprint archived: …".
  - Craft UI greys locked blueprints until scanned; U demoted to debug-only craft-table unlock.
  - Start known: repair kit + pipe segment (T1). Advanced recipes locked until scanned.
  - Tests: ?selftest slice4 block; ?shot=inv|scan|lucid|finds → play/slice4_*.png. Backup: .backup/index_v0.3_pre_slice4.html.

- 2026-10-05: Slice 5 (prototype 0.5, same single index.html): power grid, so pumps need real watts. Backup: .backup/index_v0.4_pre_slice5.html.
  - PowerNetwork: cables sit on the same 0.5 m grid cells as pipes/voxels and merge with ANY adjacent cable (ONI-wire style; pipes stay explicitly linked). Devices plug in when a cable touches their footprint (any free neighbour cell); the wall junction plugs in at the floor cell at its foot. Sources and batteries bridge every cable touching them into one circuit; consumers (pumps) are leaves and never pass power through.
  - Per circuit and tick: supply = generators + junction + battery discharge. Consumers are served in placement order, ALL-OR-NOTHING (no half-speed pumps). Load comes from sources first, then batteries; source surplus charges batteries. A consumer spins up after 1 s of steady supply and stops at once when supply goes.
  - Gas pump: the front switch alone no longer runs it. It needs switch ON + a powered cable path. Demand = 60 W + 60 W per rated L/s (I1 = 120 W, I2 = 180 W, I3 = 300 W). Quiet-then-crisis: losing power raises no toast, beep or HUD alarm. The hum fades, flow drops to 0.00, and the monitor reads OFFLINE / NO SUPPLY in muted amber (SPIN-UP while restarting).
  - Station feed junction (pre-placed, low on the +x wall): degraded 40 W. That is too little for a pump alone, but it trickle-charges a battery.
  - Small fuel generator (build [4], 2x2x2 cells): 200 W, burns fuel briquettes (1 = 30 kJ = 150 s at full output, hopper holds 3; E to load). Combustion turns room O2 into CO2 (0.12/s at full output): a quiet cost. The flame starves if room O2 < 5%. Heat placeholder: above 80% load it warms up, above 80 heat output derates toward 60%. Example: an I2 pump (180 W) on one generator runs about 6 min, then stutters on and off with no alarm.
  - Battery buffer (build [5], 1x1x2 cells): 12 kJ, charges at 80 W and discharges at up to 240 W. When empty it cuts off until recharged to 35% (no flicker). Junction + empty battery + pump gives a quiet duty cycle: about 105 s charging, about 50 s pumping.
  - Power cable (build [6]): one segment per cell, consumed from inventory; X refunds it. Cable clips glow dim cyan when the circuit can deliver power and go dark when dead. Aim at a cable to see circuit supply/demand and battery %.
  - Holograms: generator/battery ghosts and cable ghost (arms + plug stubs + snap cell), cyan valid / red blocked (occupied, not touching a cable or device, no item in inventory). The cable blueprint previews what it joins and 'supply X W / pump need Y W' (amber 'NOT ENOUGH'). The pump blueprint states its watt need. The build bar shows owned counts.
  - Crafting: Power cable x4 (T1, 1 scrap), Fuel briquette x2 (T1, 1 scrap), Small fuel generator (T1, 6 scrap) known at start. Battery buffer (T2, 5 scrap) is locked until you scan the new findable 'Spent power cell' (on the empty planter); that scan also raises the craft-table unlock to T2. Recipes now support a yield. Start inventory: 8 cable. Scrap crate stock 8 -> 10.
  - Wall base monitor gains a quiet line: PWR gen W, load served/wanted W, battery %.
  - Debug: K = power kit (generator, battery, 12 cable, 4 briquettes). Tests: ?selftest slice5 block (A no path / junction only, B generator on/disconnect/reconnect/fuel out, C generator->battery->pump chain, D trickle duty cycle, E heat derate, F craft/scan gate, G blueprint rules + refund + mass conservation); ?keytest includes keys 6/LMB/X/4/K. ?shot=p_offline|p_grid|p_battery|p_empty|p_bp_gen|p_bp_cable|p_bp_red|p_craft -> play/slice5_*.png (./play/shots.sh slice5 ...). ?pwrlog writes grid state to the page title.
  - Extensibility hooks: any device with powerRole 'consumer' + anchors() + powerDemand() joins the grid (liquid pumps, lights, LUCID control chips). Pass-through/priority rules live in one place (PowerNetwork.update). Cable overload added in slice 6.
  - Placeholders / not yet (after slice 5): wireless range, generator wear/servicing, conveyor-fed fuel, real heat sim, power priority UI, LUCID control-chip remote switching.

- 2026-10-05: Slice 6 (prototype 0.6, same single index.html): cable ratings + overload + breaker. Backup: .backup/index_v0.5_pre_slice6.html.
  - Cable tiers T1/T2/T3 = [80, 200, 500] W. Same overload % bands and timers as pipes (CFG.pipe.safeOver/fastOver/burstOver + slowFail/fastFail/burstFail). Overload % = (watts - rating) / rating.
  - CableSegment: tier, inflow W (circuit served load, ONI-style), stress/damage/fail, toughness jitter. Failed cable opens the circuit (skipped in PowerNetwork connectivity). LOAD% sprite on segments into consumers (green/amber/orange/red like pipes). Reinforce in place with craftable cable_sleeve via [G] (visible sleeve bands). Repair = hold [E] (faster with repair kit).
  - Quiet-then-crisis: 20–30% over → noise + slow crack + growing stress (sparks/heat particles) + brownout (efficiency loss / intermittent flicker on the circuit). >30% fails faster; >75% shorts/melts in a few seconds (bang + one toast; pump loses power).
  - Breaker (build [7]): floor pedestal, bridges cable runs when CLOSED. Trips before T1 burst (~100 W) or when a cable on the grid fails. [E] resets. Craftable after scanning a cracked fuse.
  - Craft/scan: cable_sleeve (scan melted cable remnant), breaker (scan cracked fuse block). Both T2; scanning raises craft-table unlock to T2.
  - Demo grids: quickGrid/showcaseGrid place T2 cables so 120–180 W demos stay stable. Player-placed cables stay T1 (120 W pump ≈ 50% over → quiet-then-crisis).
  - Build HUD: [6] Cable T1, [7] Breaker. Blueprint warns when pump need exceeds T1 rating.
  - Tests: ?selftest slice6 block (A T2 safe, B T1 stress band, C T1 burst under I2, D repair, E sleeve, F breaker trip+reset, G breaker on cable fail, H craft/scan, I blueprint). ?shot=c_overload|c_fail|c_breaker|c_sleeve|c_bp_cable|c_bp_breaker|c_finds|c_craft → play/slice6_*.png.
  - Placeholders / not yet: wireless range, generator wear, conveyor-fed fuel, real heat sim, power priority UI, LUCID control-chip remote switching, cable tiers above T3 / build-menu tier dropdown for cables.


- 2026-10-05: Slice 7 (prototype 0.7, same single index.html): liquid pump + liquid pipes sharing gas architecture. Backup: .backup/index_v0.6_pre_slice7.html.
  - LiquidContainer + room puddle (floor wetness stub). PipeNetwork(medium:'liquid') parallel to gas: same Link overload ratio bands, load %, reinforce, burst → leak liquid into puddle.
  - Liquid pump: free-standing boxy/industrial machine (NOT wall-fixed, distinct from gas cone) — skid feet, inlet stub + top outlets, front monitor (PWR, FLOW L/h ≡ brief scale, filter %), side filter hatch + empty control socket, visible intake/outlet upgrade add-ons. Floor placeable via cyan/red hologram. Needs power like gas pump (80 W at I1).
  - Ports: 1 inlet (sucks from piped tank / adjacent tank / puddle), 1 outlet; unlockable outlets 2–4 equal split; intake upgradeable (I1/I2/I3).
  - Numbers: brief first liquid pump ≈ 10 L/hour. CFG.liquid.protoScale = 3600 → 1 sim-second moves the litres the brief moves in 1 hour, so baseFlow 10 (sim L/s) ≡ 10 L/h on the monitor. liquidPipe tiers [10, 25, 60, 120, 250].
  - Liquid pipes: blue-steel look, LOAD% on first segment, identical overload bands/timers to gas; reinforce with same collar.
  - Craft/scan: scan cracked liquid pump housing → unlocks liquid_pump + liquid_filter (T2). liquid_pipe x4 known at start (T1). Build [8] liquid pump, [9] liquid pipe.
  - Room demo: water tank (replaces empty planter) piped through liquid pump to plant water inlet (PlantWaterPort sink fills plant.water). Player sees tank drain / plant water rise when pump is powered.
  - Quiet-then-crisis preserved; gas/power paths unchanged (selftest H regression).
  - Tests: ?selftest slice7 block; ?shot=l_overview|l_pump|l_flow|l_overload|l_bp_pump|l_bp_pipe|l_finds|l_craft → play/slice7_*.png.
  - Placeholders / not yet: LUCID control-link module in gas/liquid pump socket, surface/airlock, conveyors, liquid freeze, multi-room liquid networks.

- 2026-10-05: Slice 8 (prototype 0.8, same single index.html): LUCID control-link module fills the mystery side socket. Backup: .backup/index_v0.7_pre_slice8.html.
  - Control link module (wifi-router look): small graphite box with a teal lid stripe, 'LUCID' label, two splayed antennas (counter-tilted so they stand upright on the sloped gas cone), 3 LEDs (PWR green; LINK steady cyan when LUCID has a carrier, blinking amber otherwise; ACT amber flicker with flow, fast flicker when a remote command lands). Brass plug tongue slides into the socket (0.45 s ease-in). Once it is seated the socket's black mouth and pins are hidden.
  - Same module and same API on BOTH pumps (LinkSocket mixin on GasPump + LiquidPump): hasLink / attachLink / detachLink / installLink (uses 1 from inventory) / removeLink (refunds) / socketPrompt / socketInteract / linkVisual. Pump front monitors show '◉ LINK GP-1' / 'LP-1'.
  - Without module: the pump is local-only. E on its monitor still toggles it (always, link or not). Remote commands are refused ('That unit has no control link. It only answers its own monitor.').
  - Install: aim at the side socket, then [E] with a module in your pack (or [L] while aiming anywhere at the pump). E on a filled socket pulls the module back into the pack. Removing a linked pump with X in build mode also refunds the module. Socket prompt stays unexplained ('Nothing you carry fits it') until the blueprint is known.
  - Scan/craft: new findable 'Dead relay router' on the floor under the base monitor (snapped antenna, dark LEDs). Scanning it once archives 'LUCID control link' (T3 table, 7 scrap) and raises the craft-table unlock to T3, so the player bolts on vice + drill. LUCID: 'That empty socket on the pumps was waiting for this.'
  - Remote control: the wall BASE ATMOSPHERE monitor is now a BaseMonitor entity. Top-right LUCID LINK list: '# TAG ● STATE FLOW unit' (ON green, OFF grey, OFFLINE/SPIN-UP muted amber). While looking at it (outside build mode), number keys 1-9 toggle that unit. [E] opens the LUCID LINK panel (pointer unlocked, the world keeps running behind it): rows with state, kind, flow, filter %, W, plus a toggle button. Keys 1-9 work there too; Esc/E/click [Esc] closes it. Remote toggle = the pump's own switch: it still needs a powered cable path (it reads OFFLINE otherwise).
  - Sparse LUCID: one HUD line ever, on the first handshake ('Handshake from GP-1. I can switch it from the base monitor now.'). Everything after that (more links, remote switches, pulled modules) is a single line on the wall monitor only. Quiet watch: a linked unit that was running and loses supply gets one monitor line ('GP-1: no supply.'). No toast, no beep. The link gives you information, but only if you go and look.
  - Architecture (toward control chip / central control room): LucidNet (game.lucidNet) = registry + the ONLY command path. Every sender emits EventBus 'lucid:command' { op, target (index | tag | device), via, authority }. LucidNet.handle answers on the message (cmd.result) and with 'lucid:result', and logs the last 24 commands. Authority table in CFG.lucid.authority: 'link' = status/on/off/toggle (module); 'chip' = adds trim/priority (late-game control chip, accepted by the router but not craftable). LucidNet.controlRoom = null stub; capacity = CFG.lucid.relayLinks (6, suit relay; going over makes LUCID say he will lag). Later the control room is just another sender with authority 'chip' and more capacity. Game.lucidLine(msg, loud) emits 'lucid:hud' (rare) or 'lucid:note' (monitor).
  - Fix (slice 7 bug found while shooting): PipeNetwork passes sinks a RATE, but WaterTank/PlantWaterPort added it as an AMOUNT every tick, so water appeared from nothing (slice 7 shots show 'Floor wet 500 L'). Now they add rate x network dt, and overflow goes to the puddle. Liquid mass drift = 0 (selftest slice8.K). The slice 7 numbers that change as a result: C_flow plant water +38.5 over 5 s (was +80), D_overload puddle ~30 L (was capped at 500).
  - Debug: K kit adds 2 control links. Tests: ?selftest slice8 block (A no-link local only, B install gate + visible module, C remote on/status/off + raw bus emit, D liquid pump, E pull/refund/re-seat keeps tag, F scan+T3 craft gate, G authority stub, H builder refund, I quiet counts, J regression, K liquid mass). ?keytest8 drives the real input path (E at socket, L, digits at monitor, panel E/click/digit/Esc, pull). ?keytest is now an exact flag. ?shot=s8_socket|s8_socket_item|s8_link_gas|s8_link_liquid|s8_monitor|s8_remote|s8_panel|s8_router|s8_craft -> play/slice8_*.png. shots.sh/selftest.sh add a cache-buster.
  - Placeholders / not yet (after slice 8; orb body landed in slice 9): control chip + control room (authority 'chip'), wireless range/obstruction, link power draw, linking generators/batteries/breakers (any device can mix in LinkSocket + gain a socket), surface/airlock, conveyors, orb upgrades (arms/lasers/legs).


- 2026-10-05: Slice 9 (prototype 0.9, same single index.html): LUCID orb companion (early body). Backup: .backup/index_v0.8_pre_slice9.html.
  - Inert orb findable on a pedestal by the -X wall (exploration fantasy). Hold [F] to scan ("Dormant companion chassis…") — brings LUCID online as suit-only text if not already. [E] wakes it: inert sphere hides, floating companion body appears. Until woken, LUCID stays suit-only HUD/monitor text even after other scans.
  - LucidOrb: translucent tech sphere (shell + emissive core + meridian rings) follows the player at a short right/behind offset with a gentle hover bob. Faces the player. Status hologram disc on top: LINK count ring + tiny suit O2 hint (amber "O2!" when air/suit is thin).
  - Empty upgrade stubs (visible sockets, scannable later — nothing fits yet):
      * arm hardpoint (right side) — empty collar + dark bay
      * dig-laser mount (front) — empty emitter shroud
      * leg stub (underside) — empty tripod socket
    Aiming at a stub shows a quiet prompt. Late game: arms, digging lasers, little legs; then human-size torso the orb plugs into; then control room (DESIGN LUCID section).
  - Personality: sparse short lines as a subtitle near the top of the HUD (`#orbsub`) and via lucidLine. Crisis reactions with CFG.lucid.orb.voiceCd (~14 s) cooldown: "Air thinning.", "Suit reserve low.", "GP-1 offline." No spam.
  - Remote control: [C] opens the same LUCID LINK panel from anywhere once the orb is awake (via='orb' on EventBus `lucid:command`). Looking at a linked pump also hints [C] companion. Without the orb, [C] toasts a quiet refusal; the wall monitor (number keys / [E] panel) still works exactly as in slice 8.
  - Progressive: suit-only → wake orb → remote anywhere. Wall monitor never requires the orb.
  - Architecture: Game.activateOrb() / game.lucid.orb / orbActive. InertOrb + LucidOrb entities. Companion panel reuses #lucidui with lucidVia 'orb'|'monitor'|'panel'.
  - Tests: ?selftest slice9 block (A suit-only + monitor without orb, B activate+follow, C remote via orb, D stubs, E voice cooldown, F status ring, G progressive both paths, H scan-then-E). ?shot=s9_inert|s9_orb|s9_follow|s9_stubs|s9_status|s9_panel|s9_remote|s9_voice → play/slice9_*.png.
  - Placeholders / not yet (after slice 9; airlock+surface landed in slice 10): orb upgrade parts (arm/laser/legs craft+bolt), torso chassis, control chip + control room, wireless range, conveyors, linking non-pump devices, ARK entrance.

- 2026-10-05: Slice 10 (prototype 1.0, same single index.html): airlock cycle + surface stub. Backup: .backup/index_v0.9_pre_slice10.html.
  - Working two-door airlock replaces the sealed-door placeholder on the +z wall. Chamber is its own GasContainer; base room and outdoor stay separate volumes.
  - Proper cycle (buttons / [E] on panel or door): close near door → vent or pressurize chamber → open far door. Cycle OUT vents chamber to outdoor then fills with thin surface air; cycle IN evacuates then pressurizes from base (small O2 cost). Base never opens straight to outdoor when used correctly. Improper force-open (contaminate base) deferred.
  - Surface stub beyond the outer door: larger dark ruined outdoor space, very low O2 GasContainer (`game.outdoor`). Exhaust vents still dump to infinite `game.surface` sink (unchanged). Quiet-then-crisis: outdoors looks still; suit reserve drains.
  - Player `zoneAt` / `volumeAt`: base | airlock | surface. Breathing samples the local volume. First step outside → one sparse LUCID line ("Outside. Thin air. Suit reserve only.").
  - Surface findables: rare oxygen seedling (E dig up → inv), ARK-01 waypoint marker stub (E log signal), twisted hull scrap.
  - Indoor systems unchanged (pumps, power, craft, orb). HUD shows ZONE air + base O2 when away from base.
  - Tests: ?selftest slice10 (A cycle-out preserves base O2, B surface drains suit, C cycle-in small pressurize cost, D zones, E indoor regression, F round-trip). ?shot=s10_airlock|s10_panel|s10_cycle|s10_surface|s10_seedling|s10_ark|s10_outside|s10_return → play/slice10_*.png.
  - Placeholders / not yet: ARK entrance stub (grow lab), conveyors, orb upgrades, force-open airlock risk, multi-room base volumes, surface plants life cycle outdoors.

- 2026-10-05: Slice 11 (prototype 1.1, same single index.html): ARK-01 grow-lab entrance + first omni-tool. Backup: .backup/index_v1.0_pre_slice11.html.
  - Surface pad expanded (d 14→24) toward the ARK-01 waypoint; debris cleared on the hatch approach. Waypoint now leads to a bunker hatch the player can open with [E].
  - Grow-lab interior: separate sealed GasContainer (`game.growLab`) with life-support air (breathable), distinct teal grow-lights / dark floor from the base room. zoneAt / volumeAt add zone `'ark'`.
  - First omni-tool pickup inside (pedestal): [E] claim → `game.omni = true`. Speeds hold-[F] scans (`CFG.omni.scanMul`) and reveals blueprint name hints on findables. Enables dig.
  - Dig stub: soft soil/ore DigBlock meshes (VoxelWorld-backed). With omni, hold [V] to dig → remove block + drop soil / ore scrap. One surface mound + two grow-lab blocks.
  - Flavor: 2 strange plants (bulb / spiral), locked deeper bulkhead placeholder, sparse LUCID line on first entry ("ARK-01 grow-lab. Life support holding…").
  - Airlock / base / power / liquid paths unchanged (selftest F regression).
  - Tests: ?selftest slice11 (A hatch+air, B zones, C omni claim, D dig gate+drop, E scan faster, F indoor/airlock regression, G sealed distinct). ?shot=s11_surface|s11_hatch|s11_open|s11_lab|s11_omni|s11_plants|s11_dig|s11_locked → play/slice11_*.png.
  - Placeholders / not yet: conveyors, deeper ARK levels (locked door), full voxel digging / terrain carve, omni base-building mode, orb upgrades, force-open airlock risk, surface plant life cycle outdoors.

- 2026-10-05: Slice 12 (prototype 1.2, same single index.html): conveyor belts for solids (unlike ONI). Backup: .backup/index_v1.1_pre_slice12.html.
  - Placeable conveyor segments on the 0.5 m floor grid: **belt**, **loader**, **unloader**. Build **[0]** selects conveyor; **`,` / `.`** cycle subtype; **R** rotates facing (straight + 90° corners by rotating adjacent segments). Cyan/red hologram like other buildables.
  - Item packets on belts: scrap, soil, ore scrap, fuel briquettes, filter cartridges (minimum: scrap + briquettes end-to-end). One packet per cell; visible small mesh rides the belt.
  - **Loader**: hopper (cap 8). [E] deposit from inventory (briquettes / soil / ore / filter) or convert 1 room scrap. Auto-pulls from an adjacent ScrapCrate or StorageCrate. Spawns packets onto the belt when powered.
  - **Unloader**: when a packet arrives, feeds a nearby Generator (`addFuel` for briquettes), StorageCrate, or the room scrap pool / player inventory for other solids.
  - **Power**: each segment is a modest consumer (CFG.conveyor.segW = 5 W). Needs a live cable touching its footprint. Unpowered = packets freeze in place (quiet failure — no toast).
  - Craft/scan: findable **Torn conveyor roller** in ARK-01 grow-lab. Scan unlocks conveyor_belt (x4), conveyor_loader, conveyor_unloader (T1). Debug **K** kit includes belts + loader + unloader.
  - Storage crate pre-placed near the scrap crate (unloader endpoint / manual [E] withdraw).
  - How to build a briquette→generator run: craft belts after scanning the roller → build [0] loader near scrap/drop zone → place belt segments with R toward a generator → unloader next to the gen → cable-power the run (battery or gen) → [E] on loader to deposit briquettes → watch them ride into the fuel hopper. Optional scripted demo: `conveyorDemo(game, slice)`.
  - Tests: ?selftest slice12 (A inventory gate+place, B powered move / unpowered freeze, C briquette→generator, D scrap path, E scan unlock set, F craft+rotate, G pump regression). ?shot=s12_belt|s12_move|s12_power|s12_loader|s12_unloader|s12_bp|s12_find|s12_craft → play/slice12_*.png.
  - Placeholders / not yet (after slice 12; deeper ARK landed in slice 13): full voxel expand, dig-drop auto-pickup onto belts, junctions/splitters beyond rotate-on-place, creatures/imps, more orb upgrades, force-open airlock risk.


- 2026-10-05: Slice 13 (prototype 1.3, same single index.html): deeper ARK — unlock sealed bulkhead. Backup: .backup/index_v1.2_pre_slice13.html.
  - Unlock puzzle (quiet-then-reward): restore **ARK local power junction** in grow-lab ([E]) → close **gate breaker** by the bulkhead ([E], refuses without feed) → bulkhead panel lights → [E] open. Alternate: craft **ARK clearance chip** (scan blank wafer deeper / in records) and insert at the gate panel.
  - Beyond bulkhead: short corridor then **records alcove** (−X) + **hydroponics annex** (+X). Shared `growLab` gas (breathable). arkBounds extended by CFG.ark.deeper.d; grow-lab back wall has a door gap.
  - Rewards: scannable **dormant arm actuator** → blueprint `orb_arm` (T3); bolt onto LUCID orb arm hardpoint with [E] when orb awake. **Blank clearance wafer** → `clearance_chip`. Lore terminal (LUCID comments on ARK primary directive). Scrap crate + ore/soil dig blocks in hydro.
  - Sparse LUCID: unlock ("Deeper deck online…"), first step deeper ("Records alcove. Hydro annex…"), lore read, arm scan.
  - Airlock / surface / conveyors / base power unchanged (selftest G regression).
  - Tests: ?selftest slice13 (A gate sealed, B feed→breaker→open, C deeper zone+gas, D rewards+lore, E chip alternate, F orb arm bolt, G regression). ?shot=s13_locked|s13_feed|s13_breaker|s13_powered|s13_open|s13_records|s13_hydro|s13_reward → play/slice13_*.png.
  - Placeholders / not yet (after slice 13; dig-laser+legs landed in slice 14): full voxel expand / terrain carve, torso chassis, control chip + control room, creatures/imps, force-open airlock risk, dig-drop onto belts.

- 2026-10-05: Slice 14 (prototype 1.4, same single index.html): orb dig-laser + legs upgrades. Backup: .backup/index_v1.3_pre_slice14.html.
  - Craftable/scannable **orb dig-laser** (`orb_laser`, scan scorched emitter in deeper hydro) and **orb leg servos** (`orb_legs`, scan folded cluster on surface approach). Both T3; bolt onto empty orb stubs with [E] when orb awake — visible add-ons on the same body (barrel+glow tip on dig-laser mount; tripod limbs on leg socket). Arm path from slice 13 unchanged.
  - **Dig-laser** (orb awake + laser fitted): faster soft dig (`CFG.omni.laserDigMul`), longer reach (`laserRange` vs `digRange`), and digs **hard rock** tier plain omni cannot cut (`laserRockTime`). Hard-rock DigBlock in deeper hydro. Beam VFX stub (cylinder from emitter tip → block) while holding [V].
  - **Legs**: limited independent move. [C] companion panel gains Hold / Recall / Scout when legs fitted. Hold pins world position; Recall returns to follow offset; Scout parks a few metres ahead of the player (`CFG.lucid.orb.scoutFwd`).
  - Upgrade philosophy preserved: empty stubs → bolted visible parts; prompts explain craft/scan gates.
  - Tests: ?selftest slice14 (A scan gate+findables, B bolt all three, C dig speed/rock gate, D range, E Hold/Recall/Scout, F craft+fit, G regression). ?shot=s14_laser_find|s14_legs_find|s14_stubs|s14_fitted|s14_dig_beam|s14_rock|s14_hold|s14_panel → play/slice14_*.png.
  - Placeholders / not yet (after slice 14; voxel dig carve landed in slice 15): torso chassis, control chip + control room, creatures/imps, force-open airlock risk, arm fine-motor actions, gas venting into dug volumes.

- 2026-10-05: Slice 15 (prototype 1.5, same single index.html): voxel digging expansion — carve terrain / placeable dug space. Backup: .backup/index_v1.4_pre_slice15.html.
  - **VoxelWorld** expanded from stub → small chunked dig grid: DigZones, solid/dug tracking, support checks, dig occupancy, world↔cell mapping. Cells share the 0.5 m GRID size.
  - **Outdoor berm near ARK** (contiguous mound, not sparse DigBlocks): soft soil + ore shell, hard-rock core (dig-laser required). Hold [V] digs; removes cell + collider; leaves a thin dig-floor pad (aimable placement volume).
  - **Dug empty cells = placeable volume** for pumps / belts (pipes/cables/craft follow same voxel solid/support rules when aimed in-zone). Builder no longer floor-snaps only at Y=0 — dig placement uses dug floor Y.
  - **Blueprint hologram**: cyan if cell free + supported; red if solid voxel still there or unsupported ("Solid terrain — dig first" / "Unsupported").
  - **Drops**: dug resources go to inventory + quiet ground crumb near player; optional auto into adjacent conveyor loader hopper (CFG.omni.autoLoader).
  - **Gas**: digging does **not** vent sealed rooms / airlock / growLab yet (`CFG.dig.ventRooms = false`). Documented as future (gas volumes into digs).
  - Soft + hard rock tiers unchanged (laser for hard); berm is a contiguous diggable mass.
  - Tests: ?selftest slice15 (A berm contiguous+tiers, B dig cell→dug+drop+floor, C rock laser gate, D carve pocket→place belt+pump / solid red, E blueprint support + no vent flag, F regression). ?shot=s15_berm|s15_dig|s15_pocket|s15_bp_cyan|s15_bp_red|s15_pump|s15_belt|s15_rock → play/slice15_*.png.
  - Placeholders / not yet (after slice 15; imps landed in slice 16): gas venting into dug volumes (landed in slice 17), wall-mount in digs, torso chassis, control chip + control room, force-open airlock risk, arm fine-motor actions, cutscene stub.

- 2026-10-05: Slice 16 (prototype 1.6, same single index.html): labor imps (DESIGN: Creatures). Backup: .backup/index_v1.5_pre_slice16.html.
  - **Imp entity**: small humanoid (~0.95 m), split down the middle: organic left half (flesh torso with a visibly breathing chest, pointed ear, organic eye, three-finger hand, fleshy leg) and robotic right half (steel torso with front O2 intake grille, back breather canister, antenna ear, jaw plate, glowing lens eye, piston leg, hammer-claw arm). Seated slump when dormant/down; walk cycle; job poses (hammering with sparks at the bench, arm out over the plant, both arms forward carrying a scrap chunk). The robotic eye is the health readout: cyan fine, amber sluggish, red blink on reserve, dark when down, slow dim pulse when dormant. A small tag (TAG JOB, WORK %, reserve s) only shows within ~3 m.
  - **Where they are**: (1) surface — crashed labour-cage wreck left of the ARK path, with a dying amber status lamp and one dormant imp slumped beside it. (2) Deeper ARK records alcove — a labour cradle at the back wall, spawned when the bulkhead opens (`placeArkImp` inside `ArkBulkhead.buildDeeper`).
  - **Recruit**: hold [E] (1 s) to jump-start a dormant imp. It only takes in breathable air at the imp's position; outside it 'gasps once and slumps' (refused). So the wreck imp must be **carried**: [Q] picks up any imp (dormant, down or awake; you walk at 82% speed, HUD 'Carrying …'), [Q] again sets it down in front of you. Wake it in the base. The ARK imp wakes in place (life support) and follows you home. First recruit gets one loud LUCID line ('…It breathes like you do — smaller lungs. Count it on the O2 budget.'); later ones are wall-monitor notes. Tags IMP-1, IMP-2…
  - **Follow stub**: trails ~1.15 m behind your last MOVE direction (not the view, so turning to look at it does not make it scurry). Beyond 6.5 m or stuck for 1.6 s it 'catches up' behind you (also across sealed doors/zones — documented stub; no door pathing yet). Imps walk with the same collision boxes as you; progress-based stuck detection (sliding along a wall is not progress) then a short 'squeeze' hop (≤0.9 m, same zone only) past thin partitions.
  - **Jobs** (tap [E] on an awake imp to cycle; prompt says if the target is missing in that zone): FOLLOW → WANDER (around where you set it) → TEND PLANT (stands at the nearest OxygenPlant, waters 2.4/s × work speed while water < 75) → LABOR (stands at the nearest craft table and hammers: +1 scrap per 30 s at full speed) → HAUL (state machine seek → toPile → pick 0.8 s → toCrate → drop 0.5 s → seek / idle; one chunk at a time from `LoosePile`s to the nearest StorageCrate, else ScrapCrate where 2 hauled chunks = 1 salvage stock). Targets are same-zone only.
  - **Haul sources**: base 'Rubble spill (loose scrap)' x6 near the scrap/storage crates (you can also [E] grab one). **Dig spoil**: when an awake HAUL imp works the same zone, each dig also leaves a 1-scrap spoil pile next to the cell (slice 15 inventory drop is unchanged; without a hauler no pile). Tested in the ARK hydro annex → records scrap crate.
  - **Gas**: every awake imp breathes `game.volumeAt(pos)` like a small player: 0.22 O2 → CO2 per s at rest (player 1.0), ×1.35 while working (labor/haul/tend), ×0.6 while carried awake. Dormant and powered-down imps do not breathe. Mass conserved. Wall monitor shows a quiet `IMPS n(k down) O2 -x.xx/s` on the tank/liquid line (no alarm colour).
  - **Thin air (no gore)**: work speed = 100% at O2 ≥ 19% and CO2 ≤ 5%, sliding to 35% at the breathable floor (O2 15% / CO2 10%; the robotic half is slightly more CO2-tolerant than you). Below that it runs a ~40 s internal reserve (±15% per imp so a crew does not drop in the same second) at 22% speed, then **powers down** (seated slump, eye dark): LUCID '…powered down — not enough air. Core sealed, not dead. Fix the air, then jump-start it.' (loud only the first time ever, then monitor notes). One quiet monitor note per thinning episode when an imp drops under 70% ('IMP-n is slowing…'). Jump-start is refused until the air is fixed.
  - **Quiet-then-crisis numbers** (selftest): a healthy mature plant buffers 2 imps (O2 33.6% vs 32.0% after 120 s, no alarm). With no O2 production the base turns unbreathable for you at 28 s with 2 imps vs 40 s without. 4 working imps + withered plant: first quiet 'slowing' note at 37 s, first power-down at ~88 s, all four down by ~97 s (≈50 s of quiet warning, then a cascade).
  - **Fix (slice 13 bug found here)**: hydro annex ore/soil DigBlocks sat at hydroZ+3.4/+3.8, behind the annex back wall and outside `arkBounds` (zone read as 'surface'). Moved to hydroZ+2.75 / +2.9 (inside, still clear of the rock vein and flora). Slice 13/14 selftests unchanged.
  - **Debug**: [J] spawns an awake imp at your feet. Tests: `?selftest` slice16 block (A breathe/convert/conserve, B recruit via carry, B2 ARK imp + follow + cross-zone stub, C atmosphere impact, D labor + tend, E haul conservation + phases, E2 dig spoil with/without hauler, F low-O2 slow → down → refused → revived, G quiet-then-crisis timings, H regression: pump power, carry speed, airlock, growLab, dig vent flag). `?keytest16` drives real input (E refused outside, Q carry, Q set down, hold E jump-start, E job cycle, J debug). Slices 1–15 selftest output identical to the pre-slice baseline (slice 2 varies run to run from random pipe toughness, as before). `?shot=s16_wreck|s16_wake_fail|s16_cradle|s16_carry|s16_follow|s16_labor|s16_tend|s16_haul|s16_down|s16_crisis|s16_monitor|s16_spoil` → play/slice16_*.png (`BUDGET=2500 ./play/shots.sh slice16 …`). Selftest JSON snapshot: play/slice16_selftest.json.
  - Architecture: `Imp` (Entity) + `LoosePile` + `impDigSpoil` (Game listens to 'dig:block', payload now carries wx/wz) + `spawnImp / placeImpWreck / placeArkImp` + `impSay` (orb subtitle if awake, else suit HUD / monitor). Bus events: imp:recruit, imp:wake, imp:job, imp:labor, imp:haul, imp:slow, imp:down, imp:carry, imp:setdown, imp:spoil. `game.imps`, `game.piles`, `game.carrying`. All tunables in `CFG.imp`.
  - Placeholders / not yet: real pathfinding through doors (follow catch-up is a stub; job imps stay in their zone), imps cycling the airlock themselves, imp food/repair/upkeep, imp bench assist on craft time (crafting is instant), LUCID link for imps (assign jobs from the monitor), more imps in other ARKs, imp-specific O2 starvation in dug volumes (landed in slice 17: imps in a dig pocket breathe the pocket).

- 2026-10-05: Slice 17 (prototype 1.7, same single index.html): gas venting into digs — dug pockets become air volumes. Backup: .backup/index_v1.6_pre_slice17.html.
  - **Dig ridge**: new walk-in ridge against the −x boundary wall (x −9..−5.5, z ≈ z0+15, 3.5 m deep × 3 m tall × 4 m wide; `CFG.ridge`, `buildDigRidge`). Stepped face, plain blocks, a rock seam on the bottom layer; 290 cells (234 soil / 24 ore / 32 rock). Walk-in zones have no floating floor pads; digging the cell under a pad drops it. `makeDigZone` gained `walkIn` / `backWall` options.
  - **PocketNet** (`game.pockets`, `CFG.dig.pockets = true`): connected dug cells are flood-filled into pockets P-1, P-2… each with its own GasContainer (1 m³ per cell). A newly opened cell pulls in outdoor-density air plus a soil CO2 release (soil .16 / ore .08 / rock .03 of the cell volume): opening up a pocket *makes* bad air. Faces open to the outside exchange with `game.outdoor` (conductance .10 per face; CO2 is heavy and leaves slower, ×.15 'co2Stick'). Soft (soil/ore) faces seep a little CO2 up to a 30% cap. Pocket gas is preserved cell-by-cell when pockets merge or split on rebuild. A CO2 haze plane on each pocket floor thickens with CO2. Sealed pockets overfilled past 1.15× bleed the excess.
  - `CFG.dig.ventRooms` stays false and now means 'digging never breaches a sealed base/ARK room' (still true; base-wall contamination is out of scope, outdoor berm/ridge pockets first).
  - **Breathing the pocket**: `game.volumeAt(p)` returns the pocket's gas inside a pocket, so the player, imps and pumps all use it with no special cases. Player: `player.pocket`, HUD zone 'DIG POCKET P-n (SEALED)', warning 'POCKET AIR BAD', darker fog, suit lamp on inside pockets. Suit drain ×1.5 while pocket CO2 is toxic; death text 'The dead air in the dig got you.' Imps refuse to wake in pocket air and an awake imp walked in powers down on its reserve (slice 16 rules, no special code).
  - **LUCID (sparse)**: the first bad pocket ever gives one loud line ('Dug pocket P-n. Soil CO2 pooled in here — worse than outside. Suit only.' or, if CO2 is not toxic, 'Dug pocket P-n. Thin air, trapped. Suit only.'); each pocket warns once; after that, monitor notes only. Pocket sealed / air state changes are quiet monitor notes.
  - **Seal curtain (minimal seal stub)**: recipe `seal_curtain` (x2, T1, 2 scrap, unlocked at start). [E] on a dug floor cell hangs translucent strips filling that column; walk-through but leaky (.006 per face vs .10 open), flaps to .08 while the player or an imp stands in it. [E] on it takes it down and refunds it. Two curtains seal the ridge tunnel (openFaces 0).
  - **Pump into pocket (stretch, landed as a hook + working path)**: `PocketFeed` coupling on the +x base wall ('FEED > DIG POCKET'), a pipe sink with `deliver()`; it routes into `pockets.feedTarget()` (the most recently sealed pocket) or vents outdoors when nothing is sealed. `PipeNetwork` now delivers to any sink with `deliver` and returns blow-back to the pump's own source volume (mass conserved). `GasPump` placed in a dig draws from `volumeAt` (`srcVol`); base pumps still draw the room.
  - **Numbers** (selftest slice17): ridge tunnel P-1 32 cells / 10 open faces, O2 0.141% / CO2 15.5% at dig, 16.3% after 180 s vs outdoor O2 0.141% / CO2 0.1% (distinct, worse than outside). Berm pocket P-2 8 cells CO2 9.6%, leaks faster. Player dies in the open pocket at 17 s (suit drain 45 vs 30 per 10 s). Imp powers down after its reserve (~21–26 s; reserve is ±15% random per imp). Open pocket keeps 40% of fed O2 after 30 s, sealed keeps 94%; curtain flap ×7.2 leak. Feed I2 1 L/s: scrubbed base → pocket breathable at 60 s (O2 95.6 / CO2 4.4); floor-intake trap (27% CO2 at the floor) → pocket ends at 30% CO2, never breathable (roof-intake lesson); filter wear kills the filter ~150 s but the flush completes first. An occupant breathing 1/s pushes the fed pocket toxic in ~1 s (imp: 10% CO2 in ~8 s) — a feed must be ~12× breathing rate: the feed flushes an empty pocket, it is not life support.
  - **Found, not changed**: `Player.update` drains breath at 6/s whenever breathing from the suit, so time-to-death after leaving breathable air is ~16.7 s regardless of suit reserve; pocket ×1.5 suit drain is visible on the gauge but does not change time-to-death. Fixing it rebalances every survival number — left for a dedicated tuning pass.
  - **Tests**: `?selftest` slice17 block (A ridge, B tunnel pocket, B2 berm pocket, C player breath/LUCID/suit/death, D imp, E open vs sealed leak, F curtain seal/flap/refund, G feed: none/scrubbed/floor-intake/filter wear/occupant, H mass, I regression: base vs dig pump source, growLab, ventRooms, berm pad, airlock, pockets off). `?keytest17` drives real input (E refused without item, E hang, prompt, E take down + refund, W walk-in → DIG POCKET P-1 + LUCID). Slices 1–16 identical to baseline except seal_curtain in slice 3/4 start-recipe lists (slice 2 and 16 numbers vary run to run, as before). Snapshot play/slice17_selftest.json. Shots `?shot=s17_ridge|s17_inside|s17_imp|s17_curtain|s17_sealed|s17_feed|s17_flushed|s17_berm` → play/slice17_*.png (`BUDGET=2500 ./play/shots.sh slice17 …`).
  - Architecture: `PocketNet` + `SealCurtain` + `PocketFeed` entities; helpers `carveRidgeTunnel`, `ridgeSpot`, `pocketFeedRun`. Bus events pocket:sealed, pocket:breach, pocket:air, pocket:warn, pocket:rebuild. Tunables in `CFG.pocket` and `CFG.ridge`.
  - Placeholders / not yet (after slice 17; hatch/scrub/feed-target/suit TTD landed in slice 18): digging that breaches base/ARK walls and contaminates rooms, cave-ins, pocket temperature/pressure physics, imps choosing to avoid bad pockets, cutscene stub, second ARK.


- 2026-10-05: Slice 18 (prototype 1.8, same single index.html): proper seal + pocket life support. Backup: .backup/index_v1.7_pre_slice18.html.
  - **Seal hatch**: recipe `seal_hatch` (T1, 4 scrap, start-unlocked). [E] on a dug floor prefers hatch over curtain when both are in pack. Solid panel fills the column; **closed = nearly airtight** (`hatchK` 0.00025 ≈ 4% of a curtain face; retention 99.8% O2 after 30 s vs curtain 94%). **Walk-through only when open** (collision box toggles); [E] open/close, hold [E] ~0.85 s to take down (refund). Curtain path unchanged for slice 17.
  - **Pocket scrubber**: recipe `pocket_scrubber` (T2, 6 scrap). [E] on dug floor with scrubber and no seal in pack places it. Converts CO2→O2 at `scrubRate` 1.15/s (sustains 1 player; filter life 500 L CO2). Selftest: sealed hatch pocket + scrubber keeps player alive 60 s breathable; without scrubber the same pocket turns toxic in ~1.4 s; open pocket + scrubber still kills (~55 s) via leak + suit.
  - **RETURN < DIG POCKET**: second +x wall coupling (`PocketReturn`). Dig pump → return dumps into the base room after scrubbing ~88% of the stream's CO2 (`returnScrub`). FEED still flushes; return closes the LS loop with the plant.
  - **Feed target UI**: [E] on FEED cycles `pockets.feedSel` among sealed pockets; prompt shows target. HUD shows pocket O2/CO2 while inside (`Pocket air`) and `Feed → P-n` when outside with a sealed target.
  - **Ceiling-draw tip**: first time FEED delivers mix with CO2 ≥ `co2FeedTip` (0.12), quiet LUCID/monitor note: roof-mount the base pump intake to draw the light O2 layer.
  - **Suit TTD fix**: suit reserve now sustains breath (breath held/refilled while `suit > 0`); breath only collapses after the reserve is empty (`breathCollapse` 22/s). Light retune `suitDrain` 3.0 → 2.8. Pocket ×1.5 scrubber load still applies. Outdoor TTD ~40 s; pocket with full suit ~28 s (was ~17 s regardless of suit). Slice 17 C_player.tDead updates with the new curve; curtain/feed/imp numbers otherwise intact.
  - **Tests**: `?selftest` slice18 (A suit TTD, B hatch vs curtain + walk gate, C feed cycle + tip + HUD, D scrub sustains sealed occupant, E return scrub math, F regression). Snapshot play/slice18_selftest.json. Shots `?shot=s18_hatch|s18_open|s18_scrub|s18_alive|s18_return|s18_feed|s18_tip|s18_hud` → play/slice18_*.png.
  - Architecture: `SealHatch`, `PocketScrubber`, `PocketReturn`; `PocketNet.hangSeal` / `tryHangHatch` / `tryPlaceScrubber` / `cycleFeedTarget` / `feedSel`. Tunables in `CFG.pocket` + `CFG.player.breathCollapse`.
  - Placeholders / not yet (after slice 18; opening cutscene stub landed in slice 19): second ARK, digging that breaches base/ARK walls, cave-ins, imps cycling hatches, pocket temperature/pressure, LUCID assign-jobs-from-monitor for imps.

- 2026-10-05: Slice 19 (prototype 1.9, same single index.html): opening cutscene stub (in-engine, skippable). Backup: .backup/index_v1.8_pre_slice19.html.
  - **OpeningCutscene**: 8 condensed DESIGN beats (~69 s total): launch → station → news corridor (mission/ARKS/teleporter) → portal mishap → time-bubble/war flash → meet LUCID → crash near ARK → visor damaged. Title cards + simple geometry stand-ins + fog color shifts; stand-ins parked at Y=220 so the playable base never peeks through.
  - **Skip**: Space / Esc ends early, marks seen, drops into base spawn (0,0,3) with a brief visor glitch fade on #introglitch / vignette.
  - **Persist**: localStorage key `breathless_seenIntro`. Returning players skip. Hold Shift on click-to-begin (or `?intro=1`, or Shift+N in-game) forces replay.
  - **Does not touch** gas/build/imp/pocket systems — only gates the start click and drives the camera while `intro.active`.
  - **Tests**: `?selftest` slice19 (A beats 6–10 & <90s, B localStorage flag, C skip sets flag, D playthrough completes, E drop-in at base + visor, F regression). Snapshot play/slice19_selftest.json. Shots `?shot=s19_launch|s19_news|s19_portal|s19_war|s19_lucid|s19_crash|s19_visor` → play/slice19_*.png.
  - Placeholders / not yet (after slice 19; second ARK landed in slice 20): fuller production cutscenes (face shot / generated stills), digging that breaches base/ARK walls, cave-ins, imps cycling hatches, pocket temperature/pressure, LUCID assign-jobs-from-monitor for imps.


- 2026-10-05: Slice 20 (prototype 2.0, same single index.html): second ARK POI — robotics / LUCID body lab. Backup: .backup/index_v1.9_pre_slice20.html.
  - **Primary directive (DISTINCT from ARK-01 grow-lab)**: robotics / LUCID body fabrication (`CFG.ark2.directive = 'robotics'`). Log line: FABRICATE / BODY / HOST. Fits DESIGN orb→torso path (human-size torso the orb plugs into).
  - **Surface**: outdoor pad expanded (w 18→22, d 24→34). New amber ARK-02 waypoint west/further out (`x≈-6`, `zOff=26`); walkable thin-air approach (suit). Debris cleared on the −X/+Z path; approach light.
  - **Gate**: soil-packed hatch rails — 3 soft DigBlocks in the doorway. Hatch [E] refuses until dug clear with the **omni-tool from ARK-01** (hold [V]). Without omni: "need omni-tool dig from ARK-01".
  - **Interior**: sealed `game.robotLab` GasContainer (breathable life support). Zone `'ark2'` / HUD `ARK-02 BODY LAB`. Amber/copper robotics palette (distinct from grow-lab teal).
  - **Rewards**: scannable **dormant torso chassis stub** → blueprint `orb_torso` (T4, 14 scrap); **dormant torso orb housing** set-piece (empty chest bay sized for LUCID orb); lore terminal; scrap crate (+ ore dig sample).
  - **Sparse LUCID**: waypoint discovery, hatch open, first entry ("ARK-02 body lab. Robotics directive…"), lore read, torso scan, housing interact.
  - Airlock / ARK-01 / pockets / intro / conveyors / imps unchanged (selftest F regression).
  - Tests: `?selftest` slice20 (A approach+waypoint distance, B sealed distinct gas+zone, C dig gate, D rewards+lore, E LUCID entry, F regression). Snapshot play/slice20_selftest.json. Shots `?shot=s20_approach|s20_waypoint|s20_plugs|s20_gate|s20_open|s20_lab|s20_torso|s20_lore|s20_reward` → play/slice20_*.png.
  - Placeholders / not yet (after slice 20; torso assembly landed in slice 21): torso assembly UI (orb→chest seat), control chip + control room, third ARK, fuller production cutscenes, digging that breaches base/ARK walls, cave-ins, imps cycling hatches, pocket temperature/pressure, LUCID assign-jobs-from-monitor for imps.

- 2026-10-05: Slice 21 (prototype 2.1, same single index.html): LUCID torso assembly. Backup: .backup/index_v2.0_pre_slice21.html.
  - **Craft/place**: `orb_torso` (T4, 14 scrap, scan from ARK-02) crafts a placeable torso chassis. [E] on empty floor places a mobile `TorsoChassis`. Alternately assemble at the fixed **ARK-02 torso housing** bay ([E] with chassis in pack).
  - **Seat**: with orb awake, [E] on empty chest bay docks the orb mesh into a human-size floating robotic upper body (`buildLucidTorsoMesh`). Free orb hides; LUCID continues from the torso. Upgrade sockets (arm / dig-laser / legs) remapped onto torso stubs; fitted parts re-painted.
  - **Behavior**: torso follows like the orb but slightly slower (`CFG.lucid.torso.follow`); [C] companion panel still works (via='orb', meta shows "Torso companion"); first seating sparse line **"This will do. For now."**
  - **Unseat**: [E] on the floating torso body returns free orb form; chassis/bay empties and becomes seatable again.
  - **Control room stub**: scan blank control-room schematic in ARK-02 → unlocks `control_room` recipe (T5, `stub: true`) — craft UI greys it ("later"); craft refuses ("assembly not ready yet"). `LucidNet.controlRoom` remains null.
  - Airlock / ARK-01 / pockets / intro / links unchanged (selftest G regression).
  - Tests: `?selftest` slice21 (A craft+place, B seat+follow, C panel, D unseat, E ARK-02 bay assemble+seat, F control stub, G regression). Snapshot play/slice21_selftest.json. Shots `?shot=s21_chassis|s21_bay|s21_seat|s21_follow|s21_panel|s21_unseat|s21_schematic|s21_craft` → play/slice21_*.png.
  - Placeholders / not yet (after slice 21; control room + chip landed in slice 22): third ARK, fuller production cutscenes, digging that breaches base/ARK walls, cave-ins, imps cycling hatches, pocket temperature/pressure, LUCID assign-jobs-from-monitor for imps, torso lower-body / legs that walk.

- 2026-10-05: Slice 22 (prototype 2.2, same single index.html): control room + control chip. Backup: .backup/index_v2.1_pre_slice22.html.
  - **Control room console**: `control_room` recipe (T5, 20 scrap) is craftable (was greyed stub in slice 21). Scan blank schematic in ARK-02 still unlocks it (and now also `control_chip`). [E] on floor places a placeable console desk with empty LUCID dock bay + status screen.
  - **Install LUCID**: [E] on console docks awake orb (or seated torso) into the bay. Dual mode: companion follow **pauses** while installed; undock from control panel restores companion + suit relay capacity. Sparse first-install line: **"I am the base now. Almost."**
  - **Control chip**: craftable T5 (8 scrap). [E] on pump/generator **chip bay** (near the link socket) seats a visible teal chip. Chips register with LucidNet; raise capacity when LUCID is installed (`relayLinks` 6 → `controlRoomLinks` 24). Chip-reserved `lucid:command` ops **trim** / **priority** work (stubs); link authority still refused for those.
  - **Control room UI**: [E] on installed console or [C] while installed opens LUCID BASE panel — lists all linked/chipped devices, CHIP tags, group ALL ON/OFF, trim± / pri± stubs, Undock LUCID. Wall monitor / panel route with chip authority while installed.
  - Airlock / ARK-01/02 / pockets / torso / links unchanged (selftest G regression).
  - Tests: `?selftest` slice22 (A craft+place, B dock+capacity+line+undock, C chip install, D central toggle, E trim/priority + link deny, F group toggle, G regression). Snapshot play/slice22_selftest.json. Shots `?shot=s22_console|s22_dock|s22_chip|s22_panel|s22_toggle|s22_craft|s22_schematic|s22_priority` → play/slice22_*.png.
  - Placeholders / not yet (after slice 22; priority→PowerNetwork landed in slice 23): third ARK, fuller production cutscenes, digging that breaches base/ARK walls, cave-ins, imps cycling hatches, pocket temperature/pressure, LUCID assign-jobs-from-monitor for imps, torso lower-body / legs that walk, wireless range/obstruction, chip power draw.

- 2026-10-05: Slice 23 (prototype 2.3, same single index.html): Priority wired into PowerNetwork service order. Backup: .backup/index_v2.2_pre_slice23.html.
  - **Scarce watts**: PowerNetwork serves consumers ALL-OR-NOTHING by chip priority (high first). Unchipped devices use `priorityUnchipped` (0) = lowest. Placement order remains the stable tiebreak.
  - **Demo**: two I1 gas pumps (≈120 W each) on one 200 W generator — high priority runs, low stays OFFLINE quietly (monitor OFFLINE / NO SUPPLY, no toast spam).
  - **Control room**: pri+/pri− (and LucidNet `priority` op) now change who runs under brownout; message no longer says "(stub)".
  - **Cables/breakers unchanged**: priority only allocates the available watt budget; cable inflow / breaker trip still use the served load.
  - Quiet-then-crisis: shedding a low-pri consumer raises no HUD alarm; linked units may get one monitor "no supply" note (existing LucidNet quiet watch).
  - Tests: `?selftest` slice23 (A brownout high-wins, B swap via command, C unchipped lowest, D panel pri+/pri−, E cable inflow = served, F quiet, G regression). Snapshot play/slice23_selftest.json. Shots `?shot=s23_brownout|s23_hi|s23_lo|s23_swap|s23_panel|s23_unchipped|s23_monitor|s23_chip` → play/slice23_*.png.
  - Placeholders / not yet: third ARK, fuller production cutscenes, digging that breaches base/ARK walls, cave-ins, imps cycling hatches, pocket temperature/pressure, LUCID assign-jobs-from-monitor for imps, torso lower-body / legs that walk, wireless range/obstruction, chip power draw.

- 2026-10-05: Slice 24 (prototype 2.4, same single index.html): assign imp jobs from the LUCID BASE panel / wall monitor. Backup: .backup/index_v2.3_pre_slice24.html.
  - **Crew list**: when LUCID can reach the crew (orb/torso companion awake, or installed in the control room), the LUCID panel shows an **IMP CREW** section: every recruited imp with tag, current job, health (OK / THIN AIR / RESERVE Ns / DOWN / CARRIED), zone, plus a dim idle reason (e.g. "no crate in this zone"). The wall monitor canvas draws a compact IMP CREW block under the LUCID LINK list (takes the O2 trend's space while crew is shown).
  - **Remote orders**: new `lucid:command` op `imp_job` `{ target: index|tag|imp, job, via }` → `LucidNet._crewOrder` → **`Imp.setJob`** (exact same state machine as the local [E] cycle: resets haul/wander state, emits `imp:job`). Panel: click a job button, or **[Tab]** select imp + **[Shift+1-5]** (FOLLOW / TEND / LABOR / HAUL / WANDER) or **F T L H W**. Wall monitor (aimed, not in build mode): **[Tab]** next imp, **[Shift+1-5]** job. Plain [1-9] still switch linked units (unchanged).
  - **Routes**: via `control` needs LUCID docked (refused when undocked); via `orb` / `monitor` / `panel` work with companion OR control room. LUCID offline / no body → refused with a short reason. Down imps accept an order (queued: starts after jump-start); carried imps refuse.
  - **Sparse**: ONE HUD confirm ever ("Crew orders run through me now. IMP-n → JOB."); after that success is a silent UI update (no toast, no monitor line); failures toast.
  - Power priority / chips / links / local [E] cycle unchanged (slice 23 block identical; H regression).
  - Tests: `?selftest` slice24 (A list, B remote HAUL+TEND with the player ~3 m away — haul runs full toPile→pick→toCrate→drop cycle, 3 scrap hauled; tend waters the plant, C same state machine vs local cycle, D routes orb/monitor OK + control-undocked/no-body/offline refused, E real keys in open panel Tab+Shift+4+T + monitor crew rows, F down/carried, G sparse, H regression, SUCCESS). Snapshot play/slice24_selftest.json. Shots `?shot=s24_panel|s24_monitor|s24_haul|s24_tend|s24_orb|s24_down` → play/slice24_*.png.
  - Placeholders / not yet: third ARK, fuller production cutscenes, digging that breaches base/ARK walls, cave-ins, imps cycling hatches, pocket temperature/pressure, torso lower-body / legs that walk, wireless range/obstruction, chip power draw, per-imp targets (pick which plant/crate), crew schedules/shifts, imps pathing between sealed zones on order.

- 2026-10-05: Slice 25 (prototype 2.5, same single index.html): polish / stabilize pass, no big new systems. Backup: .backup/index_v2.4_pre_slice25.html.
  - **UI consistency**: CSS `:root` tokens (`--ui-font`, `--ui-mono`, `--fs` 13px, `--pad`, `--r`, shared ink/dim/warn/bad/accent colours + a LUCID green set). Craft UI and LUCID BASE panel now share one `.panel` shell (theme vars per panel, `.row` flex-wrap, `.btns` wrapping button groups, `.hint`, `.sect`), so buttons wrap instead of overflowing; LUCID panel widens to 640 px (`.wide`) when it has crew/units. JS palette `UI_COL` drives the wall monitor canvas and panels. Build HUD regrouped into GAS / POWER / LIQUID / SOLIDS rows + one keys line. Craft recipes sort craftable → needs tier → locked. Checked at 1280×800 (and 800 px wide in the selftest): no row overflow, panel fits viewport.
  - **Help / start**: [H] help rewritten as a centred two-column overlay grouped MOVE & ACT, AIR, BUILD, PUMPS & PIPES, POWER, LIQUID & CONVEYOR, LUCID, IMP CREW, ARKS & DIGGING, INTRO, and **DEBUG** (all `?`-params / debug keys live only there). Start screen = premise + compact controls grid, no changelog/debug wording. Bottom hint bar: H controls · B build · Esc pause. After the first start, Esc / lost pointer lock shows a small **PAUSED** card (click to resume, H still opens help) instead of the full title.
  - **Quiet crisis**: `CFG.ui = { crisisGap: 8, crisisKindGap: 45, alertWindow: 90, noteRepeat: 20, offlineNoteCd: 60 }`. `Game.crisisNote(kind,msg)` gates pipe burst / cable short / breaker trip / imp power-down toasts: at most one crisis toast per 8 s and one per kind per 45 s; everything else is only counted. `Game.alertSummary()` collapses the last 90 s into ONE line (e.g. "PIPE BURST ×3 · CABLE SHORT ×2 · BREAKER TRIP") drawn as the monitor's ALERT line. Identical LUCID quiet notes within 20 s are dropped; per-unit "no supply"/"offline" notes have a 60 s cooldown. Measured cascade: 6 failure events → 1 toast.
  - **Wall monitor layout**: left = atmosphere (O2/CO2/pressure/power), right = LUCID LINK + IMP CREW (O2 trend only if space remains), bottom band = quiet numbers line, one ALERT line (muted amber), one ellipsized LUCID line.
  - **Bug fixes**: imp FOLLOW no longer warps across zones into unbreathable air — it waits at the hatch with job note "waiting: the air where you are is too thin for it. Carry it [Q]." and resumes when you return; craft "[Esc] close" is clickable; LUCID panel / help are closed when the death screen appears; pointer-lock promise rejections are caught (`lockPointer()` → PAUSED card), so headless tests no longer log "Uncaught" pointer-lock errors (note: pointer lock never engages in headless Chrome; tests drive keys directly).
  - **Imp QoL**: control-room-only **ALL IMPS → FOLLOW / TEND / LABOR / HAUL / WANDER** bar in the LUCID crew section (`ui.lucidImpJobAll` → bus op `imp_job_all` → `LucidNet._crewOrderAll`; needs LUCID docked; carried imps skipped; result "All crew → LABOR (n, k skipped)", silent on success). TEND now picks the **nearest thirsty** living plant in the imp's own zone (then nearest living, withered last) — never another zone.
  - **Balance (CFG before → after)**:
    - `plant.stages` Seedling output ×0.35 → ×0.55, Aging ×0.5 → ×0.75 (the replant gap no longer spikes CO2 past 8% with 2 imps).
    - `pocket.co2SuitMul` 1.5 → 1.35 (pocket suit TTD 28 s → 31 s; surface TTD unchanged 40.25 s, ARK-02 round trip margin 27.5 s).
    - `imp.o2Use` 0.22 → 0.20; new `imp.tendBreath` 1.1 (TEND imp breathes a little harder while working).
    - Measured (selftest D, 1200 s sim): 2 imps + attended plant survive (min O2 27.5%, max CO2 6.7%); 2 imps with one on TEND survive (max CO2 7.2%); neglect (no watering) dies at ~126 s (CO2); 3 imps on one plant die ~340 s — so attention matters but 2 imps are fair.
    - Slice 16 converts check now uses `CFG.imp.o2Use*10*.9` instead of a hard number (snapshot diff intentional).
  - Tests: `?selftest` slice25 (A_ui tokens/shared shell/no overflow/1280×800 + 800 px fit, B_help all keys + DEBUG section + clean start + PAUSED card, C_quiet cascade/summary/dedupe/cooldowns, D_balance suit TTD + plant vs 2 imps, E_bugs follow-zone/tend-zone/craft click/lock helper, F_impQoL all-imps button + undock refusal, G_regression s23/s24/s16, H_deathPanel last, SUCCESS). All earlier slice SUCCESS flags unchanged (only the expected `slice8.A_noLink.remoteOk` false as before). Keytests unchanged vs 2.4. Snapshot play/slice25_selftest.json. Shots `?shot=s25_panel|s25_monitor|s25_companion|s25_build|s25_help|s25_craft|s25_start|s25_paused` → play/slice25_*.png (`SIZE=1280,800 BUDGET=2500 bash play/shots.sh slice25 s25_…`, then strip the `s25_` from file names).
  - Placeholders / not yet (after slice 25; third ARK landed in slice 26): third ARK, fuller production cutscenes, digging that breaches base/ARK walls, cave-ins, imps cycling hatches, pocket temperature/pressure, torso legs that walk, wireless range/obstruction, chip power draw, per-imp targets beyond nearest-thirsty plant, crew schedules, imps pathing between sealed zones on order.

- 2026-10-06: Slice 26 (prototype 2.5 line, same single index.html; version string left at 2.5 — slice 25 selftest pins it): third ARK POI — ARK-03 power / mining works. Backup: .backup/index_v2.5_pre_slice26.html.
  - **Primary directive (distinct from ARK-01 grow-lab and ARK-02 body lab)**: power / mining (`CFG.ark3.directive = 'power'`). Log: GENERATE / STORE / MINE — "fed the other two ARKs": batteries, heavy cable, ore pressed into fuel, a deep bore.
  - **Surface**: outdoor pad d 34 → 50 (w 22). ARK-03 hatch at `x=5, zOff=40` (furthest out, behind ARK-01's deeper deck). Sodium-yellow waypoint at (2.4, z0+36.8). Approach lane x≈−1.2 between ARK-01 and ARK-02, then diagonal. A few tipped ore carts on the far field (off the lane) + an amber approach light.
  - **Suit timing (2.5 numbers unchanged)**: measured with the real player walk (World.move + suit drain): airlock → ARK-03 door 12.9 s (suit 64% left), margin 23 s vs the 40.25 s surface TTD after the 4.4 s airlock cycle; ARK-02 → ARK-03 6.8 s; ARK-03 → airlock 12.8 s (margin 23 s). No mid shelter needed; ARK-02 is an optional refill on the way.
  - **Gate (existing systems)**: dead hydraulic blast door. `Ark3BatteryCradle` (2 slots; [E] seats a crafted `battery`: 12 kJ, 240 W out each) + `Ark3Feeder` (scorched T1 ram feeder; [E] or [G] with a `cable_sleeve` → T2 → T3, same `CFG.power.cable.tiers` 80/200/500 W). Door panel [E] = cycle the rams: surge 360 W × 6 s.
    - Bank < 360 W (0 or 1 battery) → rams stall quietly, nothing breaks.
    - Feeder judged with the same overload ratio bands as pipes/cables (`ark3SurgeFailT`, CFG.pipe safe/fast/burst): T1 = 450% load, T2 = 180% load → burst band (3 s < 6 s stroke) → feeder **shorts** (one `crisisNote('cable')`, sparks, bank loses 3 kJ). Shorted feeder refuses sleeves until repaired with a repair kit.
    - T3 = 72% load → rams bite, slab rolls into the wing, door collider removed; bank pays 2.16 kJ. Batteries can be pulled back from the cradle afterwards (door latch holds).
  - **Interior**: sealed `game.mineLab` GasContainer (vol 200, O2 50 / CO2 5 — breathable), zone `'ark3'`, HUD `ARK-03 POWER WORKS`, death text "ARK-03 power-works air failed you." Amber/industrial look: raw concrete + basalt shell, spoil heaps at the portal, black/yellow hazard chevrons, sodium-vapour ceiling strips, heavy cable trays, dead turbine with a rusted flywheel, ore rails + tipped cart, rock-face partition.
  - **Rewards**:
    - Scan **Twin-stack generator manifold** → `gen_manifold` (T3, 9 scrap). [E] on a generator with one in your pack bolts a visible add-on (block + second stack): rated 200 → 350 W (`CFG.ark3.manifoldW`), heat/derate scale to the new rating, CO2 per W unchanged so more watts = more fuel + more room CO2. Tested: two ~120 W pumps on one generator — 1 runs at 200 W, both run after the manifold.
    - Scan **Briquette press die** → `ore_briquette` (T2): 2 ore scrap → 3 fuel briquettes, no scrap (recipes can now cost `ore` and `gives` another item id). A soft ore seam on the ARK-03 −X wall supplies the first 2 ore.
    - **Deep-bore collapse**: 4 hard-rock DigBlocks choke the shaft gap (plain omni refuses; LUCID dig-laser clears them). Behind: **Worn mining drill head** → `mining_drill` (T5; stub in slice 26, made placeable in slice 27).
    - Lore terminal + scrap crate (6).
  - **Sparse LUCID**: waypoint, first gate refusal (once), door open, first entry, lore, three scan lines (7 lines across the whole slice; repeat lore read is silent).
  - **Fix found here**: ground behind ARK-01's still-sealed bulkhead (deeper deck not built yet, no walls) read as zone `'ark'` = free grow-lab air on the new ARK-03 route. `zoneAt` now treats it as surface until the deeper deck exists.
  - Tests: `?selftest` slice26 (A_reach real-walk TTD for 3 legs + margins, B_gate stall/short T1/short T2/repair/open T3 + door blocks, C_interior zone/gas/refill/entry line, D_rewards locked→scan→craft manifold + real two-pump grid, ore dig → briquettes, laser collapse → drill stub, E_lucid sparse, F_regression incl. ARK-01 sealed-bulkhead zone, SUCCESS). All earlier slice booleans identical to the 2.5 baseline (numeric diffs only in the known random slice 2 pipe toughness / slice 16–17 imp reserve values); keytests identical. Snapshot play/slice26_selftest.json. Shots `?shot=s26_approach|s26_waypoint|s26_gate|s26_short|s26_open|s26_hall|s26_lore|s26_collapse|s26_drill|s26_manifold|s26_craft` → play/slice26_*.png (`SIZE=1280,800 BUDGET=2500 bash play/shots.sh slice26 s26_…`, then strip `s26_`).
  - Placeholders / not yet (after slice 26; mining drill landed in slice 27): placeable ore→briquette refinery machine (crafting-table press for now), ARK-03 turbine restart / feeding power back to base, cable T4 heavy feeder, LUCID commentary on the ARK chain, mid-route shelters (not needed at current suit numbers), fuller production cutscenes, digging that breaches base/ARK walls, cave-ins, imps cycling hatches, torso legs that walk, wireless range, chip power draw.

- 2026-10-06: Slice 27 (prototype **2.6**, same single index.html): mining drill — make the ARK-03 placeholder real. Backup: `.backup/index_v2.5_pre_slice27.html`.
  - **Unlock**: clear ARK-03 dig-laser hard-rock cave-in → scan **Worn mining drill head** → craft `mining_drill` (T5, 24 scrap). Same scan also unlocks `drill_bit` (T3, 8 scrap). Recipe stub removed; craft UI no longer greys it "later".
  - **Placeable machine**: [E] from pack places a 2×2 footprint drill on the base GRID (`Builder.drillCandidate` / `placeDrill`). Faces yaw; aims a forward cone (`CFG.mining.reach` 1.9 m / `side` 0.85 m) at undug DigBlocks / berm cells.
  - **Power**: consumer **150 W** continuous (`CFG.mining.drillW`) — documented in help / craft note. Respects cable tiers (T1 = 80 W will overload under the drill alone; **T2 = 200 W recommended**) and priority chips (`ChipSocket` on the drill; scarce watts serve high-priority chipped devices first).
  - **Auto-mine**: when powered, digs the facing DigBlock slowly (`digMul` 2.8× player digNeed; with bit `bitDigMul` 1.2×). Soft soil/ore without a bit; hard rock needs the hardened bit. Output: adjacent conveyor **loader** hopper preferred, else ground crumb + pack (`giveItem`) — same drop ids as hand dig (`ore_scrap` / `soil`).
  - **Upgrade philosophy**: visible hardened drill bit add-on bolts on with [E] (glowing tip mesh) — faster dig + rock capability. Same "bolt-on grows the object" pattern as the generator boost manifold.
  - **Version**: title / help / start card → **2.6**; slice25 `B_help.version` expects `/2\.6/`; slice26 `D_rewards` now expects a successful craft (not the old stub "later" string) and `drill_bit` unlock.
  - Tests: `?selftest` slice27 (A_craft unlock/place/150 W, B_unpowered no dig, C_dig powered ore over time, D_loader hopper or ground, E_bit visible + rock, F_priority chip + T2 cable note, G_regression ARK-03 + 2.6 + s25/s26, SUCCESS). Snapshot `play/slice27_selftest.json`. Shots `?shot=s27_craft|s27_place|s27_power|s27_dig|s27_belt|s27_bit` → `play/slice27_*.png`.
  - Placeholders / not yet (after slice 27; refinery landed in slice 28): ARK-03 **turbine** restart / power line home, save-state, cable T4, fuller production cutscenes, digging that breaches base/ARK walls, cave-ins, imps cycling hatches, torso legs that walk, wireless range, chip power draw.

- 2026-10-06: Slice 28 (prototype **2.7**, same single index.html): placeable ore refinery machine. Backup: `.backup/index_v2.6_pre_slice28.html`.
  - **Unlock**: scan ARK-03 **Briquette press die** → still unlocks table `ore_briquette` (2 ore → 3 briquettes, manual fallback) and now also `ore_refinery` (T3, 18 scrap) + `refinery_crusher` (T3, 6 scrap).
  - **Machine**: place with [E] from pack (2×2 footprint). Consumer **100 W** continuous (`CFG.refinery.drawW`) — T1 (80 W) overloads alone; **T2 (200 W) recommended**. Respects cables / priority chips (`ChipSocket`).
  - **Recipe (better than table)**: **2 ore scrap → 4 fuel briquettes** per cycle in **5.0 s** when powered (`inOre`/`outBrick`/`cycleSec`). Table remains 2→3 instant / no power.
  - **Crusher add-on** (optional, visible): [E] bolt → cycle time ×0.55 ≈ **2.75 s** (`crusherMul`). Same object grows.
  - **I/O**: player [E] deposits ore / takes briquettes; **unloader** feeds `ore_scrap` into input hopper; **loader** pulls briquette output (and finishCycle prefers adjacent loader hopper). Hoppers cap 8 in / 8 out.
  - **Version**: title / help / start card → **2.7**; slice25 `B_help.version` expects `/2\.7/`; slice27 `G_regression.version27` expects 2.7.
  - Tests: `?selftest` slice28 (A_craft unlock/place/100 W + table fallback, B_unpowered no cycle, C_run 2→4 over ~5 s, D_belt unloader→refinery→loader, E_crusher faster + visible, F_priority/T2, G_regression drill/ARK-03/2.7, SUCCESS). Snapshot `play/slice28_selftest.json`. Shots `?shot=s28_craft|s28_place|s28_power|s28_run|s28_belt|s28_crusher` → `play/slice28_*.png`.
  - Placeholders / not yet: ARK-03 **turbine** restart / power line home, **save-state**, cable T4, fuller production cutscenes, digging that breaches base/ARK walls, cave-ins, imps cycling hatches, torso legs that walk, wireless range, chip power draw.

- 2026-10-06: Slice 29 (prototype **2.8**, same single index.html): **save-state persistence**. Backup: `.backup/index_v2.7_pre_slice29.html`.
  - **Storage**: `localStorage['breathless_save_v1']` (+ `_prev` = previous autosave, `_corrupt` = parked unreadable copy). `breathless_seenIntro` unchanged. Value = `BLZ1:` + LZW (variable-width codes over UTF-8, 15 bits per UTF-16 char) of the JSON snapshot; plain JSON is also accepted on read (debug).
  - **Schema**: `{ schema: 1, proto: '2.8', saved, t, sum, d }`. `SAVE_MIGRATIONS[n]` lifts schema n → n+1 (stub 0 → 1 included). A newer schema is refused. Unreadable / truncated / missing body → falls back to `_prev`; failing that, a fresh world plus toast "Save corrupt — starting a fresh base." and an amber note on the title card. Nothing throws into boot.
  - **What is saved (`d`)**:
    - **Player**: x/z, yaw, pitch, suit, breath, zone.
    - **Pack**: scrap, inventory, omni.
    - **Unlocks**: recipe ids + table tier cap.
    - **Flags**: every primitive `game._*` flag (one-shot LUCID lines, imp seq, …) and game time.
    - **Gases**: room / outdoor / grow-lab / robot-lab / mine-lab / airlock chamber, puddle.
    - **ARK doors**: ARK-01 hatch, feed, gate breaker, bulkhead (+ chip), ARK-02 hatch, ARK-03 door + attempts. The airlock state snaps a mid-cycle to its end state.
    - **Dug voxels**: one `i,j,k` list covering sample blocks, ARK-02 plugs, berm and ridge.
    - **Static world** keyed `Class@x,z`: scan finds, scrap / storage crates, omni pickup, inert orb, lore terminals, plant, water tank, ARK-02 housing, ARK-03 cradle / feeder, surface pickups.
    - **Placed**: gas / liquid pumps (cells, roof, dig floor, power, filter, intake, outlets, trim, priority, link tag), gas + liquid pipes (tier, link mask, damage, burst), cables (tier, damage, failed), generators (fuel, heat, manifold), batteries, breakers, craft tables (tier), belts (subtype, dir, hopper, ≤3 packets each), drills (bit), refineries (crusher, hoppers, progress), torso chassis, control-room consoles, seals (curtain / hatch + open), pocket scrubbers (filter).
    - **Pockets**: gas per pocket (matched by its first cell), id / tag, feed selection.
    - **LUCID**: net (unit order, tag seq, handshakes) and orb (arm / laser / legs, mode, torso host, control-room dock).
    - **Imps**: matched by origin, then order. State, job, tag, pos, home, reserve.
    - **Loose piles**.
  - **Load order** (`saveApply`, all under `SAVEQ.quiet` + `freeBuild`; pipe refresh / power rebuild batched to one pass):
    1. Doors (the bulkhead spawns the deeper deck first).
    2. Quiet dig of saved cells (no drops, no `dig:block`, no soil-CO2 pulse), then pocket rebuild.
    3. Remove every placed thing, then rebuild from saved cells.
    4. Seals and scrubbers.
    5. Static entities.
    6. Orb, torso and dock.
    7. Links and chips in the saved unit order (so [1-9] and tags stay stable).
    8. Imps and piles.
    9. Gases, pockets, player, pack, unlocks and flags last.
    10. `slice.pump/table/liquidPump` re-point to the rebuilt entities.
  - **When it saves**:
    - Every **60 s** of play (`CFG.save.interval`).
    - **1.5 s** after a new blueprint (`unlock:recipe`) or an airlock cycle-out (`airlock:done` surface).
    - **F5** (manual; Ctrl / Shift+F5 still reload).
    - `pagehide`.
    - **Never** after death (`player:dead` blocks), during the intro, before the first start, or in `?selftest` / `?shot` / `?preview` / `?nosave`.
    - Toast "Saved." is brief (1.1 s): always on F5, else at most once per 5 min (`toastGap`), and never for plain interval saves.
  - **Title**: with a save, the start card shows **Continue** (with age, minutes, machines / pipe / cable / tier / blueprints / scrap / imps) and **New game**. The save is applied at boot behind the card. Continue (or a click anywhere) resumes without the intro (Shift+click still forces it). New game wipes the main + prev keys and reloads into a fresh world.
  - **Size**:
    - Start base ≈ **1.1 k chars** (~2 KB).
    - Stress test (all ARK doors open, all 373 dig cells dug, 130 pipes): **2.5 k chars** (JSON 11 KB, ratio 4.4×), applied in ~50 ms.
    - Budget 120 k chars.
    - Particles, pipe meshes, burst fx, belt packets beyond 3 per segment and transient timers are not stored.
  - **Limits (known)**:
    - **In-place load is forward-only for one-way world flags.** Doors, dug cells, woken orb and fitted orb upgrades cannot be undone by loading an older save into a running page. This is not an issue at boot (fresh world), which is the only player path.
    - Mid-airlock cycle snaps to its end state.
    - Pipe toughness / burst direction are re-rolled. Damage and burst flags are kept.
    - Imp haul plans reset to 'seek', and a carried imp is set down where it was.
    - Ground dig drops (spawned loose items) are not saved. Dig spoil piles are saved.
    - One-shot LUCID lines are not replayed. Wall-monitor log history is not kept.
    - Static entities are keyed by class + position, so moving a static prop in a later build orphans its saved flag (harmless: it just reverts to default).
    - Save is per browser profile (localStorage), with no cloud sync and no slots.
  - **Version**: title / help / start card → **2.8**. The old version checks (slice25 `B_help.version`, slice27/28 `version27`) now accept `/2\.[7-9]/`.
  - **Tests**: `?selftest` slice29 (SUCCESS). Snapshot `play/slice29_selftest.json`.
    - A_schema: LZ round-trip incl. unicode / 70 k, migrations 0→1, newer refused, plain JSON.
    - B_roundtrip: save → remove gen / bat / pipes / cable, wreck pack / unlocks / player / gas, add a breaker → load restores all; second capture identical in placed / inv / unlocks / dug / doors / static / imps / piles / gas / orb / net; quiet; slice.pump re-pointed.
    - C_corrupt: prev fallback, safe fallback + parked copy, no body.
    - D_newgame: wipe; the real key is untouched; autosave off in debug.
    - E_title: card / buttons / info / note.
    - F_regression: 2.8 + s26–28.
    - G_stress: all doors + all dig cells + 130 pipes.
  - **Browser e2e**: `node --experimental-websocket play/e2e_save.mjs` (real Chrome profile: start → build → F5 → reload → Continue card + state restored → Continue skips intro → corrupt → fresh + note → New game wipes). Result in `play/slice29_e2e.json`. Shots `play/slice29_continue.png` (title Continue / New game), `play/slice29_loaded.png` (resumed base, "Saved."), `play/slice29_corrupt.png` (fallback note).
  - **Next**: ARK-03 **turbine line** landed in slice 30. Then save slots / export string, cable T4, more ARK content.

- 2026-10-06: Slice 30 (prototype **2.9**, same single index.html): **ARK-03 turbine restart + surface power line home**. Backup: `.backup/index_v2.8_pre_slice30.html`.
  - **Turbine (`Ark3Turbine`)** replaces the dead hall set dressing. Multi-step restart using existing systems (CFG.ark3.turbine):
    1. Hold [E] with a **repair kit** (or slow bare hands) to free seized bearings.
    2. [E] insert a **LUCID control chip** into the governor bay.
    3. [E]/[G] **sleeve** the scorched export stub T1→T2→T3 (cable sleeves; same `CFG.power.cable.tiers` 80/200/500).
    4. [E] load **fuel briquettes** (ore→briquette press / refinery).
    5. [E] **start** — spins the flywheel, burns mineLab O2→CO2, pushes up to **480 W**.
  - **Heat / trip**: high export load warms the turbine (`heatOver` 0.65 → derate → `tripHeat` 96 hard trip). Cool, then [E] restart. Sparse LUCID on first start / first trip.
  - **Outdoor pylons (`SurfacePylon`)** — 7 pre-placed masts east of the walk lane from ARK-03 apron to the airlock (`CFG.ark3.pylons`). Some spawn shorted. Same overload ratio bands as base cables: under a full 480 W push, T1/T2 pylons **short** and drop the line (`crisisNote('cable')`). Repair kit + sleeve to **T3** on every mast.
  - **Home feed (quiet success)**: when turbine running + export T3 + all pylons intact T3, `arkFeedCap()` boosts the base **station PowerJunction** (`availW = 40 + boost`). Junction panel flips to "ARK-03 FEED". First live boost: one toast + one LUCID line. No new indoor device to cable — pumps already on the junction just get bulk watts. Base cable tiers / breakers / priority chips still apply on the indoor grid (teach T3 + breakers under the new supply).
  - **Save**: schema stays **1** (no migration). New static keys `Ark3Turbine@x,z` and `SurfacePylon@x,z` in `d.st`. Proto string → **2.9**. Flags `_arkFeedLive` / `_pylonShortSaid` ride the existing `game._*` flag dump.
  - **Version**: title / help / start card → **2.9**. Slice 29 version check accepts `/2\.[89]/`; slice 25/27/28 already accept `/2\.[7-9]/`.
  - **Tests**: `?selftest` slice30 (A_restart multi-step gates, B_pylons T1 short / T3 live 480 W, C_home junction boost + pump powered with local gens empty, D_overheat trip + restart, E_save round-trip turbine+pylons schema 1, F_regression 2.9 + s27–29, SUCCESS). Snapshot `play/slice30_selftest.json`. Shots `?shot=s30_dead|s30_repair|s30_chip|s30_sleeve|s30_fuel|s30_run|s30_pylons|s30_short|s30_home|s30_feed` → `play/slice30_*.png`.
  - **Placeholders / not yet**: save slots / export string, cable T4 heavy feeder, fuller production cutscenes, digging that breaches base/ARK walls, cave-ins, imps cycling hatches, torso legs that walk, wireless range, chip power draw, mid-route shelters.
  - **Next**: save slots / export string, or cable T4 / more ARK content / production loops at scale.

- 2026-10-12: Slice 31 fix pass (prototype **2.9.1**, same single index.html): **live-playtest bug fixes**. Backup: `.backup/index_v2.9_pre_slice31fix.html`. No visual downgrades (monitor is sharper, new cyan floor-cell grid, orb beacon).
  - **Build floor detection**: `BuildMode.floorAssist()`. For floor-standing tools (pump, craft, gen/battery/breaker, liquid pump, belt), a hit on a low prop, pipe, decal or floor seam, or no hit in range, falls back to the camera ray vs the base floor plane y=0 (inside the room bounds with a tolerance, ≤6.6 m). Tall things in front (walls, machine tops), dig pockets, belts, roof mounts and craft-table upgrades keep their real hit. New **floor-cell highlight** (`cellHi`, additive shader grid snapped to the 0.5 m grid under the ghost footprint). Cyan when valid, red when blocked.
  - **Label layout**: `declutterLabels()` runs every frame on all camera-facing Sprite labels. Labels fade out past 6–10 m. Overlaps are culled nearest-first. Labels under HUD panels drop to 12%, and labels hanging in front of the wall monitor drop to 18%. HUD panels (`#room/#suit/#inv`) get `.dodge` (32% opacity) when the wall monitor or a kept label sits under them. Wall monitor canvas is now 2x (1024×512, mipmapped, anisotropic) on the same 512×256 layout. It stays explicitly flush and upright.
  - **Title screen**: `body.pregame` hides `#hud` until `enterGameplay()` / intro start (debug ?shot/?selftest/?preview keep the HUD).
  - **Lost pointer lock**: PAUSED card now leads with a pulsing **"Click to resume"**. `pointerlockerror` + window blur + a per-frame watchdog always surface it.
  - **Air balance**: `CFG.gas.volume` 600→**2400** with startO2 170→**680**, startCO2 8→**32** (same 28.3% / 1.3% start). `CFG.plant.waterUse` 1.4→**0.25**, new `startWater` **100** (was 70). Shots that wrote absolute room gas now scale by `GASV`. Numbers for a real start with nobody tending: t=100 s O2 31.2% / CO2 0.0%; 240 s 32.6% / 0.0%; plant withers ~290 s; CO2 2.9% at 360 s, 5.4% at 420 s; **unbreathable at ~482 s**, death ~522 s. With a tended plant (water + replant) the room is still fine at 1200 s (O2 33.5%). Before: O2 31→24.5%, CO2 7.9% at 100 s, dead at 141 s. New one-time stale-air toast at CO2 > 3.5%.
  - **Watering**: big invisible aim proxy on the plant (from eye height). [E] draws from the base water tank first and falls back to the suit canteen, so it never fails. Prompt shows `water N/100 (from tank X L | suit canteen)`. Label shows THIRSTY/Watering….
  - **LUCID discoverability**: the inert orb has an aim proxy plus a pulsing cyan floor halo and beacon light. Prompt: "press [E] to wake LUCID". The monitor offline line reads "LUCID: offline — wake the orb by the west wall [E]". [C] leaves build mode and, while LUCID sleeps, toasts where the orb is and what to press. One-time hint toast at 25 s.
  - **Version**: title / help / start card / save proto → **2.9.1** (slice 29/30 checks accept `2.9.x`).
  - **Tests**: `?selftest` slice31 (A_air calm 100/240 s + slow neglect ≥420 s + tended survives, B_water canteen/tank/prompt/eye-ray, C_lucid sloppy-aim hit/prompt/monitor/[C] hint/beacon, D_screens pregame hidden/resume card, E_build prop-on-floor not "Needs floor" + cell highlight + wall not faked, F_labels overlap/HUD/monitor culling + monitor dodge, G_regression). Slice 16 F test now scales its gas levels with `CFG.gas.volume`. All slices green.
  - **Note**: `shots.sh` uses the default Chrome profile and can serve a cached old page for `?shot=` URLs. Use a fresh `--user-data-dir` for current shots.

### 2026-10-12 — slice 32 (v3.0): underground liquid
- **Wet bluff** is a new walk-in DigZone against the +x boundary wall (7 × 6 × 10 cells, mouth facing -x). Existing ridge and berm tests are untouched. It hides three finite reservoirs (1 cell = 0.5 m = 125 L):
  - **W-1 water:** 16 cells, 1800 L, plus a 2400 L aquifer reserve that seeps in at 4 L/s.
  - **B-1 brine:** 8 cells, 650 L.
  - **O-1 crude:** 8 cells, 520 L, plus a 300 L reserve.
- **Warning signs (quiet):**
  - Soil near a reservoir is darker and glossier: big caves within 2 cells, small lenses only in their skin. Brine leaves a pale crust; crude leaves a black sheen.
  - Dug ceilings within 2 cells of a hidden reservoir drip. Each drip has a ring and a soft pluck sound.
  - Holding [F] on soil with the omni-tool for 1.4 s scans 3.2 m and shows x-ray holograms with type, volume and distance.
- **Breach:** digging a cell that touches a reservoir breaches it. The cave cells become part of the pocket and the whole volume lands in the pocket. You get a toast, a LUCID line and a gush sound.
- **Flow model:**
  - Liquid lives per dig pocket and only in its wet cells. The flood front grows 4 rings per second: it falls first, spreads along the floor, then rises once a layer is full.
  - The level is hydrostatic: wet cells fill from the bottom layer up.
  - The tunnel mouth has a 0.3 m spoil sill. Anything above it runs off into the ledger as spilled, so an open tunnel settles at about 0.30 m.
- **Seals:** closed curtains and hatches block liquid, because pockets split at seals. A hatch-sealed pocket filled to the roof (2.0 m, 3125 L). An open hatch lets levels equalise across it.
- **Player and imps:**
  - Wading multiplies speed by max(0.35, 1 − 0.9·depth), which is ×0.73 at 0.30 m.
  - Depth ≥ 1.55 m means submerged: no air, the suit drains ×2.6, the view gets murky fog in the liquid's colour, and death reads "You drowned…" (19 s from a full suit in the test).
  - Imps will not step into liquid deeper than 0.35 m.
- **Sump pump:** new T1 craft (5 scrap). Set it on a pocket floor; [E] cycles OFF / HOME / FUEL / DUMP. It draws 1.6 L/s, densest liquid first (brine sinks, crude floats).
  - HOME sends water only to base tank 0. Brine or crude at the intake makes the tank refuse and flag "REFUSED … contamination".
  - FUEL sends crude into the nearest generator at 9 kJ/L.
  - Two abstractions to note: the sump runs on its own cell (no grid power), and HOME uses a buried hose with no pipe run.
- **Rendering:**
  - Surfaces use per-type MeshPhysicalMaterial. Water is transmission/IOR 1.333 (real refraction). Brine is denser and paler. Crude is opaque black with clearcoat and iridescence.
  - Two scrolling normal layers plus a wade-ripple ring are injected into the shader.
  - Murk walls (outer faces only) carry depth absorption. Wet floors get additive animated caustics, strongest in water, dim in brine, none in crude.
- **Mass ledger:** reservoirs + pockets + home + fuel + dumped + spilled + lost is constant. The selftest checks this across breach, flow, pumping, seals and hatch opening.
- **Save:** saves now store reservoir state, per-pocket liquid and wet cells, the ledger, and sumps. On load, breaches are re-checked.
- **Tests:** slice32 A–H selftests (breach, flow, pump, types, seal, drown, save, regression), all green, with slices 24–31 still green. Shots are in play/slice32_*.png (damp, scan, flood, wade, sump, types, drown).

## Slice 33 (v3.1): crash start + feral survivors (2026-10-13)

**Crash start.** A new game puts you on the surface beside a crashed escape pod: scorched, tipped hull in its own crater, torn drogue chute, blown hatch, a debris furrow with embers, a smoke column, spark bursts from a severed trunk, a red strobe and fire light. The objective strip reads **FIND SHELTER** with a suit-O2 countdown and a bearing and distance to the bunker hatch. A green strobe and light shaft on the airlock frame acts as the beacon. While the objective runs, the pod's emergency bottle stretches the suit (drain x0.42, so ~85 s from full instead of ~36 s). Walking into the airlock and cycling in completes it once the outer door seals ("Shelter sealed — Bunker 1"). After that the LUCID orb hint arrives sooner. The pod locker holds 4 scrap and there is a readable flight log. **Continue** still resumes a save; a loaded game never replays the crash.

**Feral survivors replace the imps.** These are ragged, irradiated humans: gaunt, mottled and peeling skin, holed salvage clothing, patchy hair, about 1.7 m tall. They are not monsters. They roam outside and in the ARKs. Skittish ones bolt when you come within 5.5 m. Hostile ones stalk you and lunge, taking 14% of the suit reserve with a 3.2 s cooldown. Ferals run on adrenaline and are off the air books.

- **Trap.** Craft a *snare cage* (T1, 5 scrap) or a *reinforced cage* (T2, 8 scrap) and place it with [E]. A feral within 9 m drifts to the bait unless you stand over it, and the gate drops. It thrashes (6 s / 4 s), then stays calm (14 s / 22 s), then tears free and the cage bends.
- **Collar.** Craft a *mood-dampener collar* (T1, 6 scrap). During the calm window, hold [E] for 2.2 s. Trying during the thrash, or a flinch (14%/s), claws the suit and restarts the fit. When it locks, the survivor is sedated: carry it [Q] to good air and hold [E] to rouse it. It then becomes CREW-n with every old job (follow, wander, tend, labor, haul, LUCID remote orders and ALL).
- **Charge.** The collar holds 1800 s (30 real minutes) and drains only while the survivor is awake.
  - Below 25%: amber LED and a quiet monitor note.
  - Below 10%: red blink, head twitches, a note, and work speed x0.72.
  - At 0 it relapses: it bolts, or (50% when you are within 5 m) turns hostile, with a loud line. It cannot be roused again.
  - A *collar dock* (T1, 6 scrap) is a grid consumer drawing 60 W while charging and 2 W idle, and charges at 15 s/s (empty to full in 2 min). Crew below 30% walk to a free powered dock in their own zone.
  - Hold [R] on crew to hand-charge at 6 s/s.
- **Breathing.** Survivors breathe 0.90 O2/s at rest (player 1.0), x1.35 when working (1.215) and x1.1 when tending (0.99). A mature plant makes 1.9. One plant covers you plus one resting survivor (1.9 vs 1.9). Two survivors put you 0.9/s in deficit. The *O2 planter* (T1, 6 scrap, [E] in the base) adds another plant for +1.9.

**Sump fix (slice 32 leftovers).** The sump now runs on grid power through a **surface intake** bulkhead on the base +x wall. It is a consumer drawing 4 W plus 120 W per running sump. With no power, the sump stalls on NO POWER. HOME water fills the intake's 30 L header, which pushes up to 2 L/s out of its port into **built liquid pipe**; only piped water reaches a tank. An unpiped header backs up and the sump stalls on BACKED UP. Brine and crude are refused and flagged on the intake screen. Honest note: the run from the outdoor sump to the bulkhead is still a pre-laid umbilical, and FUEL mode is still a direct line to the nearest generator. The oil alcove has a low warm fill light, and the crude tint was lifted from 0x0a0705 to 0x16100a.

**Save.** Proto '3.1' (SAVE_SCHEMA stays 1). Imps save collar charge and mood. Traps, docks, planters, the intake header, the pod and the objective are saved too. 3.0 saves migrate: recruited imps get a full collar and their IMP-n tag becomes CREW-n, and untouched world imps become ferals (ARK = hostile). This is not reported as a warning.

**Tests.** slice33 A–J cover trap, fit, charge timing, relapse, breathing, crash, shelter, intake, save migration, plus regression and wording. All slice SUCCESS flags are green (24–33). Old fixtures were migrated:
- s16 uses a legacy fixture flag so world imps spawn collared.
- s16/s25 air-balance checks add one planter per survivor.
- s32 C/D drive the sump through the powered, piped intake.

Shots: play/slice33_{crash,shelter,feral,trap,collar,dock,intake}.png.

## v3.1.1 hotfix: can't walk out of the crashed escape pod (2026-10-23)
**Bug (tester).** A New game put you next to the crashed pod, but no movement key did anything. Reproduced in 3.1 with real held-W key events from the spawn: zero movement over 6 game seconds. Cause: the authored crash spawn sat inside a collider box beside the pod (x -5.45 to -4.95, z 10.88 to 12.28). Once the player overlaps a collider, the movement code refuses every direction, so you were frozen in place.
**Fix.** The crash start now looks for the nearest spot clear of every collider (searching outward from the authored spot, preferring the side facing the bunker door) and faces you at the bunker. Long frames on slow laptops are split into small steps so you can't skip into or snag on thin walls. Safety net: if you hold a move key for about 0.35 s while overlapping something or boxed in on all four sides, you are nudged to the nearest free spot. It only fires while you're trying to walk, so standing still in water or a tight dig never teleports you.
**Tests.** Selftest K walks the real new-game world from the spawn to the bunker and seals the airlock at 20 fps and 4 fps, and checks the nudge frees a player dropped inside the pod. `play/e2e_pod.mjs` runs a fresh browser profile, presses New game, holds W and steers to the airlock (3.1 fails, 3.1.1 passes). All slices 24 to 33 green. Graphics unchanged.

## Design note (user, 2026-10-03)
- Pumps (gas and liquid) are NOT fixed to walls or floors. They are free-standing, placeable/movable machines (own frame/feet, connect to pipes via ports), so they can be placed anywhere in the base, including in dug-out voxel space.

## Gas pump shape (user, 2026-10-03)
- Gas pump is a round cone / filter shape: open intake at the bottom (wide end), inlet/outlet connection points at the top (narrow end).
- It can be placed upside down (open end up) so it can collect lighter-than-room gases that rise (and normal orientation for heavier gases). Intake position within the room's gas layers matters for the gas sim (ONI-style gas layering by density).
- Liquid pump design to follow after the gas pump is signed off.
- Gas pump has a hatch/handle that pulls out a filter cartridge. The filter wears out and must be replaced periodically (consumable item; degraded filter lowers pump efficiency or stops it; likely craftable/conveyor-deliverable later).
- Gas pump has an optional wifi-router-looking attachment on its side (antennas, status light). It links the pump to the base control center layer (LUCID control room / central control chip, late game). Without it the pump is manual/standalone only.
- Standard pump (no wifi module) must show the empty module port/slot on its side, unexplained, so players wonder what it is for. Installing the control-link module later fills the slot.
- Gas pump layout update: front face = small monitoring screen with limited info (e.g. on/off, flow, filter wear). Filter service hatch + the small socket (control link slot, unexplained to players) move to the side of the cone. Corner brackets on the base stay. The separate large side slot is dropped.
- Gas pump front monitor shows: power state, flow rate (numeric, with unit), filter wear gauge. Limited info only. Pump design signed off by user (cone, side filter service + socket, front monitor, corner brackets).
- Gas pump intake: a mesh grille band running the ENTIRE circumference at the bottom of the cone (not a single arched vent). Gas is drawn in from all sides at the cone's open end.
- Gas pump mounting: current design = FLOOR mount. If the player places it on the ROOF (ceiling), the blueprint/placement ghost auto-flips the pump body upside down (intake faces up, pipe ports face down toward ceiling mount). The front monitor and filter service hatch + socket panel do NOT flip: they stay in upright orientation so they remain readable and accessible. Implementation note: model split into body (flips) and a 'service face' module (always upright, rotates only around vertical axis).

## Building rule (user, 2026-10-04)
- Before placing any object, the player sees a HOLOGRAPHIC BLUEPRINT layout (a translucent holographic ghost) of it. It shows the placement spot, the auto-flip for floor vs roof mounts (e.g. gas pump: body flips, monitor and hatch stay upright), port/connection positions and whether the spot is valid. The player confirms to place.
- Blueprint hologram color: valid placement = cyan/teal hologram; invalid placement (blocked, wrong surface, no space) = turns RED and cannot be confirmed.

## PUMP + PIPE MECHANICS (DRAFT v1 for user sign-off, 2026-10-04; shared by gas and liquid)
Numbers are placeholders to tune. Gas first, liquid reuses the same rules.

### Gas pump
- Ports: 1 inlet (intake mesh, whole circumference at the wide end) + outlets on the narrow end. Starts with 1 outlet. Unlockables add outlets 2, 3, 4; flow splits equally (2 = 50% each, 4 = 25% each). Input flow can be upgraded.
- Base flow: X = 1.0 unit/s (placeholder; the gas unit in the prototype is 1 unit = what the player breathes per second).
- Orientation: floor mount (intake low, takes heavy gases like CO2) or roof mount (intake high, takes light gases). Intake samples only the gas layer at its height.
- Power: needs power to run (slice 5: switch ON + powered cable path; 120 W at I1); off or unpowered = no flow.
- Filter: wears with throughput. 100% to 0%. Below 30% flow reduced linearly; at 0% pump stops. Replace via side hatch (cartridge item). Monitor shows power, flow rate, filter wear.
- Control link module (side socket): lets LUCID base control read/set the pump remotely. Slice 8: module = read + on/off from the wall monitor / LUCID panel; setpoints/trim/priority wait for the late-game control chip (authority 'chip').

### Pipes
- Tiers with max flow (gas): Tier 1 = 1.0/s (matches starter pump), Tier 2 = 2.5/s, Tier 3 = 6/s. Pipes are REINFORCED in place (upgrade tier), never replaced.
- Overload: if flow into a pipe segment exceeds its max flow, the segment takes strain (a stress meter). Warning first (hissing, shaking, red hologram/overlay), then BURST after a few seconds: pipe leaks its contents into the room, loses flow until repaired. Repair with the omni tool; reinforce to prevent.
- Flow splits at junctions equally unless a valve limits it.
- Bigger pump on weak pipe is allowed (so the player learns by bursting), but the blueprint hologram warns with an amber 'exceeds pipe rating' tag.
- Pipe connectors: quick-connect couplings on pump ports; pipes snap in the blueprint hologram. Invalid joins show red.

### Liquid side (to design next)
- Same port, split, tier, burst and reinforce rules, liquid units (example: first pump 10 L/hour from the brief). Liquid pipes can also freeze/leak later if needed.

### Pipe overload ratio (user, 2026-10-04; replaces the generic overload/burst rule above)
Overload % = (flow - pipe max flow) / pipe max flow.
- 0% to 20%: safe, no effect.
- 20% to 30%: pipe makes noise and slowly cracks; a small leak starts and GROWS over time if not attended (repair or reinforce to stop).
- Over 30%: pipe breaks faster, in much less time (crack and leak grow quickly).
- Over 75%: pipe BURSTS within a few seconds.
- Exact timers and leak growth rates are placeholders to tune. Leak size scales with damage. Repairing resets the crack; reinforcing raises the pipe tier so the same flow falls back under the limit.

### Pipe load readout (user, 2026-10-04)
- The first pipe segment attached to a pump outlet has a small flow monitor (like the pump's) showing PIPE LOAD % = flow entering that pipe / pipe max flow x 100. 100% = at the limit. Overload % in the ratio rules above = load - 100.
- Worked example: pump 20 L, pipe rated 15 L -> load 133% (33% over, so 'breaks faster' band). Pump 30 L on a 15 L pipe -> 200% (100% over, bursts in seconds).
- Outlet split applies BEFORE the pipe: flow per outlet = pump flow / number of outlets. Each outlet's first pipe has its own load readout.
  - 20 L pump, 15 L pipes: 1 outlet = 20 L -> 133%; 2 outlets = 10 L each -> 67%; 4 outlets = 5 L each -> 33%.
- Load colors on the readout: green up to 100%, amber 100 to 120%, orange 120 to 130%, red over 130%, flashing red over 175%.
- Blueprint hologram previews the predicted load % for the pipe being placed.

### Intake upgrades (user, 2026-10-04)
- The pump intake is upgradeable to draw more L/s (intake tiers). Pump throughput = min(intake rate, pump capacity), then split equally across outlets, so upgrading the intake raises pipe load % on every outlet pipe. Pipes must be reinforced to keep up. Monitor flow and the pipe load readouts and blueprint preview update with the intake tier. Placeholder tiers: I1 = 1x, I2 = 2x, I3 = 4x of base flow.
- Worked example: base 10 L intake, upgraded to 20 L, 1 outlet into a 15 L pipe = 133% load. Add a 2nd outlet: 10 L each = 67%.

### Upgrade acquisition (user, 2026-10-04)
- Better intakes (and other pump/pipe upgrades) are found by exploring the outside world and other ARKS, then made craftable. Scanning found items/tech with the omni tool gives LUCID better ideas: he delivers improved blueprints (intake tiers, extra outlets, pipe reinforcement tiers). Progression gate = exploration + scanning, not a menu unlock.
- Scanning rule (user, 2026-10-04): scanning an item ONCE permanently unlocks its blueprint in the crafting table (workbench). No need to find the part again; crafting needs the materials only.

## Upgrade philosophy (user, 2026-10-04)
- ALL objects and equipment (crafting table, pumps, filters, everything) are upgradable, but NOT by swapping to a new model or just raising a number. Upgrades are VISIBLE ADD-ONS physically attached to the same object, so the object grows and tells its own history.
- Crafting table example: T1 = bare table with pliers and a hammer. T2 adds a vice. T3 adds a bench drill. T4 adds a turntable. Each tier unlocks more craftable blueprints.
- Applies to the gas pump too: intake tiers, extra outlets and the control link visibly bolt onto the same cone (e.g. extra outlet stubs on top, a bigger intake ring, the wifi module in the side socket). Pipes are reinforced with visible collars/bands rather than replaced.
- Art/engine implication: each object is a base mesh plus tier-keyed attachment sockets; the blueprint hologram shows the upgrade add-on before it is attached.
- Crafting table: more tools can be added along the tier progression (beyond pliers/hammer, vice, bench drill, turntable). Each tier can add multiple visible tools/add-ons; tier list is open-ended, to be extended by the user.

## Build menu tier dropdown (user, 2026-10-04)
- Each buildable object has a tier dropdown in the build menu, listing tier 1 up to tier 5 (the max tier of that object). Tiers the player has not unlocked yet are shown locked/greyed (name and silhouette visible, requirement hint), unlocked tiers can be selected and crafted directly.
- Player can place a new object at any unlocked tier, with all lower-tier add-ons included (the object arrives already grown), and the holographic blueprint previews the chosen tier.
- Existing placed objects can be upgraded in place by adding the next tier's add-ons.
- Max tier per object is 5 (crafting table so far: T1 pliers/hammer, T2 vice, T3 bench drill, T4 turntable, T5 open; lathe and more tools to be assigned).
- Crafting table tiers (confirmed 2026-10-04): T1 pliers + hammer, T2 vice, T3 bench drill, T4 turntable (rotating platform for assembly, welding, inspection, finishing, e.g. pump bodies), T5 lathe (precision round parts: couplings, pump parts, pipe reinforcement collars). More tools can be added per tier later.

## Feel / pacing (user, 2026-10-05)
- Realism over arcade: the game should often FEEL fine until it suddenly isn't. Quiet degradation (slow CO2 rise, filter wear, stress on pipes under 20–30% overload) so the player thinks everything is okay, then a cascade when multiple systems tip at once ("shit hits the fan"). Warnings exist but can be ignored or missed; sudden crises come from neglect, not random events.

## FINALIZE PLAN (2026-10-23, from v3.1.1)
Audit of every 'Placeholders / not yet' note plus a playthrough path new game → shelter → LUCID → crew → expansion → ARKs. Systems exist for each step, but the game has no thread through them and no end.
- **Gaps (must do):**
  1. No objective chain after FIND SHELTER, so the player is left with no tutorial. Add a step chain: shelter → wake LUCID → keep the plant alive → place a pump → reach ARK-01 → collar a survivor → reach ARK-02 → reach ARK-03 → power home → **Breathing Room** (hold the base: live ARK-03 feed, 2+ crew, air good for 5 min). Steps the player already did are skipped silently, so old saves slot in. One short how-to toast per step. The strip can be hidden, because warnings stay missable.
  2. **Win and ending:** a BREATHING ROOM ending card with stats (time, crew, ARKs, crises survived) and a *Keep playing* option, so the sandbox continues. Saved as flags.
  3. **Settings** (title and pause card): mouse sensitivity, invert Y, FOV, master / effects / ambience volume, objective strip on/off, graphics quality **High (default = today's look) / Ultra / Ultra+**. The quality options only go up: higher pixel-ratio cap and supersampling, sharper shadows and anisotropy. Nothing is ever lowered. Saved in localStorage.
  4. **Audio polish:** a master bus for all sounds, so volume works. Suit breathing that speeds up when the suit or room air runs low (a missable warning). The room hum gets muffled as O2 drops.
  5. **Save robustness:** save on tab hide and page close (`pagehide` / `visibilitychange`), plus export and import of the save as text from Settings.
  6. **Remove the auto-laid sump hose:** a new *sump hose reel* craft. The sump stalls on NO HOSE until you lay the hose ([E] with a reel), and you can see the hose run from the sump to the base intake. Old saves and tests keep their sumps hosed.
  7. **Performance (no visual loss):** skip rendering when the tab is hidden, and throttle label declutter to 20 Hz (same visuals).
- **Bugs found:** slice33 C (dock walk) and D (far relapse) are flaky because they depend on random wander, so the full selftest went red about 1 run in 2. These are test-setup fixes, not game changes.
- **Out of scope / stays open:** digging that breaches base walls, cave-ins, legs for the torso that walk, wireless range, real pathing for survivors between sealed zones, fuller production cutscenes.

### Build log — v3.2 (slice 34, 2026-10-23): objective chain + BREATHING ROOM ending
- 10-step state-driven chain (shelter → wake Lucid → water plant → build → ARK-01 → collar a survivor → ARK-02 → ARK-03 → ARK-03 feed live → BREATHING ROOM). HUD strip shows step + hint; toast on advance. Old saves skip completed steps silently.
- Final hold: 300 s with feed live, 2+ live-collared crew, O2 ≥ 19 %, CO2 < 2 %. A lapse bleeds the timer back at 2x (not a hard reset). Win card shows stats (time, crew, arks, crises, relapses) with Keep playing / New game, plus an autosave.
- Chain runs only in real play (not selftest/SHOT/preview), so the old fixtures don't change.
- Tests: new slice34 (advance, silent legacy skip, hold+win once, bleed). Fixed flaky slice33 C (sv placed at dock) and D (a comment had swallowed `g.rng = () => rngV`, so relapse mood was random; far player moved to -9,0,9). slice33 I/J version regexes now accept 3.x.
- New CDP runner play/run_selftest.mjs (port 8766, temp profile, ~15 s). selftest.sh dump-dom path is deprecated (times out).
- Not yet: SETTINGS object exists but is not wired to the UI, audio or renderer (slice 35). AUDIO.chord is called optionally and doesn't exist yet.

### Build log — v3.3 (slice 35, 2026-10-23): settings, audio buses, save-on-hide, export/import
- Settings card, opened from the title (Settings under Continue/New) and the pause card. Options: mouse sensitivity, invert Y, FOV 60-100, master/effects/ambience volume, objective strip, and graphics quality. Quality is High (old default, DPR≤2), Ultra (1.25x, ≤2.5) or Ultra+ (1.5x, ≤3) and only goes up. Settings persist in `breathless_settings_v1`.
- AUDIO: every voice now goes through sfx/amb buses into a master gain instead of `c.destination`. Added `AUDIO.chord()` for the win screen.
- Saves on `visibilitychange` (hidden) in addition to pagehide. Export downloads the raw save string. Import validates it with saveDecode, keeps the old save as prev, then reloads. A bad file leaves the current save untouched.
- Tests: new slice35 (quality monotonic, sens/invert reach mouse look, FOV apply+restore, audio buses + chord).
- Not yet: breathing/muffled-hum audio layers, sump hose reel (the HOME/FUEL umbilical is still pre-laid), declutter throttle.
- Shots: play/run_shots.mjs (CDP, port 8766). New shot modes s34_win and s35_settings. Final shots are play/final_*.png.
