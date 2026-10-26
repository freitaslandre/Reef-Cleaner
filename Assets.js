/**
 * Assets.js — Procedural graphics library for "Reef Cleaner"
 * Theme: Coral Reef Restoration
 *
 * All assets are drawn with P5.js primitives (no external images).
 * Every function is wrapped in push()/pop() and positioned via translate(x, y).
 *
 * Public API:
 *   drawSunkenShipwreck(x, y)
 *   drawGoldCoin(x, y, radius)
 *   drawCoralHealthy(x, y, size, type)      // 1 brain, 2 staghorn, 3 fan
 *   drawCoralBleached(x, y, size, type)
 *   drawFish(x, y, size, direction, species) // 1 clownfish, 2 blue tang, 3 yellow tang
 *   drawShell(x, y, size)
 *   drawCleanerNozzle(x, y, size, isActive)
 */

/* ------------------------------------------------------------------ */
/* Internal helpers (prefixed with _ to avoid clashing with game code) */
/* ------------------------------------------------------------------ */

// Soft radial glow using the native canvas context (does not touch p5 state).
function _glow(x, y, r, rgbaInner, rgbaOuter) {
  const ctx = drawingContext;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgbaInner);
  g.addColorStop(1, rgbaOuter);
  ctx.save();
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Deterministic pseudo-random so assets don't flicker between frames.
function _seeded(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// Draws a leaf-like blade (used for seaweed) hanging or growing.
function _seaweedBlade(x, y, len, sway, col, colDark) {
  noStroke();
  fill(col);
  beginShape();
  vertex(x - 3, y);
  bezierVertex(x - 8 + sway, y + len * 0.3, x + 6 + sway, y + len * 0.6, x + sway * 1.4, y + len);
  bezierVertex(x + 10 + sway, y + len * 0.6, x - 2 + sway, y + len * 0.3, x + 3, y);
  endShape(CLOSE);
  stroke(colDark);
  strokeWeight(1);
  noFill();
  bezier(x, y, x - 2 + sway, y + len * 0.3, x + 2 + sway, y + len * 0.6, x + sway * 1.4, y + len);
}

/* ------------------------------------------------------------------ */
/* 1. Sunken Shipwreck                                                 */
/* ------------------------------------------------------------------ */

function drawSunkenShipwreck(x, y) {
  push();
  translate(x, y);

  // Soft contact shadow on the seabed
  noStroke();
  fill(0, 0, 0, 55);
  ellipse(10, 6, 330, 36);

  // ---- Broken rear mast (behind the hull) ----
  push();
  rotate(-0.14);
  stroke(70, 42, 22);
  strokeWeight(1.5);
  fill(112, 70, 38);
  rect(-62, -230, 12, 190, 3);
  // wood grain
  stroke(80, 48, 26, 150);
  line(-58, -225, -58, -50);
  // torn crossbeam
  push();
  translate(-56, -190);
  rotate(0.12);
  fill(124, 80, 44);
  stroke(70, 42, 22);
  rect(-48, -5, 96, 9, 3);
  pop();
  // tattered sail
  noStroke();
  fill(235, 225, 200, 190);
  beginShape();
  vertex(-100, -186);
  bezierVertex(-88, -160, -108, -140, -92, -112);
  vertex(-72, -118);
  bezierVertex(-80, -140, -72, -165, -66, -186);
  endShape(CLOSE);
  fill(180, 165, 135, 160);
  triangle(-100, -112, -92, -112, -96, -92);
  pop();

  // ---- Front broken mast (snapped short) ----
  push();
  translate(70, -70);
  rotate(0.28);
  stroke(70, 42, 22);
  strokeWeight(1.5);
  fill(120, 76, 42);
  beginShape();
  vertex(-7, 40);
  vertex(-7, -60);
  vertex(-3, -72);
  vertex(0, -58);
  vertex(4, -78);
  vertex(7, -56);
  vertex(7, 40);
  endShape(CLOSE);
  pop();

  // ---- Hull (tilted slightly) ----
  push();
  rotate(-0.06);

  // Main hull body
  stroke(60, 34, 18);
  strokeWeight(2.5);
  fill(128, 80, 44);
  beginShape();
  vertex(-150, -60);
  bezierVertex(-160, -20, -120, 10, -70, 14);
  vertex(80, 14);
  bezierVertex(140, 8, 170, -30, 178, -78);
  vertex(150, -70);
  vertex(-120, -70);
  endShape(CLOSE);

  // Plank rows
  noFill();
  stroke(72, 42, 22, 200);
  strokeWeight(1.6);
  for (let i = 0; i < 4; i++) {
    const py = -52 + i * 17;
    beginShape();
    vertex(-146 + i * 8, py);
    bezierVertex(-80, py + 5, 60, py + 5, 172 - i * 8, py - 6);
    endShape();
  }
  // Plank gaps (vertical seams, deterministic)
  strokeWeight(1);
  for (let i = 0; i < 14; i++) {
    const px = -130 + i * 21;
    const r = _seeded(i + 3);
    line(px, -62 + r * 6, px + 3, 8 - r * 8);
  }

  // Lighter wood highlights
  stroke(176, 118, 68, 140);
  strokeWeight(2);
  for (let i = 0; i < 4; i++) {
    const py = -56 + i * 17;
    line(-100 + i * 12, py, -40 + i * 12, py + 2);
  }

  // Broken hole in the hull
  noStroke();
  fill(34, 18, 12);
  beginShape();
  vertex(10, -48);
  vertex(34, -56);
  vertex(52, -38);
  vertex(46, -18);
  vertex(24, -10);
  vertex(6, -24);
  endShape(CLOSE);
  // jagged splinters around hole
  fill(150, 96, 52);
  triangle(10, -48, 20, -46, 12, -58);
  triangle(52, -38, 46, -46, 58, -48);
  triangle(24, -10, 32, -14, 28, -2);

  // Gold rim / railing
  stroke(200, 150, 40);
  strokeWeight(4);
  noFill();
  beginShape();
  vertex(-150, -62);
  vertex(-120, -72);
  vertex(150, -72);
  vertex(178, -80);
  endShape();

  // Portholes
  for (let i = 0; i < 3; i++) {
    const cx = -90 + i * 55;
    stroke(70, 42, 22);
    strokeWeight(2.5);
    fill(250, 200, 70, 230);
    ellipse(cx, -32, 20, 20);
    noStroke();
    fill(255, 245, 190, 200);
    ellipse(cx - 3, -35, 7, 7);
  }

  // Stern cabin (back, left)
  stroke(60, 34, 18);
  strokeWeight(2);
  fill(112, 70, 38);
  rect(-150, -104, 54, 40, 4);
  fill(86, 52, 28);
  rect(-142, -96, 14, 16, 2);
  fill(86, 52, 28);
  rect(-120, -96, 14, 16, 2);
  pop();

  // ---- Anchor chain / rope bits ----
  stroke(60, 66, 76);
  strokeWeight(3);
  noFill();
  for (let i = 0; i < 6; i++) {
    ellipse(178 + i * 2, -48 + i * 9, 7, 11);
  }

  // ---- Seaweed hanging off the hull and mast ----
  const weedCol = color(46, 178, 92, 235);
  const weedDark = color(24, 120, 66);
  _seaweedBlade(-30, -66, 60, -6, weedCol, weedDark);
  _seaweedBlade(-18, -66, 46, 5, weedCol, weedDark);
  _seaweedBlade(110, -70, 54, 7, weedCol, weedDark);
  _seaweedBlade(126, -70, 40, -5, weedCol, weedDark);
  _seaweedBlade(-90, -70, 38, 4, weedCol, weedDark);

  // Seaweed growing from the sand
  for (let i = 0; i < 5; i++) {
    const wx = -170 + i * 9;
    _seaweedBlade(wx, 8, -55 - i * 6, (i % 2 ? 6 : -6), weedCol, weedDark);
  }
  for (let i = 0; i < 4; i++) {
    const wx = 190 + i * 9;
    _seaweedBlade(wx, 8, -46 - i * 7, (i % 2 ? -6 : 6), weedCol, weedDark);
  }

 // ---- Treasure chest on the deck ----
  push();
  translate(-35, -62); // Posiciona o baú de tesouro em cima do convés principal do navio
  scale(0.85);          // Ajusta a escala para encaixar no navio

  // Golden glow behind chest
  _glow(0, -22, 62, "rgba(255, 220, 90, 0.55)", "rgba(255, 220, 90, 0)");

  // Spilled coins
  noStroke();
  for (let i = 0; i < 7; i++) {
    const cx = 18 + i * 6 + _seeded(i) * 6;
    const cy = 2 - _seeded(i + 9) * 6;
    fill(255, 200, 40);
    ellipse(cx, cy, 10, 6);
    fill(255, 238, 140);
    ellipse(cx - 1, cy - 1, 5, 2.5);
  }

  // Chest body
  stroke(70, 40, 18);
  strokeWeight(2.5);
  fill(150, 92, 46);
  rect(-30, -26, 60, 28, 3);
  // Lid (arched, open slightly)
  fill(168, 106, 54);
  beginShape();
  vertex(-30, -26);
  bezierVertex(-30, -52, 30, -52, 30, -26);
  endShape(CLOSE);
  // Gold glimmering inside gap
  noStroke();
  fill(255, 216, 70);
  beginShape();
  vertex(-26, -26);
  bezierVertex(-14, -34, 14, -34, 26, -26);
  endShape(CLOSE);
  fill(255, 246, 170);
  ellipse(-8, -29, 10, 3);
  ellipse(10, -28, 7, 2.5);
  // Metal bands
  stroke(255, 196, 40);
  strokeWeight(4);
  line(-16, -26, -16, 2);
  line(16, -26, 16, 2);
  noFill();
  stroke(255, 196, 40);
  strokeWeight(3);
  bezier(-16, -26, -16, -46, 16, -46, 16, -26);
  // Lock
  noStroke();
  fill(255, 214, 64);
  rect(-5, -16, 10, 12, 2);
  fill(70, 40, 18);
  ellipse(0, -11, 4, 4);
  rect(-1, -11, 2, 5);

  // Sparkles
  stroke(255, 255, 220, 230);
  strokeWeight(1.6);
  line(-34, -50, -34, -42); line(-38, -46, -30, -46);
  line(34, -56, 34, -50);   line(31, -53, 37, -53);
  pop();

  pop();
}

/* ------------------------------------------------------------------ */
/* 2. Gold Coin                                                        */
/* ------------------------------------------------------------------ */

function drawGoldCoin(x, y, radius) {
  push();
  translate(x, y);
  const r = radius;

  // Soft outer glow
  _glow(0, 0, r * 1.7, "rgba(255, 214, 80, 0.35)", "rgba(255, 214, 80, 0)");

  // Drop shadow
  noStroke();
  fill(0, 0, 0, 40);
  ellipse(r * 0.08, r * 0.12, r * 2.05, r * 2.05);

  // Outer rim (dark gold)
  stroke(176, 112, 10);
  strokeWeight(max(1, r * 0.08));
  fill(224, 158, 22);
  circle(0, 0, r * 2);

  // Radial gradient face
  const ctx = drawingContext;
  const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.05, 0, 0, r * 0.95);
  g.addColorStop(0, "#FFF6B0");
  g.addColorStop(0.45, "#FFD43B");
  g.addColorStop(1, "#E39A12");
  ctx.save();
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Inner embossed ring
  noFill();
  stroke(190, 124, 14, 220);
  strokeWeight(max(1, r * 0.06));
  circle(0, 0, r * 1.5);

  // Dotted edge detail
  noStroke();
  fill(255, 236, 150, 210);
  for (let i = 0; i < 16; i++) {
    const a = (TWO_PI / 16) * i;
    circle(cos(a) * r * 0.93, sin(a) * r * 0.93, max(1, r * 0.06));
  }

  // Embossed star at the core
  push();
  rotate(-HALF_PI);
  noStroke();
  fill(176, 108, 8, 230);
  beginShape();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r * 0.46 : r * 0.19;
    const a = (TWO_PI / 10) * i;
    vertex(cos(a) * rad, sin(a) * rad);
  }
  endShape(CLOSE);
  // highlight star offset for emboss effect
  translate(-r * 0.04, -r * 0.04);
  fill(255, 240, 150, 240);
  beginShape();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r * 0.4 : r * 0.16;
    const a = (TWO_PI / 10) * i;
    vertex(cos(a) * rad, sin(a) * rad);
  }
  endShape(CLOSE);
  pop();

  // Metallic specular streak
  noStroke();
  fill(255, 255, 255, 170);
  push();
  rotate(-QUARTER_PI);
  ellipse(-r * 0.1, -r * 0.62, r * 0.7, r * 0.16);
  pop();

  // Tiny sparkle
  stroke(255, 255, 255, 230);
  strokeWeight(max(1, r * 0.07));
  line(r * 0.5, -r * 0.55, r * 0.5, -r * 0.3);
  line(r * 0.38, -r * 0.43, r * 0.62, -r * 0.43);

  pop();
}

