// UI.js - Interface, HUD, Medidores, Fundo Marinho e Composicao de Assets

let bolhasFundo = [];
let peixesFundo = [];

function inicializaFundoAtivo() {
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

  if (peixesFundo.length === 0) {
    peixesFundo.push({ x: 100, y: 150, speed: 1.2, size: 38, species: 1, dir: 1 });
    peixesFundo.push({ x: 700, y: 220, speed: 0.9, size: 42, species: 2, dir: -1 });
    peixesFundo.push({ x: 300, y: 280, speed: 1.4, size: 32, species: 3, dir: 1 });
  }
}

// Posições fixas dos corais para que a sujidade consiga nascer exatamente sobre eles
const posicoesCorais = [
  { x: 260, y: 535, size: 70, type: 1 }, // Coral 0 (Rosa / Brain)
  { x: 360, y: 525, size: 80, type: 2 }, // Coral 1 (Laranja / Branching)
  { x: 470, y: 530, size: 85, type: 1 }, // Coral 2 (Cérebro)
  { x: 580, y: 525, size: 75, type: 3 }, // Coral 3 (Leque Púrpura)
  { x: 680, y: 530, size: 70, type: 2 }  // Coral 4 (Laranja)
];

// Fundo Marinho com Profundidade Aumentada e Navio Enterrado na Diagonal
function desenhaFundoMarinho() {
  // 1. Gradiente de Água Turquesa Iluminada
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(40, 180, 220), color(15, 75, 120), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // 2. Raios de Sol Subaquáticos
  noStroke();
  fill(255, 255, 200, 25);
  beginShape();
  vertex(100, 0); vertex(220, 0); vertex(380, height); vertex(200, height);
  endShape(CLOSE);

  beginShape();
  vertex(450, 0); vertex(580, 0); vertex(720, height); vertex(520, height);
  endShape(CLOSE);

  // 3. Bolhas e Peixes Animados no Espaço Aquático
  inicializaFundoAtivo();

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

  for (let p of peixesFundo) {
    p.x += p.speed * p.dir;
    if (p.x > width + 50) p.dir = -1;
    if (p.x < -50) p.dir = 1;
    drawFish(p.x, p.y, p.size, p.dir, p.species);
  }

  // 4. PLANÍCIE / DUNA DE SEGUNDO PLANO (Ao Longe)
  fill(180, 155, 105);
  noStroke();
  beginShape();
  vertex(0, 485);
  bezierVertex(180, 475, 450, 495, width, 480);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // 5. NAVIO NAUFRAGADO ENTERRADO NA DIAGONAL (Segundo Plano)
  push();
  translate(110, 475);   // Posiciona no leito traseiro
  rotate(0.22);          // Inclina o navio na diagonal
  scale(0.65);           // Reduz tamanho para profundidade realista

  // Desenha o naufrágio com os assets de Assets.js
  drawSunkenShipwreck(0, 0);
  pop();

  // Camada de areia que "enterra" a proa/frente do navio
  fill(180, 155, 105);
  ellipse(130, 508, 180, 35);

  // 6. PLANÍCIE MARINHA DE PRIMEIRO PLANO (Areia Clara Principal)
  fill(225, 200, 135);
  beginShape();
  vertex(0, 520);
  bezierVertex(250, 510, 550, 515, width, 510);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // 7. CORAIS NO PRIMEIRO PLANO (Assentes firmemente no leito de areia)
  // 7. CORAIS NO PRIMEIRO PLANO (Dinâmicos: Branqueados se tiverem sujidade, Vivos se estiverem limpos)
  for (let i = 0; i < posicoesCorais.length; i++) {
    let c = posicoesCorais[i];
    
    // Verifica se ainda existe alguma mancha de sujidade ativa neste coral
    let temSujidade = listaSujidade.some(m => m.idCoral === i && !m.limpa);

    if (temSujidade) {
      drawCoralBleached(c.x, c.y, c.size, c.type);
    } else {
      drawCoralHealthy(c.x, c.y, c.size, c.type);
    }
  }

  // Conchas decorativas na areia
  drawShell(180, 550, 20);
  drawShell(510, 555, 22);
}

// ECRÃ INICIAL
function desenhaInicio() {
  desenhaFundoMarinho();

  textAlign(CENTER, CENTER);
  textSize(48);
  fill(10, 40, 70, 150);
  text("REEF CLEANER", width / 2 + 3, 83);
  fill(255, 240, 180);
  text("REEF CLEANER", width / 2, 80);

  fill(10, 35, 60, 210);
  stroke(80, 200, 240, 180);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, 250, 620, 220, 15);

  noStroke();
  fill(255);
  textSize(16);
  text("Restaure o ecossistema limpando as algas e sedimentos dos corais!", width / 2, 175);

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

