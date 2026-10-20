// UI.js - Interface, HUD, Medidores, Ecrã Inicial e Calibração

let bolhasFundo = [];

function inicializaBolhasFundo() {
  if (bolhasFundo.length === 0) {
    for (let i = 0; i < 25; i++) {
      bolhasFundo.push({
        x: random(width),
        y: random(height),
        r: random(3, 8),
        v: random(0.5, 1.5)
      });
    }
  }
}

// Fundo Marinho Iluminado
function desenhaFundoMarinho() {
  // Gradiente Água Turquesa Iluminada
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(40, 180, 220), color(15, 75, 120), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Raios de Sol Subaquáticos
  noStroke();
  fill(255, 255, 200, 25);
  beginShape();
  vertex(100, 0); vertex(220, 0); vertex(380, height); vertex(200, height);
  endShape(CLOSE);

  beginShape();
  vertex(450, 0); vertex(580, 0); vertex(720, height); vertex(520, height);
  endShape(CLOSE);

  // Bolhas de Fundo
  inicializaBolhasFundo();
  fill(255, 255, 255, 80);
  noStroke();
  for (let b of bolhasFundo) {
    ellipse(b.x, b.y, b.r * 2);
    b.y -= b.v;
    b.x += sin(frameCount * 0.03 + b.r) * 0.5;
    if (b.y < -10) {
      b.y = height + 10;
      b.x = random(width);
    }
  }

  // Leito de Areia Dourada
  fill(220, 195, 130);
  noStroke();
  ellipse(width / 2, height + 90, 980, 320);

  // Navio e Baú do Tesouro
  desenhaNavioNaufragado();
}

// ECRÃ INICIAL RENOVAL
function desenhaInicio() {
  desenhaFundoMarinho();

  // Título com Brilho/Sombra
  textAlign(CENTER, CENTER);
  textSize(48);
  fill(10, 40, 70, 150);
  text("REEF CLEANER", width / 2 + 3, 83); // Sombra
  fill(255, 240, 180);
  text("REEF CLEANER", width / 2, 80);

  // Cartão Principal de Instruções Translúcido
  fill(10, 35, 60, 210);
  stroke(80, 200, 240, 180);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, 250, 620, 220, 15);

  noStroke();
  fill(255);
  textSize(16);
  text("Restaure o ecossistema limpando as algas e sedimentos dos corais!", width / 2, 175);

  // Caixas de Controlo
  fill(20, 60, 95, 180);
  rect(width / 2 - 140, 250, 250, 80, 10);
  rect(width / 2 + 140, 250, 250, 80, 10);

  fill(255, 220, 100);
  textSize(15);
  text("Rato", width / 2 - 140, 225);
  text("Voz / Sopro", width / 2 + 140, 225);

  fill(220);
  textSize(13);
  text("Move a ferramenta", width / 2 - 140, 255);
  text("Ajusta a pressão do jato", width / 2 + 140, 255);

  fill(180, 230, 255);
  textSize(14);
  text("Recolha moedas do tesouro do navio e complete 100% dos 5 níveis!", width / 2, 325);

  // Botão "Calibrar e Jogar" Atraente
  let emCima = mouseX > width / 2 - 140 && mouseX < width / 2 + 140 &&
               mouseY > 410 - 28 && mouseY < 410 + 28;

  if (emCima) {
    fill(50, 220, 140);
    stroke(255);
  } else {
    fill(35, 175, 110);
    stroke(180, 255, 210);
  }

  strokeWeight(2);
  rect(width / 2, 410, 280, 56, 12);

  fill(255);
  noStroke();
  textSize(20);
  text("Calibrar e Jogar (3s)", width / 2, 410);
}