/* ------------------------------------------------------------------ */
/* 3. Healthy Coral                                                   */
/* ------------------------------------------------------------------ */

function drawCoralHealthy(x, y, size, type) {
  push();
  translate(x, y);
  // Aumentado o fator de escala (multiplicado por 2.2 para dar mais do dobro do tamanho)
  scale((size * 2.2) / 100);
  _coralBody(type, {
    base: color(255, 90, 160),
    light: color(255, 160, 205),
    dark: color(200, 40, 120),
    accent: color(255, 235, 245),
    healthy: true
  }, {
    1: { base: color(255, 90, 160), light: color(255, 165, 210), dark: color(196, 36, 116) },
    2: { base: color(255, 138, 30), light: color(255, 190, 90), dark: color(220, 90, 10) },
    3: { base: color(170, 80, 230), light: color(214, 150, 255), dark: color(110, 40, 170) }
  });
  pop();
}

/* ------------------------------------------------------------------ */
/* 4. Bleached Coral                                                  */
/* ------------------------------------------------------------------ */

function drawCoralBleached(x, y, size, type) {
  push();
  translate(x, y);
  // Aumentado o fator de escala (multiplicado por 2.2 para coincidir com o saudável)
  scale((size * 2.2) / 100);
  const bleached = {
    base: color(212, 210, 200),
    light: color(240, 238, 230),
    dark: color(150, 148, 142)
  };
  _coralBody(type, { healthy: false }, { 1: bleached, 2: bleached, 3: bleached });
  pop();
}

