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
  { x: 260, y: 520, size: 45, type: 1 }, // Coral Cérebro (perto do barco)
  { x: 375, y: 525, size: 50, type: 2 }, // Coral Ramificado
  { x: 490, y: 520, size: 45, type: 1 }, // Coral Cérebro (centro)
  { x: 605, y: 525, size: 50, type: 3 }, // Coral Leque
  { x: 715, y: 525, size: 48, type: 2 }  // Coral Ramificado (direita)
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

  // 5. NAVIO NAUFRAGADO ENTERRADO PROFUNDAMENTE (Segundo Plano)
  push();
  translate(100, 490);   // Afunda o navio mais para baixo
  rotate(0.32);          // Maior inclinação diagonal (proa afundada)
  scale(0.65);

  drawSunkenShipwreck(0, 0);
  pop();

  // Duna de Areia de Sobreposição para "enterrar" a parte da frente do barco
  fill(180, 155, 105);
  noStroke();
  beginShape();
  vertex(120, 500);
  bezierVertex(170, 485, 220, 495, 260, 510);
  vertex(260, 530);
  vertex(120, 530);
  endShape(CLOSE);

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

  // Título Principal
  textAlign(CENTER, CENTER);
  fill(255, 230, 110);
  stroke(20, 50, 70);
  strokeWeight(4);
  textSize(42);
  text("REEF CLEANER", width / 2, 80);

  // Painel Principal de Instruções (Aumentada a altura para 250px)
  fill(10, 35, 60, 220);
  stroke(80, 200, 240, 180);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, 250, 580, 250, 15);

  noStroke();
  fill(255);
  textSize(18);
  text("Restaure o ecossistema limpando as algas e sedimentos dos corais!", width / 2, 160);

  // Cartões de Instruções (Rato vs Voz)
  rectMode(CORNER);
  fill(20, 50, 80, 180);
  rect(width / 2 - 250, 190, 230, 70, 8);
  rect(width / 2 + 20, 190, 230, 70, 8);

  textAlign(CENTER, CENTER);
  fill(255, 215, 0);
  textSize(15);
  text("Rato", width / 2 - 135, 210);
  text("Voz / Sopro", width / 2 + 135, 210);

  fill(220);
  textSize(13);
  text("Move a ferramenta", width / 2 - 135, 235);
  text("Ajusta a pressão do jato", width / 2 + 135, 235);

  fill(180, 230, 255);
  textSize(14);
  text("Recolha moedas do tesouro do navio e complete 100% dos 5 níveis!", width / 2, 335);

  // ---- BOTÃO 1: Calibrar e Jogar ----
  rectMode(CORNER);
  let emCimaCalib = mouseX > width / 2 - 140 && mouseX < width / 2 + 140 && mouseY > 380 && mouseY < 425;
  fill(emCimaCalib ? color(60, 230, 150) : color(40, 180, 110));
  stroke(255);
  strokeWeight(2);
  rect(width / 2 - 140, 380, 280, 45, 10);

  fill(255);
  noStroke();
  textSize(17);
  text("Calibrar e Jogar (3s)", width / 2, 402.5);

  // ---- BOTÃO 2: Escolher Nível (Se tiver mais de 1 nível desbloqueado) ----
  if (typeof nivelMaximoDesbloqueado !== "undefined" && nivelMaximoDesbloqueado > 1) {
    let emCimaNiveis = mouseX > width / 2 - 140 && mouseX < width / 2 + 140 && mouseY > 435 && mouseY < 480;
    fill(emCimaNiveis ? color(70, 190, 240) : color(35, 130, 185));
    stroke(255);
    strokeWeight(2);
    rect(width / 2 - 140, 435, 280, 45, 10);

    fill(255);
    noStroke();
    textSize(16);
    text("🗺 Escolher Nível", width / 2, 457.5);
  }
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

    resetaJogoCompleto();
    iniciaNivel(1);
  }
}

