// UI.js - Gestão de Interfaces, HUD, Medidores e Elementos Visuais do Fundo

// Desenha o Navio Naufragado e o Baú do Tesouro no fundo do mar
function desenhaNavioNaufragado() {
  push();
  // Casco do NavioAfundado (Lado esquerdo do fundo)
  fill(40, 25, 15);
  stroke(20, 10, 5);
  strokeWeight(2);
  
  // Estrutura inclinada do navio
  beginShape();
  vertex(50, 520);
  vertex(220, 500);
  vertex(260, 560);
  vertex(20, 570);
  endShape(CLOSE);

  // Mastro partido
  strokeWeight(6);
  stroke(35, 20, 10);
  line(120, 510, 90, 410);
  line(180, 505, 210, 430);

  // Baú do Tesouro junto ao navio (de onde saem as moedas do tesouro)
  rectMode(CORNER);
  fill(120, 85, 30);
  stroke(220, 180, 50);
  strokeWeight(2);
  rect(210, 530, 40, 25, 3);
  
  // Moedas de ouro a brilhar fora do baú
  fill(255, 215, 0);
  noStroke();
  ellipse(220, 528, 8, 8);
  ellipse(232, 526, 10, 10);
  ellipse(242, 529, 7, 7);
  
  pop();
}

function desenhaHUD() {
  // Barra Superior (Informações)
  fill(0, 40, 70, 200);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, width, 50);

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(16);
  text(`Nível: ${nivelAtual}`, 20, 25);
  text(`Tempo: ${ceil(tempoRestante)}s`, 120, 25);
  text(`Limpo: ${percentagemLimpa.toFixed(1)}%`, 240, 25);

  // Destaque para as Moedas do Tesouro
  drawMoedaTesouroIcone(375, 25, 12);
  fill(255, 220, 80);
  textSize(16);
  text(`Tesouro: ${moedas}`, 395, 25);

  // Indicador de Saúde do Recife
  fill(255);
  text(`Saúde do Recife: ${saudeRecife}%`, 540, 25);
}

// Ícone visual para as Moedas do Tesouro
function drawMoedaTesouroIcone(x, y, r) {
  push();
  stroke(180, 130, 20);
  strokeWeight(2);
  fill(255, 215, 0); // Ouro
  ellipse(x, y, r * 2, r * 2);
  
  // Detalhe interno da moeda antiga
  noStroke();
  fill(200, 150, 10);
  ellipse(x, y, r * 1.1, r * 1.1);
  pop();
}

// Medidor Vertical do Microfone (Canto Superior Direito)
function desenhaMedidorMicrofone(volAtual) {
  let x = width - 60;
  let y = 70;
  let alt = 250;
  let larg = 30;

  // Fundo do Medidor
  fill(20, 30, 40, 200);
  stroke(255, 150);
  strokeWeight(2);
  rectMode(CORNER);
  rect(x, y, larg, alt, 5);

  // Zona Ideal de Pressão (Faixa Verde)
  let yIdealMin = map(faixaIdealMax, 0, 1, y + alt, y);
  let yIdealMax = map(faixaIdealMin, 0, 1, y + alt, y);
  noStroke();
  fill(40, 220, 100, 150);
  rect(x, yIdealMin, larg, yIdealMax - yIdealMin);

  // Nível Atual de Volume (Preenchimento Azul/Amarelo/Vermelho)
  let altVolume = map(volAtual, 0, 1, 0, alt);
  altVolume = constrain(altVolume, 0, alt);

  if (volAtual < limiteMinimo) {
    fill(100, 150, 255); // Baixo
  } else if (volAtual >= faixaIdealMin && volAtual <= faixaIdealMax) {
    fill(50, 255, 120);  // Ideal
  } else {
    fill(255, 70, 70);   // Excessivo
  }

  rect(x, y + alt - altVolume, larg, altVolume, 3);

  // Marcadores de Limites (Linhas)
  stroke(255, 200, 0);
  strokeWeight(2);
  let yMin = map(limiteMinimo, 0, 1, y + alt, y);
  line(x - 5, yMin, x + larg + 5, yMin);

  // Rótulo
  noStroke();
  fill(255);
  textSize(11);
  textAlign(CENTER, TOP);
  text("Micro", x + larg / 2, y + alt + 8);
}