/**
 * Shared coral renderer. Drawn in a 100-unit design space with the base at (0,0)
 * and the coral growing upward (negative y). Called inside push/pop by callers.
 */
function _coralBody(type, opts, palettes) {
  const t = [1, 2, 3].includes(type) ? type : 1;
  const pal = palettes[t];
  const healthy = opts.healthy;

  // Shadow on sand
  noStroke();
  fill(0, 0, 0, healthy ? 45 : 30);
  ellipse(0, 2, 96, 14);

  if (t === 1) {
    // ---------- Brain coral ----------
    // Rocky base
    stroke(red(pal.dark), green(pal.dark), blue(pal.dark), 200);
    strokeWeight(2);
    fill(pal.dark);
    ellipse(0, -4, 84, 18);

    // Dome
    stroke(pal.dark);
    strokeWeight(2.5);
    fill(pal.base);
    beginShape();
    vertex(-46, -6);
    bezierVertex(-52, -50, -22, -78, 0, -78);
    bezierVertex(22, -78, 52, -50, 46, -6);
    bezierVertex(20, 2, -20, 2, -46, -6);
    endShape(CLOSE);

    // Dome shading (lighter top-left)
    noStroke();
    fill(red(pal.light), green(pal.light), blue(pal.light), 170);
    beginShape();
    vertex(-36, -30);
    bezierVertex(-40, -58, -20, -72, -2, -72);
    bezierVertex(-16, -60, -26, -46, -30, -26);
    endShape(CLOSE);

    // Brain grooves (wavy meandering lines)
    noFill();
    stroke(pal.dark);
    strokeWeight(2.4);
    strokeCap(ROUND);
    for (let row = 0; row < 5; row++) {
      const gy = -16 - row * 12;
      const half = 40 - row * 6.5 - (row === 4 ? 6 : 0);
      beginShape();
      for (let i = 0; i <= 14; i++) {
        const px = map(i, 0, 14, -half, half);
        const py = gy + sin(i * 1.15 + row * 1.7) * 3.4;
        curveVertex(px, py);
      }
      endShape();
    }
    // Ridge highlights
    stroke(red(pal.light), green(pal.light), blue(pal.light), 210);
    strokeWeight(1.4);
    for (let row = 0; row < 4; row++) {
      const gy = -21 - row * 12;
      const half = 32 - row * 6;
      beginShape();
      for (let i = 0; i <= 10; i++) {
        const px = map(i, 0, 10, -half, half);
        const py = gy + sin(i * 1.15 + row * 1.7 + 0.6) * 3;
        curveVertex(px, py);
      }
      endShape();
    }
    // Shine
    noStroke();
    fill(255, 255, 255, healthy ? 120 : 70);
    ellipse(-20, -58, 14, 7);

  } else if (t === 2) {
    // ---------- Staghorn / branching coral ----------
    // Recursive branch function
    const branch = (bx, by, len, ang, w, depth) => {
      const ex = bx + sin(ang) * len;
      const ey = by - cos(ang) * len;
      // branch body
      stroke(pal.dark);
      strokeWeight(w + 2.5);
      line(bx, by, ex, ey);
      stroke(pal.base);
      strokeWeight(w);
      line(bx, by, ex, ey);
      // highlight
      stroke(red(pal.light), green(pal.light), blue(pal.light), 190);
      strokeWeight(max(1, w * 0.3));
      line(bx - 1, by, ex - 1, ey);
      if (depth > 0) {
        branch(ex, ey, len * 0.7, ang - 0.55, w * 0.72, depth - 1);
        branch(ex, ey, len * 0.7, ang + 0.5, w * 0.72, depth - 1);
        if (depth > 1) branch(ex, ey, len * 0.62, ang + 0.05, w * 0.7, depth - 1);
      } else {
        // glowing tip
        noStroke();
        fill(healthy ? color(255, 232, 150) : color(246, 244, 236));
        circle(ex, ey, w * 1.35);
      }
    };
    strokeCap(ROUND);

    // Base mound
    stroke(pal.dark);
    strokeWeight(2);
    fill(pal.dark);
    ellipse(0, -3, 60, 14);

    branch(-12, -4, 30, -0.35, 9, 3);
    branch(12, -4, 30, 0.35, 9, 3);
    branch(0, -4, 36, 0.0, 10, 3);

  } else {
    // ---------- Fan coral ----------
    // Stalk
    stroke(pal.dark);
    strokeWeight(2.5);
    fill(pal.base);
    rect(-4, -26, 8, 28, 3);
    ellipse(0, -2, 26, 10);

    // Fan blade shape
    stroke(pal.dark);
    strokeWeight(2.5);
    fill(red(pal.base), green(pal.base), blue(pal.base), 235);
    beginShape();
    vertex(-4, -24);
    bezierVertex(-58, -34, -62, -84, -34, -96);
    bezierVertex(-14, -104, 14, -104, 34, -96);
    bezierVertex(62, -84, 58, -34, 4, -24);
    endShape(CLOSE);

    // Lighter inner glow
    noStroke();
    fill(red(pal.light), green(pal.light), blue(pal.light), 150);
    beginShape();
    vertex(0, -30);
    bezierVertex(-36, -40, -40, -80, -20, -90);
    bezierVertex(-6, -96, 10, -96, 22, -90);
    bezierVertex(42, -80, 36, -40, 0, -30);
    endShape(CLOSE);

    // Radiating veins
    stroke(pal.dark);
    strokeWeight(1.5);
    noFill();
    for (let i = 0; i < 9; i++) {
      const a = map(i, 0, 8, -1.05, 1.05);
      const ex = sin(a) * 52;
      const ey = -26 - cos(a) * 66;
      bezier(0, -26, sin(a) * 14, -42, ex * 0.8, ey + 14, ex, ey);
    }
    // Cross-hatch veins
    stroke(red(pal.light), green(pal.light), blue(pal.light), 200);
    strokeWeight(1);
    for (let r = 0; r < 3; r++) {
      const ry = -48 - r * 17;
      const hw = 34 - r * 7;
      bezier(-hw, ry, -hw / 2, ry - 6, hw / 2, ry - 6, hw, ry);
    }
    // Edge dots
    noStroke();
    fill(healthy ? color(255, 235, 255) : color(245, 243, 236));
    for (let i = 0; i < 11; i++) {
      const a = map(i, 0, 10, -1.1, 1.1);
      circle(sin(a) * 50, -28 - cos(a) * 66, 4);
    }
  }

  // Bleached overlay: cracks, dull chalky look, algae spots
  if (!healthy) {
    noStroke();
    fill(255, 255, 255, 70);
    ellipse(0, -36, 70, 56);
    // Greyish algae/dirt specks (deterministic)
    for (let i = 0; i < 12; i++) {
      const px = (_seeded(i + 1) - 0.5) * 70;
      const py = -8 - _seeded(i + 21) * 60;
      fill(110, 120, 96, 110);
      circle(px, py, 2 + _seeded(i + 41) * 4);
    }
    // Hairline cracks
    stroke(120, 116, 108, 150);
    strokeWeight(1);
    noFill();
    line(-10, -20, -4, -34);
    line(-4, -34, -12, -44);
    line(14, -16, 20, -30);
    line(20, -30, 14, -40);
  }
}