// HUD Superior
// HUD Superior com Botão de Acesso à Loja
function desenhaHUD() {
  rectMode(CORNER);
  fill(10, 35, 60, 200);
  noStroke();
  rect(0, 0, width, 50);

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(16);
  text(`Nível: ${nivelAtual}`, 30, 25);
  text(`Tempo: ${ceil(tempoRestante)}s`, 125, 25);
  text(`Limpo: ${percentagemLimpa.toFixed(1)}%`, 235, 25);

  // Exibe Moedas
  drawGoldCoin(360, 25, 12);
  fill(255, 215, 0);
  textSize(16);
  text(`${moedas}`, 380, 25);

  // ---- BOTÃO 1: 🛒 Loja ----
  let emCimaLoja = mouseX > 420 && mouseX < 500 && mouseY > 10 && mouseY < 40;
  fill(emCimaLoja ? color(70, 190, 240) : color(35, 130, 185));
  stroke(255);
  strokeWeight(1.5);
  rect(420, 10, 80, 30, 6);

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(13);
  text("🛒 Loja", 460, 25);

  // ---- BOTÃO 2: 🗺 Níveis ----
  let emCimaNiveis = mouseX > 505 && mouseX < 585 && mouseY > 10 && mouseY < 40;
  fill(emCimaNiveis ? color(240, 160, 60) : color(200, 120, 30));
  stroke(255);
  strokeWeight(1.5);
  rect(505, 10, 80, 30, 6);

  fill(255);
  noStroke();
  textSize(13);
  text("🗺 Níveis", 545, 25);

  // ---- BOTÃO 3: 🎁 Recompensas ----
  let emCimaRecompensas = mouseX > 590 && mouseX < 710 && mouseY > 10 && mouseY < 40;
  fill(emCimaRecompensas ? color(190, 120, 230) : color(130, 75, 180));
  stroke(255);
  strokeWeight(1.5);
  rect(590, 10, 120, 30, 6);

  fill(255);
  noStroke();
  textSize(13);
  text("🎁 Recompensas", 650, 25);

  // Saúde do Recife
  textAlign(LEFT, CENTER);
  fill(saudeRecife < 50 ? color(255, 85, 85) : color(255));
  textSize(14);
  text(`Saúde: ${saudeRecife.toFixed(0)}%`, 720, 25);
}

function desenhaAvisoPressaoExcessiva() {
  let pisca = frameCount % 30 < 15;
  rectMode(CENTER);
  noStroke();
  fill(70, 0, 0, pisca ? 225 : 190);
  rect(width / 2, 76, 500, 36, 8);
  fill(255, pisca ? 70 : 120, 90);
  textAlign(CENTER, CENTER);
  textSize(18);
  text("⚠️ PRESSÃO EXCESSIVA! A DANIFICAR CORAIS!", width / 2, 76);
}

