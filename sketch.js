// Reef Cleaner - Principal
// Sistemas Multimédia | ECGM | 2026-2027

let estado = "inicio";

// Áudio
let mic;
let tempoCalibracao = 3;
let cronometroCalib = 0;
let ruidoBase = 0;
let somaRuido = 0;
let amostrasRuido = 0;

// Limiares
let limiteMinimo = 0.05;
let limiteMaximo = 0.60;
let faixaIdealMin = 0.15;
let faixaIdealMax = 0.35;

// Dados de Jogo
let nivelAtual = 1;
let moedas = 0;
let tempoRestante = 60;
let percentagemLimpa = 0.0;
let saudeRecife = 100;
let cronometroJogo = 0;

// Objetos e Listas
let limpador;
let listaSujidade = [];
let totalSujidadeInicial = 0;

function setup() {
  createCanvas(800, 600);
  mic = new p5.AudioIn();
  limpador = new Limpador();
}

function draw() {
  background(20, 90, 120);

  if (estado === "inicio") {
    desenhaInicio();
  } else if (estado === "calibrando") {
    processaCalibracao();
  } else if (estado === "execucao") {
    executaJogo();
  }

  desenhaRodape();
}

function executaJogo() {
  let vol = mic.getLevel();

  // Gestão do Tempo
  let decorrido = (millis() - cronometroJogo) / 1000;
  tempoRestante = max(0, 60 - decorrido);

  limpador.atualiza(vol);

  // Desenha o novo Fundo Marinho Claro e Iluminado
  desenhaFundoMarinho();

  // Lógica de Limpeza das Manchas
  let raioJato = map(vol, limiteMinimo, 1, 30, 90);
  let dentroDaZonaIdeal = (vol >= faixaIdealMin && vol <= faixaIdealMax);

  let sujidadeRestante = 0;

  for (let m of listaSujidade) {
    if (vol >= limiteMinimo) {
      m.limpar(mouseX, mouseY, raioJato, dentroDaZonaIdeal);
    }
    m.desenhar();
    
    if (!m.limpa) {
      sujidadeRestante += m.raioAtual;
    }
  }

  if (totalSujidadeInicial > 0) {
    let limpo = totalSujidadeInicial - sujidadeRestante;
    percentagemLimpa = constrain((limpo / totalSujidadeInicial) * 100, 0, 100);
  }

  limpador.desenha();

  desenhaHUD();
  desenhaMedidorMicrofone(vol);
}

function processaCalibracao() {
  let volumeAtual = mic.getLevel();
  somaRuido += volumeAtual;
  amostrasRuido++;

  let tempoDecorrido = (millis() - cronometroCalib) / 1000;
  let restante = max(0, tempoCalibracao - tempoDecorrido);

  fill(0, 50, 80, 200);
  rectMode(CENTER);
  rect(width / 2, height / 2, 500, 250, 10);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Calibrando o som ambiente...", width / 2, height / 2 - 60);

  textSize(48);
  fill(255, 220, 100);
  text(restante.toFixed(1) + "s", width / 2, height / 2 + 20);

  if (tempoDecorrido >= tempoCalibracao) {
    ruidoBase = somaRuido / amostrasRuido;
    limiteMinimo = max(0.03, ruidoBase * 1.8);
    faixaIdealMin = limiteMinimo + 0.08;
    faixaIdealMax = limiteMinimo + 0.28;

    // Inicia jogo e gera sujidade aleatória
    listaSujidade = geraSujidadeAleatoria(15);
    totalSujidadeInicial = 0;
    for (let m of listaSujidade) {
      totalSujidadeInicial += m.raioInicial;
    }

    cronometroJogo = millis();
    estado = "execucao";
  }
}

function desenhaInicio() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(42);
  text("REEF CLEANER", width / 2, 80);

  fill(0, 50, 80, 180);
  rectMode(CENTER);
  rect(width / 2, 230, 600, 180, 10);

  fill(255);
  textSize(16);
  text("Objetivo: Limpar algas e sedimentos em 60s sem danificar o recife.", width / 2, 170);
  text("Controlo: Rato move o limpador | Voz/Sopro ajusta a pressão do jato.", width / 2, 200);
  text("Recolha moedas do tesouro do navio e melhore a sua ferramenta!", width / 2, 230);

  fill(40, 160, 120);
  rect(width / 2, 380, 260, 50, 8);
  fill(255);
  textSize(18);
  text("Calibrar e Jogar (3s)", width / 2, 380);
}

function mousePressed() {
  if (estado === "inicio") {
    // Área do botão verde em Y = 410 (largura 280, altura 56)
    if (mouseX > width / 2 - 140 && mouseX < width / 2 + 140 &&
        mouseY > 410 - 28 && mouseY < 410 + 28) {
      
      userStartAudio();
      mic.start();
      somaRuido = 0;
      amostrasRuido = 0;
      cronometroCalib = millis();
      estado = "calibrando";
    }
  }
}

function desenhaRodape() {
  rectMode(CORNER);
  fill(255);
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text("Coral Reef Restoration", 10, height - 10);
  textAlign(RIGHT, BOTTOM);
  text("André Freitas · 33782 · ECGM", width - 10, height - 10);
}