/* ------------------------------------------------------------------ */
/* 5. Fish                                                             */
/* ------------------------------------------------------------------ */

function drawFish(x, y, size, direction, species) {
  push();
  translate(x, y);
  const dir = direction < 0 ? -1 : 1;
  scale(dir * size / 100, size / 100);

  // Design space: ~120 wide, ~70 tall, centered at origin, nose toward +x.
  const sp = [1, 2, 3].includes(species) ? species : 1;
  strokeJoin(ROUND);
  strokeCap(ROUND);

  // Gentle shadow
  noStroke();
  fill(0, 0, 0, 22);
  ellipse(4, 38, 90, 10);

  if (sp === 1) {
    // ================= CLOWNFISH =================
    const orange = color(255, 128, 20);
    const orangeDark = color(214, 80, 6);
    const orangeLight = color(255, 180, 80);
    const outline = color(26, 20, 20);

    // Tail fin
    stroke(outline);
    strokeWeight(3);
    fill(orange);
    beginShape();
    vertex(-38, 0);
    bezierVertex(-58, -22, -70, -26, -66, -8);
    bezierVertex(-62, 0, -62, 0, -66, 8);
    bezierVertex(-70, 26, -58, 22, -38, 0);
    endShape(CLOSE);

    // Dorsal fin
    fill(orangeDark);
    beginShape();
    vertex(-16, -26);
    bezierVertex(-10, -48, 16, -50, 28, -24);
    bezierVertex(10, -30, -4, -30, -16, -26);
    endShape(CLOSE);

    // Body
    fill(orange);
    beginShape();
    vertex(-42, 0);
    bezierVertex(-34, -34, 30, -42, 52, -6);
    bezierVertex(56, 4, 54, 6, 48, 12);
    bezierVertex(26, 38, -32, 34, -42, 0);
    endShape(CLOSE);

    // White stripes with black outline (clipped to body using canvas clip)
    drawingContext.save();
    beginShape();
    vertex(-42, 0);
    bezierVertex(-34, -34, 30, -42, 52, -6);
    bezierVertex(56, 4, 54, 6, 48, 12);
    bezierVertex(26, 38, -32, 34, -42, 0);
    endShape(CLOSE);
    // Clip region from last path
    drawingContext.restore();

    // Stripe 1 (head)
    stroke(outline);
    strokeWeight(3);
    fill(255);
    beginShape();
    vertex(20, -36);
    bezierVertex(30, -22, 30, 10, 20, 28);
    bezierVertex(12, 28, 8, 26, 4, 24);
    bezierVertex(14, 8, 14, -18, 8, -36);
    bezierVertex(12, -38, 16, -38, 20, -36);
    endShape(CLOSE);
    // Stripe 2 (mid-body)
    beginShape();
    vertex(-14, -33);
    bezierVertex(-8, -20, -8, 14, -14, 30);
    bezierVertex(-20, 30, -24, 28, -26, 26);
    bezierVertex(-20, 10, -20, -20, -24, -32);
    bezierVertex(-20, -34, -17, -34, -14, -33);
    endShape(CLOSE);
    // Stripe 3 (tail base)
    beginShape();
    vertex(-48, -6);
    bezierVertex(-44, -2, -44, 4, -48, 8);
    bezierVertex(-52, 4, -52, -2, -48, -6);
    endShape(CLOSE);

    // Pectoral fin
    noStroke();
    fill(orangeLight);
    stroke(outline);
    strokeWeight(2.5);
    beginShape();
    vertex(14, 10);
    bezierVertex(2, 12, -6, 24, 4, 28);
    bezierVertex(14, 28, 22, 20, 14, 10);
    endShape(CLOSE);

    // Belly highlight
    noStroke();
    fill(255, 210, 140, 120);
    ellipse(14, 20, 40, 10);

    // Eye
    stroke(outline);
    strokeWeight(2);
    fill(255);
    circle(38, -8, 14);
    noStroke();
    fill(20);
    circle(40, -8, 8);
    fill(255);
    circle(41.5, -10, 3);

    // Mouth
    stroke(outline);
    strokeWeight(2);
    noFill();
    arc(52, 4, 8, 6, 0.3, HALF_PI + 0.4);

  } else if (sp === 2) {
    // ================= BLUE TANG =================
    const blue1 = color(32, 120, 245);
    const blueDark = color(18, 56, 170);
    const blueLight = color(110, 190, 255);
    const yellow = color(255, 220, 30);
    const outline = color(10, 30, 100);

    // Tail fin (yellow)
    stroke(outline);
    strokeWeight(3);
    fill(yellow);
    beginShape();
    vertex(-40, 0);
    bezierVertex(-52, -12, -58, -30, -72, -34);
    bezierVertex(-62, -14, -62, 14, -72, 34);
    bezierVertex(-58, 30, -52, 12, -40, 0);
    endShape(CLOSE);
    // tail ray lines
    stroke(210, 160, 0, 200);
    strokeWeight(1.3);
    line(-46, 0, -66, -22);
    line(-46, 0, -68, 0);
    line(-46, 0, -66, 22);

    // Dorsal fin
    stroke(outline);
    strokeWeight(3);
    fill(blueDark);
    beginShape();
    vertex(-30, -24);
    bezierVertex(-20, -50, 20, -52, 32, -22);
    bezierVertex(14, -30, -10, -30, -30, -24);
    endShape(CLOSE);
    // Anal fin
    beginShape();
    vertex(-20, 24);
    bezierVertex(-10, 44, 16, 44, 24, 22);
    bezierVertex(8, 28, -6, 28, -20, 24);
    endShape(CLOSE);

    // Body
    fill(blue1);
    beginShape();
    vertex(-42, 0);
    bezierVertex(-36, -40, 30, -42, 54, -8);
    bezierVertex(58, 0, 58, 2, 52, 10);
    bezierVertex(30, 40, -34, 38, -42, 0);
    endShape(CLOSE);

    // Dark "palette" marking
    noStroke();
    fill(blueDark);
    beginShape();
    vertex(-30, -22);
    bezierVertex(-4, -30, 20, -16, 16, 0);
    bezierVertex(30, 4, 30, 18, 6, 20);
    bezierVertex(-18, 26, -34, 10, -30, -22);
    endShape(CLOSE);
    // Curl marking highlight
    stroke(color(20, 20, 70));
    strokeWeight(2.5);
    noFill();
    bezier(-26, -14, -6, -22, 14, -12, 12, 2);

    // Light body gloss
    noStroke();
    fill(blueLight, 150);
    ellipse(10, -26, 44, 9);

    // Pectoral fin
    stroke(outline);
    strokeWeight(2.5);
    fill(color(255, 226, 60));
    beginShape();
    vertex(24, 8);
    bezierVertex(10, 6, 0, 22, 10, 28);
    bezierVertex(22, 28, 30, 18, 24, 8);
    endShape(CLOSE);

    // Eye
    stroke(outline);
    strokeWeight(2);
    fill(255);
    circle(38, -10, 15);
    noStroke();
    fill(15);
    circle(40, -10, 9);
    fill(255);
    circle(42, -12.5, 3.2);

    // Mouth
    stroke(outline);
    strokeWeight(2);
    noFill();
    arc(54, 4, 8, 6, 0.2, HALF_PI + 0.5);

  } else {
    // ================= YELLOW TANG / ANGEL FISH =================
    const y1 = color(255, 224, 20);
    const yDark = color(240, 170, 0);
    const yLight = color(255, 247, 140);
    const outline = color(150, 90, 0);

    // Tail fin
    stroke(outline);
    strokeWeight(3);
    fill(yDark);
    beginShape();
    vertex(-38, 0);
    bezierVertex(-52, -14, -60, -26, -70, -24);
    bezierVertex(-62, -8, -62, 8, -70, 24);
    bezierVertex(-60, 26, -52, 14, -38, 0);
    endShape(CLOSE);
    stroke(255, 240, 150, 200);
    strokeWeight(1.3);
    line(-44, 0, -64, -14);
    line(-44, 0, -66, 0);
    line(-44, 0, -64, 14);

    // Long dorsal fin (flowing)
    stroke(outline);
    strokeWeight(3);
    fill(yDark);
    beginShape();
    vertex(-34, -26);
    bezierVertex(-30, -58, 10, -66, 40, -22);
    bezierVertex(18, -34, -8, -32, -34, -26);
    endShape(CLOSE);
    // Long anal fin
    beginShape();
    vertex(-30, 26);
    bezierVertex(-24, 54, 8, 58, 34, 20);
    bezierVertex(14, 32, -8, 32, -30, 26);
    endShape(CLOSE);
    // Fin ray details
    stroke(255, 240, 150, 210);
    strokeWeight(1.2);
    for (let i = 0; i < 5; i++) {
      const fx = -22 + i * 11;
      line(fx, -28, fx + 3, -28 - (30 - abs(i - 2) * 6));
      line(fx, 28, fx + 3, 28 + (28 - abs(i - 2) * 6));
    }

    // Body (rounded disc shape)
    stroke(outline);
    strokeWeight(3);
    fill(y1);
    beginShape();
    vertex(-42, 0);
    bezierVertex(-38, -42, 34, -46, 54, -6);
    bezierVertex(58, 2, 58, 4, 52, 12);
    bezierVertex(32, 44, -36, 42, -42, 0);
    endShape(CLOSE);

    // Body shading + scale hints
    noStroke();
    fill(yLight, 180);
    ellipse(8, -22, 56, 14);
    fill(yDark, 120);
    ellipse(2, 28, 60, 12);
    noFill();
    stroke(240, 180, 0, 150);
    strokeWeight(1.2);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        const sx = -22 + c * 12 + (r % 2) * 6;
        const sy = -6 + r * 12;
        arc(sx, sy, 12, 12, -0.1, PI + 0.1);
      }
    }

    // Gill line
    stroke(outline);
    strokeWeight(2);
    noFill();
    bezier(26, -22, 20, -8, 20, 8, 26, 22);

    // Pectoral fin
    stroke(outline);
    strokeWeight(2.5);
    fill(yLight);
    beginShape();
    vertex(14, 8);
    bezierVertex(0, 8, -10, 24, 0, 30);
    bezierVertex(14, 30, 22, 20, 14, 8);
    endShape(CLOSE);

    // Eye with detailed highlights
    stroke(outline);
    strokeWeight(2.2);
    fill(255);
    circle(38, -10, 17);
    noStroke();
    fill(210, 80, 20);
    circle(39.5, -10, 12);
    fill(15);
    circle(40, -10, 8);
    fill(255);
    circle(42.5, -13, 3.6);
    circle(37.5, -7, 1.8);

    // Mouth
    stroke(outline);
    strokeWeight(2);
    noFill();
    arc(54, 6, 8, 6, 0.2, HALF_PI + 0.5);
  }

  pop();
}