function desenhaModalRecompensas() {
  rectMode(CORNER);
  noStroke();
  fill(0, 0, 0, 170);
  rect(0, 0, width, height);

  rectMode(CENTER);
  fill(10, 35, 60, 245);
  stroke(240, 200, 80);
  strokeWeight(2);
  rect(width / 2, height / 2, 500, 320, 16);

  noStroke();
  textAlign(CENTER, CENTER);
  fill(255, 220, 80);
  textSize(28);
  text("TABELA DE RECOMPENSAS", width / 2, height / 2 - 115);

  fill(255);
  textSize(17);
  text("Moedas recebidas conforme a limpeza do recife:", width / 2, height / 2 - 72);
  fill(180, 230, 255);
  textSize(16);
  text("75% a 89% limpo  →  10 Moedas × Nível Atual", width / 2, height / 2 - 32);
  text("90% a 99% limpo  →  15 Moedas × Nível Atual", width / 2, height / 2 + 2);
  text("100% limpo  →  30 Moedas × Nível Atual", width / 2, height / 2 + 36);

  fill(saudeRecife < 50 ? color(255, 100, 100) : color(200, 230, 210));
  textSize(14);
  text("Requer saúde do recife igual ou superior a 50%.", width / 2, height / 2 + 74);

  rectMode(CORNER);
  fill(180, 70, 70);
  stroke(255);
  rect(width / 2 + 150, height / 2 - 150, 40, 40, 8);
  noStroke();
  fill(255);
  textSize(20);
  text("×", width / 2 + 170, height / 2 - 130);
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
  rect(width / 2, height / 2, 560, 390, 15);

  noStroke();
  fill(255, 220, 80);
  textAlign(CENTER, CENTER);
  textSize(32);
  text(`NÍVEL ${nivelAtual} CONCLUÍDO!`, width / 2, 135);

  fill(255);
  textSize(20);
  text(`Recife Limpo: ${percentagemLimpa.toFixed(1)}%`, width / 2, 180);

  fill(saudeRecife < 50 ? color(255, 100, 100) : color(190, 230, 255));
  textSize(17);
  text(`Saúde do recife: ${saudeRecife.toFixed(0)}%`, width / 2, 210);

  drawGoldCoin(width / 2 - 95, 245, 14);
  fill(255, 215, 0);
  textSize(21);
  text(`Ganhaste ${moedasGanhasNaPartida} moedas nesta partida`, width / 2 + 20, 245);

  if (saudeRecife < 50) {
    fill(255, 100, 100);
    textSize(15);
    text("Sem moedas: o recife ficou com menos de 50% de saúde.", width / 2, 280);
  } else if (percentagemLimpa < 75) {
    fill(220, 220, 220);
    textSize(15);
    text("Não atingiste 75% de limpeza; não ganhaste moedas.", width / 2, 280);
  }
  if (percentagemLimpa < 100) {
    fill(255, 210, 90);
    textSize(15);
    text("ℹ️ Necessário 100% de limpeza para desbloquear o próximo nível!", width / 2, 310);
  }

  // Botões de Ação
  rectMode(CORNER);

  // Botão Loja
  fill(40, 120, 180);
  stroke(255);
  strokeWeight(2);
  rect(width / 2 - 210, 410, 200, 50, 10);
  fill(255);
  noStroke();
  textSize(18);
  text("Loja de Upgrades", width / 2 - 110, 435);

  // Botão de seleção disponível em todos os resultados
  fill(50, 150, 110);
  stroke(255);
  strokeWeight(2);
  rect(width / 2 + 10, 410, 200, 50, 10);
  fill(255);
  noStroke();
  textSize(18);
  text("🗺 Escolher Nível", width / 2 + 110, 435);
}

// ECRÃ DA LOJA DE UPGRADES
function desenhaLoja() {
  desenhaFundoMarinho();

  fill(10, 35, 60, 230);
  stroke(240, 190, 50, 220);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height / 2, 560, 390, 15);

  textAlign(CENTER, CENTER);
  fill(255, 220, 80);
  textSize(32);
  text("LOJA DE MELHORIAS", width / 2, 125);

  // Saldo Atual
  drawGoldCoin(width / 2 - 60, 168, 12);
  fill(255);
  textSize(18);
  text(`Seu Tesouro: ${moedas} moedas`, width / 2 + 30, 168);

  // Item 1: Jato Mais Largo
  fill(20, 60, 95);
  rect(width / 2 - 130, 285, 220, 150, 10);
  fill(255);
  textSize(16);
  text("Jato Mais Largo", width / 2 - 130, 232);
  textSize(12);
  fill(180, 220, 255);
  text(`Nível: ${upgradeLargo}/5`, width / 2 - 130, 255);
  for (let i = 0; i < 5; i++) {
    fill(i < upgradeLargo ? color(255, 210, 60) : color(70, 90, 110));
    rectMode(CORNER);
    rect(width / 2 - 180 + i * 20, 270, 15, 8, 3);
  }
  text("Aumenta o raio de alcance", width / 2 - 130, 295);

  // Botão Comprar Item 1
  rectMode(CORNER);
  fill(upgradeLargo < 5 && moedas >= precosUpgradeLargo[upgradeLargo] ? color(50, 200, 120) : color(80, 90, 100));
  stroke(255);
  rect(width / 2 - 240, 365, 220, 40, 8);
  fill(255);
  noStroke();
  textSize(15);
  text(upgradeLargo >= 5 ? "MÁXIMO" : `Próximo nível: ${precosUpgradeLargo[upgradeLargo]} M`, width / 2 - 130, 385);

  // Item 2: Tolerância de Pressão
  rectMode(CENTER);
  fill(20, 60, 95);
  rect(width / 2 + 130, 285, 220, 150, 10);
  fill(255);
  textSize(16);
  text("Tolerância de Pressão", width / 2 + 130, 232);
  textSize(12);
  fill(180, 220, 255);
  text(`Nível: ${upgradeTolerancia}/5`, width / 2 + 130, 255);
  for (let i = 0; i < 5; i++) {
    fill(i < upgradeTolerancia ? color(255, 210, 60) : color(70, 90, 110));
    rectMode(CORNER);
    rect(width / 2 + 80 + i * 20, 270, 15, 8, 3);
  }
  text("Alarga a faixa de pressão ideal", width / 2 + 130, 295);

  // Botão Comprar Item 2
  rectMode(CORNER);
  fill(upgradeTolerancia < 5 && moedas >= precosUpgradeTolerancia[upgradeTolerancia] ? color(50, 200, 120) : color(80, 90, 100));
  stroke(255);
  rect(width / 2 + 20, 365, 220, 40, 8);
  fill(255);
  noStroke();
  textSize(15);
  text(upgradeTolerancia >= 5 ? "MÁXIMO" : `Próximo nível: ${precosUpgradeTolerancia[upgradeTolerancia]} M`, width / 2 + 130, 385);

  // Botão Voltar (Ajusta o texto dinamicamente consoante a origem)
  fill(40, 140, 200);
  stroke(255);
  rect(width / 2 - 120, 435, 240, 45, 10);
  fill(255);
  noStroke();
  textSize(18);
  
  if (typeof estadoAnteriorLoja !== "undefined" && estadoAnteriorLoja === "fimNivel") {
    text("Voltar aos Resultados", width / 2, 458);
  } else {
    text("Voltar ao Jogo", width / 2, 458);
  }
}