// ECRÃ DE CALIBRAÇÃO
function processaCalibracao() {
  let volumeAtual = mic.getLevel();
  somaRuido += volumeAtual;
  amostrasRuido++;

  let tempoDecorrido = (millis() - cronometroCalib) / 1000;
  let restante = max(0, tempoCalibracao - tempoDecorrido);

  desenhaFundoMarinho();

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

  textSize(54);
  fill(255, 220, 80);
  text(restante.toFixed(1) + "s", width / 2, height / 2 + 25);

  let progresso = map(tempoDecorrido, 0, tempoCalibracao, 0, 400);
  progresso = constrain(progresso, 0, 400);

  fill(20, 60, 90);
  rect(width / 2, height / 2 + 80, 400, 16, 8);

  fill(50, 220, 130);
  rectMode(CORNER);
  rect(width / 2 - 200, height / 2 + 72, progresso, 16, 8);

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

  drawGoldCoin(375, 25, 10);
  fill(255, 220, 80);
  textSize(15);
  text(`Tesouro: ${moedas}`, 395, 25);

  fill(255);
  text(`Saúde Recife: ${saudeRecife}%`, 530, 25);
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

// ECRÃ DE FIM DE NÍVEL (RESULTADOS & RECOMPENSA)
function desenhaFimNivel() {
  desenhaFundoMarinho();

  fill(10, 35, 60, 220);
  stroke(80, 200, 240, 200);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height / 2, 540, 320, 15);

  noStroke();
  fill(255, 220, 80);
  textAlign(CENTER, CENTER);
  textSize(36);
  text(`NÍVEL ${nivelAtual} CONCLUÍDO!`, width / 2, height / 2 - 110);

  fill(255);
  textSize(20);
  text(`Recife Limpo: ${percentagemLimpa.toFixed(1)}%`, width / 2, height / 2 - 50);

  // Tesouro Ganho
  let ganho = floor((percentagemLimpa / 10) * nivelAtual);
  drawGoldCoin(width / 2 - 80, height / 2, 14);
  fill(255, 215, 0);
  textSize(22);
  text(`+${ganho} Moedas do Tesouro!`, width / 2 + 20, height / 2);

  // Botões de Ação
  rectMode(CORNER);

  // Botão Loja
  fill(40, 120, 180);
  stroke(255);
  strokeWeight(2);
  rect(width / 2 - 210, 400, 200, 50, 10);
  fill(255);
  noStroke();
  textSize(18);
  text("Loja de Upgrades", width / 2 - 110, 425);

  // Botão Próximo Nível
  fill(50, 200, 120);
  stroke(255);
  strokeWeight(2);
  rect(width / 2 + 10, 400, 200, 50, 10);
  fill(255);
  noStroke();
  textSize(18);
  text(nivelAtual < totalNiveis ? "Próximo Nível" : "Menu Inicial", width / 2 + 110, 425);
}

// ECRÃ DA LOJA DE UPGRADES
function desenhaLoja() {
  desenhaFundoMarinho();

  fill(10, 35, 60, 230);
  stroke(240, 190, 50, 220);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height / 2, 560, 360, 15);

  textAlign(CENTER, CENTER);
  fill(255, 220, 80);
  textSize(32);
  text("LOJA DE MELHORIAS", width / 2, height / 2 - 140);

  // Saldo Atual
  drawGoldCoin(width / 2 - 60, height / 2 - 95, 12);
  fill(255);
  textSize(18);
  text(`Seu Tesouro: ${moedas} moedas`, width / 2 + 30, height / 2 - 95);

  // Item 1: Jato Mais Largo
  fill(20, 60, 95);
  rect(width / 2 - 130, height / 2, 220, 130, 10);
  fill(255);
  textSize(16);
  text("Jato Ampliado", width / 2 - 130, height / 2 - 40);
  textSize(12);
  fill(180, 220, 255);
  text(`Nível: ${upgradeLargo}/3`, width / 2 - 130, height / 2 - 15);
  text("Aumenta o raio de alcance", width / 2 - 130, height / 2 + 5);

  // Botão Comprar Item 1
  rectMode(CORNER);
  fill(moedas >= 15 && upgradeLargo < 3 ? color(50, 200, 120) : color(80, 90, 100));
  stroke(255);
  rect(width / 2 - 240, 330, 220, 45, 8);
  fill(255);
  noStroke();
  textSize(15);
  text(upgradeLargo >= 3 ? "MÁXIMO" : "Comprar (15 M)", width / 2 - 130, 352);

  // Item 2: Tolerância de Pressão
  rectMode(CENTER);
  fill(20, 60, 95);
  rect(width / 2 + 130, height / 2, 220, 130, 10);
  fill(255);
  textSize(16);
  text("Bocal de Precisão", width / 2 + 130, height / 2 - 40);
  textSize(12);
  fill(180, 220, 255);
  text(`Nível: ${upgradeTolerancia}/3`, width / 2 + 130, height / 2 - 15);
  text("Facilita manter a pressão", width / 2 + 130, height / 2 + 5);

  // Botão Comprar Item 2
  rectMode(CORNER);
  fill(moedas >= 20 && upgradeTolerancia < 3 ? color(50, 200, 120) : color(80, 90, 100));
  stroke(255);
  rect(width / 2 + 20, 330, 220, 45, 8);
  fill(255);
  noStroke();
  textSize(15);
  text(upgradeTolerancia >= 3 ? "MÁXIMO" : "Comprar (20 M)", width / 2 + 130, 352);

  // Botão Voltar ao Jogo
  fill(40, 140, 200);
  stroke(255);
  rect(width / 2 - 120, 440, 240, 50, 10);
  fill(255);
  noStroke();
  textSize(18);
  text("Continuar Jogo", width / 2, 465);
}

// ECRÃ DE GAME OVER / DERROTA
function desenhaGameOver() {
  desenhaFundoMarinho();

  fill(10, 35, 60, 230);
  stroke(255, 80, 80, 220);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height / 2, 500, 260, 15);

  textAlign(CENTER, CENTER);
  fill(255, 90, 90);
  textSize(36);
  text("TEMPO ESGOTADO!", width / 2, height / 2 - 70);

  fill(255);
  textSize(18);
  text(`Apenas ${percentagemLimpa.toFixed(1)}% do recife foi limpo.`, width / 2, height / 2 - 15);
  textSize(14);
  fill(200, 220, 245);
  text("Necessita de pelo menos 70% para avançar de nível.", width / 2, height / 2 + 15);

  rectMode(CORNER);
  fill(220, 70, 70);
  stroke(255);
  strokeWeight(2);
  rect(width / 2 - 130, 380, 260, 50, 10);

  fill(255);
  noStroke();
  textSize(18);
  text("Tentar Novamente", width / 2, 405);
}