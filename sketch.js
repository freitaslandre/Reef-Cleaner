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
let moedasGanhasNaPartida = 0;
let cronometroJogo = 0;
let tempoPausadoNaLoja = 0;
let nivelMaximoDesbloqueado = 1; // Controla o progresso máximo já atingido
let tabelaRecompensasAberta = false;

// Upgrades da Loja
let upgradeLargo = 0;       // Aumenta o raio do jato
let upgradeTolerancia = 0;  // Alarga a faixa verde ideal
let estadoAnteriorLoja = "execucao"; // Guarda se veio de "execucao" ou "fimNivel"
const precosUpgradeLargo = [20, 45, 80, 130, 200];
const precosUpgradeTolerancia = [25, 55, 95, 150, 220];

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
  } else if (estado === "selecaoNiveis") {
    desenhaSelecaoNiveis();
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
  saudeRecife = 100;
  moedasGanhasNaPartida = 0;
  tabelaRecompensasAberta = false;

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
  if (tabelaRecompensasAberta) {
    cronometroJogo += deltaTime;
  } else {
    let decorrido = (millis() - cronometroJogo) / 1000;
    tempoRestante = max(0, tempoLimiteNivel - decorrido);
  }

  limpador.atualiza(vol);

  // Fundo Marinho
  desenhaFundoMarinho();

  // Tolerância aumentada pelos upgrades
  let tolMin = max(0.05, faixaIdealMin - upgradeTolerancia * 0.02);
  let tolMax = faixaIdealMax + upgradeTolerancia * 0.03;

  let raioJatoBase = map(vol, limiteMinimo, 1, 30, 90);
  let raioJato = raioJatoBase + (upgradeLargo * 12); // Upgrade de largura
  let dentroDaZonaIdeal = (vol >= tolMin && vol <= tolMax);
  let pressaoExcessiva = vol >= limiteMinimo && vol > tolMax;

  let sujidadeRestante = 0;

  for (let m of listaSujidade) {
    if (!tabelaRecompensasAberta && vol >= limiteMinimo && !pressaoExcessiva) {
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

  if (!tabelaRecompensasAberta && pressaoExcessiva) {
    saudeRecife = max(0, saudeRecife - 12 * deltaTime / 1000);
  }

  limpador.desenha(tolMin, tolMax);

  desenhaHUD();
  desenhaMedidorMicrofone(vol);
  if (pressaoExcessiva && !tabelaRecompensasAberta) {
    desenhaAvisoPressaoExcessiva();
  }
  if (tabelaRecompensasAberta) {
    desenhaModalRecompensas();
  }

  // Verificação de Fim de Nível (Exige 100% para Vitória)
  if (!tabelaRecompensasAberta && percentagemLimpa >= 100) {
    concluiNivel(true);
  } else if (!tabelaRecompensasAberta && tempoRestante <= 0) {
    concluiNivel(false); // Tempo esgotado sem atingir 100% = Derrota
  }
}

function concluiNivel(sucesso) {
  moedasGanhasNaPartida = 0;
  if (saudeRecife >= 50) {
    if (percentagemLimpa >= 100) {
      moedasGanhasNaPartida = 30 * nivelAtual;
    } else if (percentagemLimpa >= 90) {
      moedasGanhasNaPartida = 15 * nivelAtual;
    } else if (percentagemLimpa >= 75) {
      moedasGanhasNaPartida = 10 * nivelAtual;
    }
  }
  moedas += moedasGanhasNaPartida;

  if (sucesso) {
    // Se completou o nível atual a 100%, desbloqueia o nível seguinte
    if (nivelAtual < totalNiveis) {
      if (nivelAtual + 1 > nivelMaximoDesbloqueado) {
        nivelMaximoDesbloqueado = nivelAtual + 1;
      }
      estado = "fimNivel";
    } else {
      // Se concluiu o último nível (Nível 5) a 100%
      estado = "vitoriaFinal";
    }
  } else {
    estado = "gameOver";
  }
}

// Restaura o estado global do jogo para um novo começo
// Restaura o estado global do jogo para um novo começo (Nível 1 de raiz)
function resetaJogoCompleto() {
  nivelAtual = 1;
  nivelMaximoDesbloqueado = 1; // Voltar a ter apenas o Nível 1 desbloqueado
  moedas = 0;
  upgradeLargo = 0;
  upgradeTolerancia = 0;
  percentagemLimpa = 0.0;
  saudeRecife = 100;
  moedasGanhasNaPartida = 0;
  tabelaRecompensasAberta = false;
  tempoLimiteNivel = 60;
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
    // Botão "Calibrar e Jogar"
    if (mouseX > width / 2 - 140 && mouseX < width / 2 + 140 &&
        mouseY > 385 && mouseY < 435) {
      userStartAudio();
      mic.start();
      somaRuido = 0;
      amostrasRuido = 0;
      cronometroCalib = millis();
      estado = "calibrando";
    }
    // Botão "🗺 Escolher Nível" (só fica ativo se já desbloqueaste mais de 1 nível)
    if (nivelMaximoDesbloqueado > 1 && 
        mouseX > width / 2 - 140 && mouseX < width / 2 + 140 && 
        mouseY > 450 && mouseY < 495) {
      estado = "selecaoNiveis";
    }

  } else if (estado === "selecaoNiveis") {
    // Seleção dos Níveis 1 a 5
    for (let i = 1; i <= totalNiveis; i++) {
      let bx = 160 + (i - 1) * 120;
      let by = height / 2 - 10;
      
      // Deteta o clique em cada cartão de nível
      if (mouseX > bx - 45 && mouseX < bx + 45 && mouseY > by - 40 && mouseY < by + 40) {
        if (i <= nivelMaximoDesbloqueado) {
          userStartAudio();
          mic.start();
          iniciaNivel(i); // Inicia o nível escolhido
        }
      }
    }
    // Botão "← Voltar ao Menu"
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > 460 && mouseY < 505) {
      estado = "inicio";
    }

  } else if (estado === "execucao") {
    if (tabelaRecompensasAberta) {
      if (mouseX > width / 2 + 150 && mouseX < width / 2 + 190 &&
          mouseY > height / 2 - 150 && mouseY < height / 2 - 110) {
        tabelaRecompensasAberta = false;
      }
      return;
    }

    // Clique no botão "🛒 Loja" do HUD
    if (mouseX > 420 && mouseX < 500 && mouseY > 10 && mouseY < 40) {
      tempoPausadoNaLoja = millis();
      estadoAnteriorLoja = "execucao";
      estado = "loja";
    }

    // Clique no botão "🗺 Níveis" do HUD (Voltar à seleção sem perder moedas/upgrades)
    if (mouseX > 505 && mouseX < 585 && mouseY > 10 && mouseY < 40) {
      percentagemLimpa = 0.0; // Reinicia a contagem de limpeza do nível atual
      estado = "selecaoNiveis";
    }
    if (mouseX > 590 && mouseX < 710 && mouseY > 10 && mouseY < 40) {
      tabelaRecompensasAberta = true;
    }

  } else if (estado === "fimNivel") {
    // Ir para a Loja a partir do ecrã de resultados
    if (mouseX > width / 2 - 210 && mouseX < width / 2 - 10 && mouseY > 410 && mouseY < 460) {
      estadoAnteriorLoja = "fimNivel";
      estado = "loja";
    }
    // Botão "🗺 Escolher Nível"
    if (mouseX > width / 2 + 10 && mouseX < width / 2 + 210 && mouseY > 410 && mouseY < 460) {
      estado = "selecaoNiveis";
    }

  } else if (estado === "loja") {
    // Upgrade 1: Jato Mais Largo
    if (mouseX > width / 2 - 240 && mouseX < width / 2 - 20 && mouseY > 365 && mouseY < 405) {
      let preco = precosUpgradeLargo[upgradeLargo];
      if (upgradeLargo < precosUpgradeLargo.length && moedas >= preco) {
        moedas -= preco;
        upgradeLargo++;
      }
    }
    // Upgrade 2: Tolerância de Pressão
    if (mouseX > width / 2 + 20 && mouseX < width / 2 + 240 && mouseY > 365 && mouseY < 405) {
      let preco = precosUpgradeTolerancia[upgradeTolerancia];
      if (upgradeTolerancia < precosUpgradeTolerancia.length && moedas >= preco) {
        moedas -= preco;
        upgradeTolerancia++;
      }
    }
    // Botão de Saída da Loja
    if (mouseX > width / 2 - 120 && mouseX < width / 2 + 120 && mouseY > 435 && mouseY < 480) {
      if (estadoAnteriorLoja === "execucao") {
        // Regressa à partida em curso e repõe o temporizador
        if (tempoPausadoNaLoja > 0) {
          let duracaoLoja = millis() - tempoPausadoNaLoja;
          cronometroJogo += duracaoLoja;
          tempoPausadoNaLoja = 0;
        }
        estado = "execucao";
      } else {
        // Regressa ao ecrã de Fim de Nível
        estado = "fimNivel";
      }
    }

  } else if (estado === "gameOver") {
    // Tentar Novamente no mesmo nível
    if (mouseX > width / 2 - 130 && mouseX < width / 2 + 130 && mouseY > 370 && mouseY < 420) {
      iniciaNivel(nivelAtual);
    }
    if (mouseX > width / 2 - 130 && mouseX < width / 2 + 130 && mouseY > 430 && mouseY < 480) {
      estado = "selecaoNiveis";
    }

  } else if (estado === "vitoriaFinal") {
    // Clique no Botão "🏠 Menu Inicial"
    if (mouseX > width / 2 - 120 && mouseX < width / 2 + 120 && mouseY > 425 && mouseY < 475) {
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