// ECRÃ DE CALIBRAÇÃO RENOVAL
function processaCalibracao() {
  let volumeAtual = mic.getLevel();
  somaRuido += volumeAtual;
  amostrasRuido++;

  let tempoDecorrido = (millis() - cronometroCalib) / 1000;
  let restante = max(0, tempoCalibracao - tempoDecorrido);

  desenhaFundoMarinho();

  // Caixas de Calibração Translúcida
  fill(10, 35, 60, 220);
  stroke(80, 200, 240, 200);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height / 2, 520, 260, 15);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(22);
  text("A calibrar o som ambiente...", width / 2, height / 2 - 70);

  fill(180, 220, 255);
  textSize(14);
  text("Mantenha o silêncio normal da divisão durante o contador.", width / 2, height / 2 - 35);

  // Contador Gigante Dourado
  textSize(54);
  fill(255, 220, 80);
  text(restante.toFixed(1) + "s", width / 2, height / 2 + 25);

  // Barra de Progresso da Calibração
  let progresso = map(tempoDecorrido, 0, tempoCalibracao, 0, 400);
  progresso = constrain(progresso, 0, 400);

  fill(20, 60, 90);
  rect(width / 2, height / 2 + 80, 400, 16, 8);

  fill(50, 220, 130);
  rectMode(CORNER);
  rect(width / 2 - 200, height / 2 + 72, progresso, 16, 8);

  // Conclusão da Calibração
  if (tempoDecorrido >= tempoCalibracao) {
    ruidoBase = somaRuido / amostrasRuido;
    limiteMinimo = max(0.03, ruidoBase * 1.8);
    faixaIdealMin = limiteMinimo + 0.08;
    faixaIdealMax = limiteMinimo + 0.28;

    listaSujidade = geraSujidadeAleatoria(15);
    totalSujidadeInicial = 0;
    for (let m of listaSujidade) {
      totalSujidadeInicial += m.raioInicial;
    }

    cronometroJogo = millis();
    estado = "execucao";
  }
}

// Desenha Navio
function desenhaNavioNaufragado() {
  push();
  fill(55, 35, 20);
  stroke(30, 15, 8);
  strokeWeight(2);

  beginShape();
  vertex(40, 520);
  vertex(220, 495);
  vertex(260, 565);
  vertex(20, 575);
  endShape(CLOSE);

  strokeWeight(5);
  stroke(40, 25, 12);
  line(110, 510, 80, 400);
  line(180, 500, 210, 420);

  rectMode(CORNER);
  fill(120, 80, 30);
  stroke(240, 190, 50);
  strokeWeight(2);
  rect(215, 528, 45, 28, 4);

  drawMoedaTesouroIcone(225, 524, 5);
  drawMoedaTesouroIcone(237, 522, 6);
  drawMoedaTesouroIcone(248, 525, 5);
  pop();
}

// HUD Superior
function desenhaHUD() {
  fill(10, 35, 60, 210);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, width, 50);

  stroke(80, 200, 240, 150);
  strokeWeight(2);
  line(0, 50, width, 50);

  noStroke();
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(15);
  text(`Nível: ${nivelAtual}`, 20, 25);
  text(`Tempo: ${ceil(tempoRestante)}s`, 120, 25);
  text(`Limpo: ${percentagemLimpa.toFixed(1)}%`, 240, 25);

  drawMoedaTesouroIcone(375, 25, 9);
  fill(255, 220, 80);
  textSize(15);
  text(`Tesouro: ${moedas}`, 392, 25);

  fill(255);
  text(`Saúde Recife: ${saudeRecife}%`, 530, 25);
}

function drawMoedaTesouroIcone(x, y, r) {
  push();
  stroke(180, 130, 20);
  strokeWeight(1.5);
  fill(255, 215, 0);
  ellipse(x, y, r * 2, r * 2);

  noStroke();
  fill(210, 160, 10);
  ellipse(x, y, r * 1.1, r * 1.1);
  pop();
}

// Medidor Vertical do Microfone
function desenhaMedidorMicrofone(volAtual) {
  let x = width - 55;
  let y = 65;
  let alt = 240;
  let larg = 28;

  fill(10, 25, 40, 210);
  stroke(255, 180);
  strokeWeight(2);
  rectMode(CORNER);
  rect(x, y, larg, alt, 6);

  let yIdealMin = map(faixaIdealMax, 0, 1, y + alt, y);
  let yIdealMax = map(faixaIdealMin, 0, 1, y + alt, y);
  noStroke();
  fill(50, 230, 120, 160);
  rect(x, yIdealMin, larg, yIdealMax - yIdealMin);

  let altVolume = map(volAtual, 0, 1, 0, alt);
  altVolume = constrain(altVolume, 0, alt);

  if (volAtual < limiteMinimo) {
    fill(100, 180, 255);
  } else if (volAtual >= faixaIdealMin && volAtual <= faixaIdealMax) {
    fill(50, 255, 130);
  } else {
    fill(255, 75, 75);
  }

  rect(x, y + alt - altVolume, larg, altVolume, 4);

  stroke(255, 220, 0);
  strokeWeight(2);
  let yMin = map(limiteMinimo, 0, 1, y + alt, y);
  line(x - 4, yMin, x + larg + 4, yMin);

  noStroke();
  fill(255);
  textSize(11);
  textAlign(CENTER, TOP);
  text("Micro", x + larg / 2, y + alt + 8);
}