// ECRÃ DE GAME OVER / DERROTA
function desenhaGameOver() {
  desenhaFundoMarinho();

  fill(10, 35, 60, 230);
  stroke(255, 80, 80, 220);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height / 2, 580, 380, 15);

  textAlign(CENTER, CENTER);
  fill(255, 90, 90);
  textSize(34);
  text("TEMPO ESGOTADO!", width / 2, 165);

  fill(255);
  textSize(18);
  text(`Apenas ${percentagemLimpa.toFixed(1)}% do recife foi limpo.`, width / 2, 215);
  fill(saudeRecife < 50 ? color(255, 100, 100) : color(190, 230, 255));
  textSize(16);
  text(`Saúde do recife: ${saudeRecife.toFixed(0)}%`, width / 2, 248);
  drawGoldCoin(width / 2 - 105, 280, 12);
  fill(255, 215, 0);
  textSize(18);
  text(`Ganhaste ${moedasGanhasNaPartida} moedas nesta partida`, width / 2 + 15, 280);
  if (saudeRecife < 50) {
    fill(255, 100, 100);
    textSize(14);
    text("Sem moedas: o recife ficou com menos de 50% de saúde.", width / 2, 310);
  } else if (percentagemLimpa < 75) {
    fill(220);
    textSize(14);
    text("Não atingiste 75% de limpeza; não ganhaste moedas.", width / 2, 310);
  }
  textSize(14);
  fill(255, 210, 90);
  text("ℹ️ Necessário 100% de limpeza para desbloquear o próximo nível!", width / 2, 337);

  rectMode(CORNER);
  fill(220, 70, 70);
  stroke(255);
  strokeWeight(2);
  rect(width / 2 - 130, 370, 260, 50, 10);

  fill(255);
  noStroke();
  textSize(18);
  text("Tentar Novamente", width / 2, 395);

  fill(40, 130, 180);
  stroke(255);
  rect(width / 2 - 130, 430, 260, 50, 10);
  fill(255);
  noStroke();
  text("🗺 Escolher Nível", width / 2, 455);
}

