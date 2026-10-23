// Reef Cleaner - Principal com Níveis, Recompensas e Loja
// Sistemas Multimédia | ECGM | 2026-2027

let estado = "inicio"; // "inicio", "calibrando", "execucao", "fimNivel", "loja", "gameOver"

// Áudio e Calibração
let mic;
let tempoCalibracao = 3;
let cronometroCalib = 0;
let ruidoBase = 0;
let somaRuido = 0;
let amostrasRuido = 0;

// Limiares de Pressão
let limiteMinimo = 0.05;
let limiteMaximo = 0.60;
let faixaIdealMin = 0.15;
let faixaIdealMax = 0.35;

// Dados Globais de Progressão
let nivelAtual = 1;
let totalNiveis = 5;
let moedas = 0;
let tempoRestante = 60;
let tempoLimiteNivel = 60;
let percentagemLimpa = 0.0;
let saudeRecife = 100;
let cronometroJogo = 0;
let tempoPausadoNaLoja = 0;

// Upgrades da Loja
let upgradeLargo = 0;       // Aumenta o raio do jato
let upgradeTolerancia = 0;  // Alarga a faixa verde ideal

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
  } else if (estado === "fimNivel") {
    desenhaFimNivel();
  } else if (estado === "loja") {
    desenhaLoja();
  } else if (estado === "gameOver") {
    desenhaGameOver();
  }

  desenhaRodape();
}

function iniciaNivel(numNivel) {
  nivelAtual = numNivel;
  tempoLimiteNivel = max(40, 65 - nivelAtual * 5); // Menos tempo em níveis avançados
  tempoRestante = tempoLimiteNivel;
  percentagemLimpa = 0.0;

  // Mais manchas de sujidade à medida que o nível sobe
  let qtdSujidade = 10 + nivelAtual * 5;
  listaSujidade = geraSujidadeAleatoria(qtdSujidade);

  totalSujidadeInicial = 0;
  for (let m of listaSujidade) {
    totalSujidadeInicial += m.raioInicial;
  }

  cronometroJogo = millis();
  estado = "execucao";
}

function executaJogo() {
  let vol = mic.getLevel();

  // Gestão do Tempo
  let decorrido = (millis() - cronometroJogo) / 1000;
  tempoRestante = max(0, tempoLimiteNivel - decorrido);

  limpador.atualiza(vol);

  // Fundo Marinho
  desenhaFundoMarinho();

  // Tolerância aumentada pelos upgrades
  let tolMin = max(0.05, faixaIdealMin - upgradeTolerancia * 0.02);
  let tolMax = faixaIdealMax + upgradeTolerancia * 0.03;

  let raioJatoBase = map(vol, limiteMinimo, 1, 30, 90);
  let raioJato = raioJatoBase + (upgradeLargo * 12); // Upgrade de largura
  let dentroDaZonaIdeal = (vol >= tolMin && vol <= tolMax);

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

  // Atualiza percentagem limpa
  if (totalSujidadeInicial > 0) {
    let limpo = totalSujidadeInicial - sujidadeRestante;
    percentagemLimpa = constrain((limpo / totalSujidadeInicial) * 100, 0, 100);
  }

  limpador.desenha();

  desenhaHUD();
  desenhaMedidorMicrofone(vol);

  // Verificação de Fim de Nivel (Vitória ou Tempo Esgotado)
  if (percentagemLimpa >= 100) {
    concluiNivel(true);
  } else if (tempoRestante <= 0) {
    if (percentagemLimpa >= 70) {
      concluiNivel(true); // Passa com pelo menos 70% limpo
    } else {
      concluiNivel(false); // Derrota
    }
  }
}

function concluiNivel(sucesso) {
  if (sucesso) {
    // Recompensa de moedas proporcional à percentagem limpa e nível
    let moedasGanha = floor((percentagemLimpa / 10) * nivelAtual);
    moedas += moedasGanha;
    estado = "fimNivel";
  } else {
    estado = "gameOver";
  }
}

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

    iniciaNivel(1);
  }
}

function mousePressed() {
  if (estado === "inicio") {
    if (mouseX > width / 2 - 140 && mouseX < width / 2 + 140 &&
        mouseY > 410 - 28 && mouseY < 410 + 28) {
      userStartAudio();
      mic.start();
      somaRuido = 0;
      amostrasRuido = 0;
      cronometroCalib = millis();
      estado = "calibrando";
    }
  } else if (estado === "execucao") {
    // Clique no Botão "🛒 Loja" do HUD durante o jogo
    if (mouseX > 420 && mouseX < 510 && mouseY > 10 && mouseY < 40) {
      tempoPausadoNaLoja = millis(); // Regista o momento em que a loja foi aberta
      estado = "loja";
    }
  } else if (estado === "fimNivel") {
    if (mouseX > width / 2 - 210 && mouseX < width / 2 - 10 && mouseY > 400 && mouseY < 450) {
      tempoPausadoNaLoja = millis();
      estado = "loja";
    }
    if (mouseX > width / 2 + 10 && mouseX < width / 2 + 210 && mouseY > 400 && mouseY < 450) {
      if (nivelAtual < totalNiveis) {
        iniciaNivel(nivelAtual + 1);
      } else {
        estado = "inicio";
      }
    }
  } else if (estado === "loja") {
    // Upgrade 1: Jato Mais Largo (Preço: 15 moedas)
    if (mouseX > width / 2 - 240 && mouseX < width / 2 - 20 && mouseY > 330 && mouseY < 375) {
      if (moedas >= 15 && upgradeLargo < 3) {
        moedas -= 15;
        upgradeLargo++;
      }
    }
    // Upgrade 2: Tolerância de Pressão (Preço: 20 moedas)
    if (mouseX > width / 2 + 20 && mouseX < width / 2 + 240 && mouseY > 330 && mouseY < 375) {
      if (moedas >= 20 && upgradeTolerancia < 3) {
        moedas -= 20;
        upgradeTolerancia++;
      }
    }
    // Botão "Voltar ao Jogo"
    if (mouseX > width / 2 - 120 && mouseX < width / 2 + 120 && mouseY > 440 && mouseY < 490) {
      // Compensa o tempo passado dentro da loja para não penalizar o temporizador
      if (tempoPausadoNaLoja > 0) {
        let duracaoLoja = millis() - tempoPausadoNaLoja;
        cronometroJogo += duracaoLoja; 
        tempoPausadoNaLoja = 0;
      }
      
      // Se estivesse em jogo, regressa ao jogo; caso contrário avança de nível
      if (percentagemLimpa < 100 && tempoRestante > 0) {
        estado = "execucao";
      } else {
        iniciaNivel(nivelAtual < totalNiveis ? nivelAtual + 1 : 1);
      }
    }
  } else if (estado === "gameOver") {
    if (mouseX > width / 2 - 130 && mouseX < width / 2 + 130 && mouseY > 380 && mouseY < 430) {
      iniciaNivel(nivelAtual);
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