/* ------------------------------------------------------------------ */
/* 6. Shell                                                            */
/* ------------------------------------------------------------------ */

function drawShell(x, y, size) {
  push();
  translate(x, y);
  scale(size / 100);

  // Shadow on sand
  noStroke();
  fill(0, 0, 0, 40);
  ellipse(0, 4, 86, 14);

  // Bottom half of the clam (darker, peeking out)
  stroke(196, 120, 128);
  strokeWeight(2.5);
  fill(238, 150, 160);
  beginShape();
  vertex(-38, -8);
  bezierVertex(-44, 6, -20, 10, 0, 10);
  bezierVertex(20, 10, 44, 6, 38, -8);
  bezierVertex(20, 0, -20, 0, -38, -8);
  endShape(CLOSE);

  // Pearl in the opening
  noStroke();
  fill(255, 255, 255, 240);
  circle(0, -6, 14);
  fill(215, 230, 255, 200);
  circle(1.5, -4.5, 8);
  fill(255);
  circle(-2.5, -9, 4);

  // Main fan shell (top)
  stroke(214, 120, 116);
  strokeWeight(2.5);
  fill(255, 190, 180);
  beginShape();
  vertex(-12, -2);
  bezierVertex(-56, -8, -58, -52, -28, -60);
  bezierVertex(-14, -66, 14, -66, 28, -60);
  bezierVertex(58, -52, 56, -8, 12, -2);
  bezierVertex(6, 2, -6, 2, -12, -2);
  endShape(CLOSE);

  // Gradient-ish bands (alternating ribs)
  noStroke();
  for (let i = 0; i < 7; i++) {
    const a = map(i, 0, 6, -1.0, 1.0);
    const ex = sin(a) * 46;
    const ey = -4 - cos(a) * 54;
    const t = i / 6;
    fill(lerp(255, 255, t), lerp(214, 176, abs(a)), lerp(196, 170, abs(a)), 210);
    triangle(0, 0, ex - 6, ey + 2, ex + 6, ey + 2);
  }

  // Rib lines
  stroke(224, 128, 120);
  strokeWeight(2);
  for (let i = 0; i < 9; i++) {
    const a = map(i, 0, 8, -1.05, 1.05);
    const ex = sin(a) * 50;
    const ey = -4 - cos(a) * 56;
    line(0, -2, ex, ey);
  }

  // Scalloped outer edge
  stroke(214, 120, 116);
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (let i = 0; i <= 8; i++) {
    const a = map(i, 0, 8, -1.12, 1.12);
    vertex(sin(a) * 52, -4 - cos(a) * 58);
  }
  endShape();

  // Hinge / umbo
  noStroke();
  fill(250, 160, 150);
  ellipse(0, -2, 22, 12);
  fill(255, 215, 205);
  ellipse(0, -4, 12, 6);

  // Highlight
  fill(255, 255, 255, 140);
  ellipse(-20, -44, 14, 6);

  pop();
}