// ECRÃ DE VITÓRIA FINAL (PARABÉNS - JOGO CONCLUÍDO)
function desenhaVitoriaFinal() {
  desenhaFundoMarinho();

  fill(10, 35, 60, 230);
  stroke(255, 215, 0, 220);
  strokeWeight(3);
  rectMode(CENTER);
  rect(width / 2, height / 2, 580, 380, 15);

  textAlign(CENTER, CENTER);
  fill(255, 220, 80);
  textSize(34);
  text("🏆 PARABÉNS! 🏆", width / 2, height / 2 - 110);

  fill(255);
  textSize(22);
  text("Completou com sucesso todos os níveis!", width / 2, height / 2 - 50);

  textSize(16);
  fill(180, 230, 255);
  text("O recife de corais está totalmente limpo e restaurado.", width / 2, height / 2 - 15);

  fill(255, 215, 0);
  textSize(17);
  text(`Ganhaste ${moedasGanhasNaPartida} moedas nesta partida`, width / 2, height / 2 + 10);

  // Exibe o Tesouro Total Acumulado
  drawGoldCoin(width / 2 - 80, height / 2 + 45, 14);
  fill(255, 215, 0);
  textSize(22);
  text(`Tesouro Total: ${moedas} Moedas`, width / 2 + 20, height / 2 + 45);

  fill(saudeRecife < 50 ? color(255, 100, 100) : color(190, 230, 255));
  textSize(15);
  text(`Saúde do recife: ${saudeRecife.toFixed(0)}%`, width / 2, height / 2 + 72);
  if (saudeRecife < 50) {
    fill(255, 100, 100);
    textSize(14);
    text("Sem moedas neste nível: o recife ficou com menos de 50% de saúde.", width / 2, height / 2 + 94);
  }

  // Botão Voltar ao Menu Inicial
  rectMode(CORNER);
  let emCimaBtn = mouseX > width / 2 - 120 && mouseX < width / 2 + 120 && mouseY > 425 && mouseY < 475;
  
  fill(emCimaBtn ? color(60, 230, 150) : color(40, 180, 110));
  stroke(255);
  strokeWeight(2);
  rect(width / 2 - 120, 425, 240, 50, 10);

  fill(255);
  noStroke();
  textSize(18);
  text("🏠 Menu Inicial", width / 2, 450);
}

// ECRÃ DE SELEÇÃO DE NÍVEIS
function desenhaSelecaoNiveis() {
  desenhaFundoMarinho();

  fill(10, 35, 60, 220);
  stroke(80, 200, 240, 200);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height / 2, 680, 320, 15);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("SELEÇÃO DE NÍVEIS", width / 2, height / 2 - 110);

  fill(180, 220, 255);
  textSize(15);
  text("Escolha um nível desbloqueado para jogar e acumular moedas:", width / 2, height / 2 - 75);

  // Renderiza os 5 Cartões de Nível
  for (let i = 1; i <= totalNiveis; i++) {
    let bx = 160 + (i - 1) * 120;
    let by = height / 2 - 10;
    let desbloqueado = (i <= nivelMaximoDesbloqueado);

    let emCima = desbloqueado && (mouseX > bx - 45 && mouseX < bx + 45 && mouseY > by - 40 && mouseY < by + 40);

    // Fundo do botão
    rectMode(CENTER);
    if (desbloqueado) {
      fill(emCima ? color(60, 230, 150) : color(30, 150, 100));
      stroke(255);
    } else {
      fill(40, 50, 65, 180);
      stroke(90, 100, 115);
    }
    strokeWeight(2);
    rect(bx, by, 90, 80, 10);

    // Texto do Nível
    noStroke();
    fill(desbloqueado ? color(255) : color(140, 150, 165));
    textSize(22);
    text(`Nível ${i}`, bx, by - 12);

    // Ícone de estado
    textSize(16);
    if (desbloqueado) {
      fill(255, 220, 80);
      text("★", bx, by + 18);
    } else {
      fill(160);
      text("🔒", bx, by + 18);
    }
  }

  // Botão Voltar ao Menu
  rectMode(CORNER);
  let emCimaVoltar = mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > 460 && mouseY < 505;
  fill(emCimaVoltar ? color(70, 190, 240) : color(35, 130, 185));
  stroke(255);
  strokeWeight(2);
  rect(width / 2 - 100, 460, 200, 45, 10);

  noStroke();
  fill(255);
  textSize(16);
  text("← Voltar ao Menu", width / 2, 482);
}