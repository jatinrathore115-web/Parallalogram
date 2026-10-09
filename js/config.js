// =====================================================================
// CONFIG — tuning values for the board, snapping, pacing and limits.
// =====================================================================
const CONFIG = {
  pxPerCm: 60,                       // board scale: 1 cm = 60 board px
  // opening shape: the storyboard's symmetric trapezium (pages 1-8): CD 6 cm, both legs 3 cm, base angles 70°, centred in
  // the panel. Dragging B until BC ∥ AD makes the parallelogram of the storyboard: AB = CD = 6 cm, AD = BC = 3 cm,
  // ∠A = ∠C = 110°, ∠B = ∠D = 70°
  start: { D: 40, C: 400, baseY: 322, height: 180 * Math.sin(70 * Math.PI / 180), legAD: 3, legBC: 3 },
  // keeps the shape readable (angles ~35°–145°); maxTopX = how far right B may go (a parallelogram leans past C)
  limits: { minTop: 90, minBottom: 160, maxLegRun: 243, minX: 16, maxX: 478, maxTopX: 496 },
  snap: { equalLegsCm: 0.3, rightAngleDeg: 5, parallelPx: 16 },
  // recorded sound effects (others are synthesised): 'good' = every correct action (with the confetti), 'bad' = every wrong one
  sounds: { good: 'assets/audio/correct.mp3', bad: 'assets/audio/incorrect.mp3' },
  soundVolume: 0.9,
  drag: { wrongGapMs: 1200 },        // wrong-way drag feedback (wiggle + incorrect sound): at most once per this long
  // a part named in the voice-over grows (CSS .emph, ~0.3 s in / 0.3 s out) and holds this long before easing back
  emph: { holdMs: 650 },
  // diagonals: the glowing pen draws each diagonal at this speed (px/ms), with a short pause between them
  diag: { pxPerMs: 0.35, gapMs: 300 },
  // screen 4 leg trace: one speed (px/ms) for the glowing line and the dotted extension on both legs; pause before C->B
  trace: { pxPerMs: 0.4, gapMs: 250 },
  // screen 1 build: pen speed round the outline, start delay after the screen opens (≈ voice start), outline glow time.
  // (Entrance timings for the side numbers, corner letters and shape assembly live with their GSAP timelines in js/motion.js)
  // screen 1: the pen starts with the voice and takes ofLine of the spoken line (minMs..maxMs), so the outline closes as
  // Swiftee finishes and the fill fades in on her last word; delayMs + 2.5 s = start anyway if no voice begins
  build: { pxPerMs: 0.36, delayMs: 450, settleMs: 1300, ofLine: 0.85, minMs: 1600, maxMs: 3600, rushMs: 450 },
  // screen 3 corner letters: never land closer together than this, so A -> B -> C -> D keeps its rhythm
  letters: { minGapMs: 420 },
  // qFocus check screens: the question shape starts alone in the centre of the right-hand ice panel (cx, shapeTop0;
  // panel 512..1240 x 104..584). The bubble holds holdMs after the voice and fades (fadeMs); the shape then glides up
  // to shapeTop to make room and the answers stagger in under it.
  // Shape drawing spans ~y 26..222 of its 500x230 box; answers sit 24 px under it.
  qFocus: { holdMs: 700, fadeMs: 350, cx: 876, shapeTop0: 220, shapeTop: 171, optTop: 417, optW: 560 },
  ruler: { home: { gap: 80, a: 0 } /* level, centred under DC, gap px below it */, flyMs: 600, holdMs: 700, returnMs: 450 },
  timing: { idleMs: 9000, idleMaxHints: 3, navLockMs: 450 },
  // flow: a finished screen moves on advanceMs after its last line (voice-over) ends. showNext / showBack bring those buttons back.
  // autoAdvance: false = navigation is fully manual (top-right Next / Back only; a finished screen stays put)
  // (explanation screens move on by themselves; a question or task waits for the learner, then moves on after its feedback)
  flow: { autoAdvance: true, advanceMs: 1600, showNext: false, showBack: false },
  // the supplementary-angle demo: the copied angle slides from its own corner onto the shared side (CSS .supp)
  supp: { stepMs: 2600 },
  // spotlight screen: board moved/scaled from its usual spot (transform-origin = board top-left at 640,104).
  // Puts the shape (board centre ~260,228) at stage (560,358): mid-height, balanced against Swiftee on the right.
  // scene layout (screens 1-30): board nudged so the shape is centred in the right-hand panel; card row under it
  scene: { boardX: 11, chipTop: 476, chipLeft: 616 },
  // 'top' layout: board scaled and moved so the shape (board centre ~225,242) sits at stage (640,410)
  topLayout: { scale: 1.15, tx: -259, ty: 28 },
  spotlight: { scale: 1.35, tx: -431, ty: -54 },
  // focus screen (extend the legs): after the line, the bubble holds holdMs, fades (fadeMs), then the board glides
  // to centre stage (moveMs) and the hand appears after handMs with no touch. Board centre ~(260,240) -> stage (750,358):
  // the middle of the free space between Swiftee (right edge ~350) and the panel's inner edge (~1150), so D clears Swiftee.
  focus: { holdMs: 3000, fadeMs: 350, moveMs: 700, handMs: 5000, scale: 1.25, tx: -215, ty: -46 },
  // screen 13 measuring trip: walker size on the shape, home feet point/size (matches the scene layout), timings
  walker: { size: 110, homeX: 199, homeY: 639, homeSize: 259, flyMs: 1100, msPerCm: 380, pauseMs: 550,
    tips: [[488, 272], [484, 281], [494, 273], [489, 270], [486, 278], [483, 279], [491, 281], [489, 281]] }, // tape exit per walk frame (@2x cell px)
  hand: { idleMs: 8000, showMs: 4400, maxShows: 4, // hand nudge: wait with no touch, time on screen, showings per step
    onceDelayMs: 500, onceMs: 2300 },                 // handOnce screens: a single demo gesture this long after the line ends
  stars: [[8, 3], [5, 2], [0, 1]],   // [checkpoint challenges right on the first try >=, stars] (9 challenges)
  // Swiftee's expressions (state names from swiftee-assets/atlas/swiftee.manifest.json).
  // A narration line's own m wins; these cover reactions and the pose held between lines.
  swiftee: {
    base: 'swiftee-assets/',
    talk: 'talking',       // default while a line is spoken
    idle: 'blinking',      // between lines and while the learner works on a task
    waiting: 'thinking',   // a check question is open: thinking time
    praise: 'happy',       // a task is completed
    correct: 'celebrating',// a check is answered correctly
    wrong: 'confused',     // a wrong answer or tap: encouraging, never punishing
    nudge: 'curious',      // idle hint
    done: 'happy',         // the lesson-complete screen, after the closing line
    reactMs: 1600,         // how long the line's expression shows after speaking (lip-sync talks during the voice)
    minHoldMs: 900
  }
};