/* ------------------------------------------------------------------ */
/* 7. Cleaner Nozzle                                                   */
/* ------------------------------------------------------------------ */

function drawCleanerNozzle(x, y, size, isActive) {
  push();
  translate(x, y);
  scale(size / 100);

  // Design space: tool is horizontal, nozzle tip points right (+x).
  strokeJoin(ROUND);

  // Water spray (only when active)
  if (isActive) {
    noStroke();
    for (let i = 0; i < 9; i++) {
      const dist = 62 + i * 9;
      const spread = 4 + i * 2.4;
      fill(150, 225, 255, 120 - i * 11);
      ellipse(dist, (_seeded(i + 5) - 0.5) * spread, 10 + i, 6 + i * 0.6);
    }
    // inner jet
    fill(220, 245, 255, 150);
    rect(52, -3, 44, 6, 3);
    // bubbles
    stroke(255, 255, 255, 200);
    strokeWeight(1.5);
    noFill();
    circle(96, -12, 7);
    circle(110, 9, 5);
    circle(124, -6, 4);
  }

  // Hose
  stroke(30, 40, 56);
  strokeWeight(2.5);
  fill(52, 68, 92);
  rect(-96, -9, 50, 18, 6);
  stroke(30, 40, 56, 160);
  strokeWeight(1.5);
  for (let i = 0; i < 6; i++) {
    line(-90 + i * 8, -9, -90 + i * 8, 9);
  }

  // Rear coupling ring
  stroke(40, 50, 66);
  strokeWeight(2.5);
  fill(150, 164, 184);
  rect(-50, -14, 10, 28, 3);

  // Main body (sleek teal)
  stroke(14, 70, 92);
  strokeWeight(3);
  fill(22, 160, 190);
  beginShape();
  vertex(-40, -17);
  bezierVertex(-10, -22, 20, -20, 40, -12);
  vertex(40, 12);
  bezierVertex(20, 20, -10, 22, -40, 17);
  endShape(CLOSE);

  // Body shading
  noStroke();
  fill(90, 220, 240, 150);
  beginShape();
  vertex(-36, -15);
  bezierVertex(-10, -19, 18, -17, 36, -10);
  vertex(36, -4);
  bezierVertex(16, -9, -10, -11, -36, -7);
  endShape(CLOSE);
  fill(10, 90, 120, 130);
  beginShape();
  vertex(-36, 15);
  bezierVertex(-10, 19, 18, 17, 36, 10);
  vertex(36, 5);
  bezierVertex(16, 8, -10, 8, -36, 7);
  endShape(CLOSE);

  // Grip band
  stroke(14, 70, 92);
  strokeWeight(2);
  fill(36, 48, 66);
  rect(-30, -19, 16, 38, 4);
  stroke(90, 110, 138);
  strokeWeight(1.5);
  for (let i = 0; i < 4; i++) line(-27 + i * 4, -16, -27 + i * 4, 16);

  // Pressure gauge window with glass look
  stroke(14, 70, 92);
  strokeWeight(2);
  fill(18, 30, 46);
  rect(-8, -10, 26, 20, 5);
  noStroke();
  fill(isActive ? color(70, 235, 255) : color(70, 90, 110));
  rect(-4, 2, 4, 5, 1);
  rect(1, -2, 4, 9, 1);
  rect(6, -6, 4, 13, 1);
  rect(11, -9, 4, 16, 1);

  // Nozzle head (tapered)
  stroke(40, 50, 66);
  strokeWeight(3);
  fill(176, 188, 206);
  beginShape();
  vertex(40, -13);
  vertex(62, -8);
  vertex(62, 8);
  vertex(40, 13);
  endShape(CLOSE);
  // Nozzle tip ring
  fill(120, 134, 156);
  rect(58, -10, 9, 20, 3);
  // Nozzle opening
  noStroke();
  fill(10, 18, 30);
  ellipse(66, 0, 5, 10);
  // Metal highlight
  fill(255, 255, 255, 170);
  quad(42, -10, 58, -6, 58, -4, 42, -7);

  // LED status light (green = active, red = inactive)
  const ledOn = isActive ? color(60, 255, 110) : color(255, 60, 60);
  const ledGlowRgba = isActive ? "rgba(60, 255, 110, 0.65)" : "rgba(255, 60, 60, 0.6)";
  _glow(-20, -26, 16, ledGlowRgba, "rgba(0,0,0,0)");
  stroke(30, 40, 56);
  strokeWeight(2);
  fill(20, 28, 40);
  circle(-20, -26, 13);
  noStroke();
  fill(ledOn);
  circle(-20, -26, 9);
  fill(255, 255, 255, 220);
  circle(-22, -28, 3);

  // Glass reflection streaks over the body
  noStroke();
  fill(255, 255, 255, 80);
  beginShape();
  vertex(-8, -9);
  vertex(10, -9);
  vertex(2, 9);
  vertex(-16, 9);
  endShape(CLOSE);
  fill(255, 255, 255, 130);
  quad(14, -9, 18, -9, 12, 9, 8, 9);

  // Tiny bolt details
  fill(200, 214, 230);
  circle(-36, 0, 3);
  circle(36, 0, 3);

  pop();
}