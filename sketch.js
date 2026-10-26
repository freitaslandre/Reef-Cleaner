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
let estadoAnteriorLoja = "execucao"; // Guarda se veio de "execucao" ou "fimNivel"

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
  } else if (estado === "vitoriaFinal") {
    desenhaVitoriaFinal();
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

  // Aumenta a quantidade e o tamanho inicial das manchas de sujidade
  listaSujidade = [];
  let qtdSujidade = 14 + nivelAtual * 6; // Anteriormente 10 + nivelAtual * 5
  listaSujidade = geraSujidadeAleatoria(qtdSujidade);

  // Recalcula o total inicial exato das novas manchas
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
      // Passa o nivelAtual para aumentar a resistência da sujidade nos níveis avançados
      m.limpar(mouseX, mouseY, raioJato, dentroDaZonaIdeal, nivelAtual);
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
    let moedasGanha = floor((percentagemLimpa / 10) * nivelAtual);
    moedas += moedasGanha;

    // Se concluiu o último nível, vai para o ecrã especial de vitória final
    if (nivelAtual >= totalNiveis) {
      estado = "vitoriaFinal";
    } else {
      estado = "fimNivel";
    }
  } else {
    estado = "gameOver";
  }
}

// Restaura o estado global do jogo para um novo começo
// Restaura o estado global do jogo para um novo começo (Nível 1 de raiz)
function resetaJogoCompleto() {
  nivelAtual = 1;
  moedas = 0;
  upgradeLargo = 0;
  upgradeTolerancia = 0;
  percentagemLimpa = 0.0;
  tempoLimiteNivel = 60; // Repõe o tempo inicial para 60 segundos
  tempoRestante = 60;
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

    resetaJogoCompleto(); // Garante moedas=0 e upgrades=0 no arranque
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
    // Clique no botão "🛒 Loja" do HUD durante o jogo
    if (mouseX > 420 && mouseX < 510 && mouseY > 10 && mouseY < 40) {
      tempoPausadoNaLoja = millis();
      estadoAnteriorLoja = "execucao";
      estado = "loja";
    }
  } else if (estado === "fimNivel") {
    // Ir para a Loja
    if (mouseX > width / 2 - 210 && mouseX < width / 2 - 10 && mouseY > 400 && mouseY < 450) {
      estadoAnteriorLoja = "fimNivel";
      estado = "loja";
    }
    // Botão "Próximo Nível" / "Menu Inicial"
    if (mouseX > width / 2 + 10 && mouseX < width / 2 + 210 && mouseY > 400 && mouseY < 450) {
      if (nivelAtual < totalNiveis) {
        iniciaNivel(nivelAtual + 1);
      } else {
        resetaJogoCompleto();
        estado = "inicio";
      }
    }
  } else if (estado === "loja") {
    // Upgrade 1: Jato Mais Largo (15 moedas)
    if (mouseX > width / 2 - 240 && mouseX < width / 2 - 20 && mouseY > 330 && mouseY < 375) {
      if (moedas >= 15 && upgradeLargo < 3) {
        moedas -= 15;
        upgradeLargo++;
      }
    }
    // Upgrade 2: Tolerância de Pressão (20 moedas)
    if (mouseX > width / 2 + 20 && mouseX < width / 2 + 240 && mouseY > 330 && mouseY < 375) {
      if (moedas >= 20 && upgradeTolerancia < 3) {
        moedas -= 20;
        upgradeTolerancia++;
      }
    }
    // Botão de Saída da Loja
    if (mouseX > width / 2 - 120 && mouseX < width / 2 + 120 && mouseY > 440 && mouseY < 490) {
      if (estadoAnteriorLoja === "execucao") {
        // Regressa à partida em curso e repõe o temporizador
        if (tempoPausadoNaLoja > 0) {
          let duracaoLoja = millis() - tempoPausadoNaLoja;
          cronometroJogo += duracaoLoja;
          tempoPausadoNaLoja = 0;
        }
        estado = "execucao";
      } else {
        // Regressa ao ecrã de Fim de Nível sem iniciar o próximo nível automaticamente
        estado = "fimNivel";
      }
    }
  } else if (estado === "gameOver") {
    if (mouseX > width / 2 - 130 && mouseX < width / 2 + 130 && mouseY > 380 && mouseY < 430) {
      iniciaNivel(nivelAtual);
    }
  } else if (estado === "vitoriaFinal") {
    // Clique no Botão "🏠 Menu Inicial"
    if (mouseX > width / 2 - 120 && mouseX < width / 2 + 120 && mouseY > 410 && mouseY < 460) {
      resetaJogoCompleto();
      estado = "inicio";
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