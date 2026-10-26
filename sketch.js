// Mantém o estado que determina o ecrã atualmente apresentado.

let estado = "inicio"; // Identifica o menu, a calibração, a partida ou um ecrã de resultado.

// Guarda o microfone e os dados usados para calibrar e reproduzir os sons do jogo.
let mic;
let tempoCalibracao = 3;
let cronometroCalib = 0;
let ruidoBase = 0;
let somaRuido = 0;
let amostrasRuido = 0;
let avisoCalibracao = "";
let origemCalibracao = "jogar";
let notaMusica;
let notaBaixo;
let filtroMusica;
let filtroBaixo;
let somJato;
let filtroJato;
let somFeedback;
let filtroFeedback;
let audioAmbienteIniciado = false;
let jatoSonoroAtivo = false;
let inicioMusica = 0;
let passoMusicaAtual = -1;
let filaFeedback = [];
let indiceFeedback = 0;
let proximoFeedbackEm = 0;

// Define o limiar mínimo do jato e os limites iniciais da faixa de pressão ideal.
let limiteMinimo = 0.05;
let faixaIdealMin = 0.15;
let faixaIdealMax = 0.35;

// Guarda o nível, os recursos, o tempo, a saúde e a limpeza da partida atual.
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
let origemSelecaoNiveis = "menu";
let tempoPausadoNaSelecao = 0;

// Regista os níveis comprados e o preço de cada melhoria disponível.
let upgradeLargo = 0;       // Aumenta o raio do jato
let upgradeTolerancia = 0;  // Alarga a faixa verde ideal
let estadoAnteriorLoja = "execucao"; // Guarda se veio de "execucao" ou "fimNivel"
const precosUpgradeLargo = [20, 45, 80, 130, 200];
const precosUpgradeTolerancia = [25, 55, 95, 150, 220];

// Mantém a ferramenta do jogador e as manchas de sujidade do nível.
let limpador;
let listaSujidade = [];
let totalSujidadeInicial = 0;

// Cria o canvas, o microfone, a ferramenta e as fontes de áudio filtradas.
function setup() {
  createCanvas(800, 600);
  mic = new p5.AudioIn();
  limpador = new Limpador();

  // Cria a melodia principal e limita as suas frequências mais agudas.
  notaMusica = new p5.Oscillator("sine");
  filtroMusica = new p5.LowPass();
  filtroMusica.process(notaMusica, 1500);
  notaMusica.amp(0);

  // Cria a linha de baixo e limita as suas frequências mais agudas.
  notaBaixo = new p5.Oscillator("sine");
  filtroBaixo = new p5.LowPass();
  filtroBaixo.process(notaBaixo, 450);
  notaBaixo.amp(0);

  // Cria o ruído filtrado que acompanha o jato enquanto está ativo.
  somJato = new p5.Noise("pink");
  filtroJato = new p5.LowPass();
  filtroJato.process(somJato, 850);
  somJato.amp(0);

  // Cria o oscilador usado nos sons de limpeza, vitória e derrota.
  somFeedback = new p5.Oscillator("triangle");
  filtroFeedback = new p5.LowPass();
  filtroFeedback.process(somFeedback, 1800);
  somFeedback.amp(0);

  // Inicia as fontes silenciosas e aguarda uma interação para desbloquear o áudio.
  iniciaFontesAudio();
  document.addEventListener("pointerdown", ativaAudioJogo, { once: true });
}

// Desenha o estado atual e atualiza os sons e elementos persistentes em cada frame.
function draw() {
  background(20, 90, 120);

  // Chama o desenho ou a atualização correspondente ao estado atual.
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

  // Desliga o jato fora da partida e mantém a música, os efeitos e o rodapé atualizados.
  if (estado !== "execucao") {
    atualizaSomJato(false);
  }
  atualizaMusicaFundo();
  processaFeedbackAudio();
  desenhaRodape();
}

// Solicita ao browser a ativação do áudio e garante que as fontes foram iniciadas.
function ativaAudioJogo() {
  userStartAudio();
  iniciaFontesAudio();
}

// Inicia cada fonte sonora uma única vez e guarda o instante inicial da música.
function iniciaFontesAudio() {
  if (!audioAmbienteIniciado) {
    notaMusica.start();
    notaBaixo.start();
    somJato.start();
    somFeedback.start();
    inicioMusica = millis();
    audioAmbienteIniciado = true;
  }
}

// Avança a melodia e o baixo de acordo com o tempo decorrido desde o início.
function atualizaMusicaFundo() {
  if (!audioAmbienteIniciado) return;

  const melodia = [659.25, 0, 783.99, 987.77, 0, 783.99, 659.25, 523.25,
    587.33, 0, 659.25, 783.99, 0, 659.25, 587.33, 523.25];
  const baixos = [196, 0, 0, 0, 146.83, 0, 0, 0, 164.81, 0, 0, 0, 130.81, 0, 0, 0];
  const duracaoPasso = 360;
  const passo = floor((millis() - inicioMusica) / duracaoPasso) % melodia.length;
  if (passo === passoMusicaAtual) return;

  passoMusicaAtual = passo;
  let frequencia = melodia[passo];
  if (frequencia > 0) {
    notaMusica.freq(frequencia, 0.04);
    notaMusica.amp(0.075, 0.035);
  } else {
    notaMusica.amp(0, 0.06);
  }

  if (passo % 4 === 0) {
    notaBaixo.freq(baixos[passo], 0.08);
    notaBaixo.amp(0.045, 0.08);
  }
}

// Altera o volume do ruído do jato apenas quando o estado ativo muda.
function atualizaSomJato(ativo) {
  if (!audioAmbienteIniciado || ativo === jatoSonoroAtivo) return;

  somJato.amp(ativo ? 0.035 : 0, ativo ? 0.12 : 0.2);
  jatoSonoroAtivo = ativo;
}

// Substitui a sequência de notas pendente e agenda a primeira nota.
function tocaSequenciaFeedback(notas) {
  if (!audioAmbienteIniciado) return;
  filaFeedback = notas;
  indiceFeedback = 0;
  proximoFeedbackEm = millis();
}

// Toca as notas de feedback na ordem e no instante definidos por cada nota.
function processaFeedbackAudio() {
  if (!audioAmbienteIniciado || filaFeedback.length === 0) return;
  if (millis() < proximoFeedbackEm) return;

  if (indiceFeedback >= filaFeedback.length) {
    somFeedback.amp(0, 0.12);
    filaFeedback = [];
    return;
  }

  let nota = filaFeedback[indiceFeedback++];
  if (nota.frequencia > 0) {
    somFeedback.freq(nota.frequencia, 0.015);
    somFeedback.amp(nota.volume, 0.015);
  } else {
    somFeedback.amp(0, 0.015);
  }
  proximoFeedbackEm = millis() + nota.duracao;
}

// Toca uma sequência ascendente quando todas as manchas de um coral desaparecem.
function tocaSomCoralLimpo() {
  tocaSequenciaFeedback([
    { frequencia: 880, duracao: 75, volume: 0.08 },
    { frequencia: 1174.66, duracao: 85, volume: 0.07 },
    { frequencia: 1567.98, duracao: 150, volume: 0.06 }
  ]);
}

// Toca uma sequência de vitória ou de derrota conforme o resultado do nível.
function tocaSomNivelConcluido(sucesso) {
  if (sucesso) {
    tocaSequenciaFeedback([
      { frequencia: 523.25, duracao: 120, volume: 0.09 },
      { frequencia: 659.25, duracao: 120, volume: 0.09 },
      { frequencia: 783.99, duracao: 120, volume: 0.09 },
      { frequencia: 1046.5, duracao: 260, volume: 0.085 }
    ]);
  } else {
    tocaSequenciaFeedback([
      { frequencia: 392, duracao: 150, volume: 0.07 },
      { frequencia: 311.13, duracao: 160, volume: 0.07 },
      { frequencia: 233.08, duracao: 260, volume: 0.06 }
    ]);
  }
}

// Inicializa os dados de um nível, gera a sujidade e inicia o cronómetro.
function iniciaNivel(numNivel) {
  nivelAtual = numNivel;
  tempoLimiteNivel = max(40, 65 - nivelAtual * 5);
  tempoRestante = tempoLimiteNivel;
  percentagemLimpa = 0.0;
  saudeRecife = 100;
  moedasGanhasNaPartida = 0;
  tabelaRecompensasAberta = false;

  // Gera as manchas que serão distribuídas pelos corais neste nível.
  listaSujidade = [];
  let qtdSujidade = 14 + nivelAtual * 6;
  listaSujidade = geraSujidadeAleatoria(qtdSujidade);

  // Soma os raios iniciais para calcular a percentagem limpa durante a partida.
  totalSujidadeInicial = 0;
  for (let m of listaSujidade) {
    totalSujidadeInicial += m.raioInicial;
  }

  cronometroJogo = millis();
  estado = "execucao";
}

// Atualiza o tempo, a limpeza, a saúde, os sons e o HUD durante a partida.
function executaJogo() {
  let vol = mic.getLevel();

  // Mantém o tempo restante parado enquanto o modal de recompensas está aberto.
  if (tabelaRecompensasAberta) {
    cronometroJogo += deltaTime;
  } else {
    let decorrido = (millis() - cronometroJogo) / 1000;
    tempoRestante = max(0, tempoLimiteNivel - decorrido);
  }

  limpador.atualiza(vol);

  // Desenha o cenário atrás dos elementos da partida.
  desenhaFundoMarinho();

  // Ajusta os limites ideais de pressão com base no nível do upgrade de tolerância.
  let tolMin = max(0.05, faixaIdealMin - upgradeTolerancia * 0.02);
  let tolMax = min(1, faixaIdealMax + upgradeTolerancia * 0.03);

  let raioJatoBase = map(vol, limiteMinimo, 1, 30, 90);
  let raioJato = raioJatoBase + (upgradeLargo * 12);
  let dentroDaZonaIdeal = (vol >= tolMin && vol <= tolMax);
  let pressaoExcessiva = vol >= limiteMinimo && vol > tolMax;

  let sujidadeRestante = 0;
  let coraisSujosAntes = posicoesCorais.map((_, idCoral) =>
    listaSujidade.some(m => m.idCoral === idCoral && !m.limpa)
  );

  // Aplica a limpeza apenas se o jato estiver ativo, não estiver em sobrepressão e o modal estiver fechado.
  for (let m of listaSujidade) {
    if (!tabelaRecompensasAberta && vol >= limiteMinimo && !pressaoExcessiva) {
      m.limpar(mouseX, mouseY, raioJato, dentroDaZonaIdeal, nivelAtual);
    }
    m.desenhar();

    if (!m.limpa) {
      sujidadeRestante += m.raioAtual;
    }
  }

  // Toca o efeito sonoro uma vez quando cada coral fica sem manchas.
  for (let i = 0; i < coraisSujosAntes.length; i++) {
    let aindaSujo = listaSujidade.some(m => m.idCoral === i && !m.limpa);
    if (coraisSujosAntes[i] && !aindaSujo) {
      tocaSomCoralLimpo();
    }
  }

  // Calcula a percentagem limpa a partir dos raios de sujidade restantes.
  if (totalSujidadeInicial > 0) {
    let limpo = totalSujidadeInicial - sujidadeRestante;
    percentagemLimpa = constrain((limpo / totalSujidadeInicial) * 100, 0, 100);
  }

  if (!tabelaRecompensasAberta && pressaoExcessiva) {
    saudeRecife = max(0, saudeRecife - 4.5 * deltaTime / 1000);
  }
  // Mantém o efeito do jato ligado em qualquer pressão acima do limiar mínimo.
  atualizaSomJato(!tabelaRecompensasAberta && vol >= limiteMinimo);

  // Desenha a ferramenta, o HUD, o medidor e os avisos da partida.
  limpador.desenha(tolMin, tolMax, raioJato);

  desenhaHUD();
  desenhaMedidorMicrofone(vol, tolMin, tolMax);
  if (pressaoExcessiva && !tabelaRecompensasAberta) {
    desenhaAvisoPressaoExcessiva();
  }
  if (tabelaRecompensasAberta) {
    desenhaModalRecompensas();
  }

  // Conclui o nível ao limpar tudo ou quando o tempo se esgota.
  if (!tabelaRecompensasAberta && percentagemLimpa >= 100) {
    concluiNivel(true);
  } else if (!tabelaRecompensasAberta && tempoRestante <= 0) {
    concluiNivel(false);
  }
}

// Calcula e atribui a recompensa e atualiza o estado de progressão do jogo.
function concluiNivel(sucesso) {
  tocaSomNivelConcluido(sucesso);
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
    // Desbloqueia o nível seguinte ou apresenta a vitória ao concluir o último.
    if (nivelAtual < totalNiveis) {
      if (nivelAtual + 1 > nivelMaximoDesbloqueado) {
        nivelMaximoDesbloqueado = nivelAtual + 1;
      }
      estado = "fimNivel";
    } else {
      estado = "vitoriaFinal";
    }
  } else {
    estado = "gameOver";
  }
}

// Repõe o nível, as moedas, os upgrades e os resultados para uma nova partida.
function resetaJogoCompleto() {
  nivelAtual = 1;
  nivelMaximoDesbloqueado = 1;
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

// Mede o ruído ambiente durante três segundos e desenha o progresso da calibração.
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

  // Converte o tempo decorrido na largura preenchida da barra de progresso.
  let progresso = map(tempoDecorrido, 0, tempoCalibracao, 0, 400);
  progresso = constrain(progresso, 0, 400);

  fill(20, 60, 90);
  rect(width / 2, height / 2 + 80, 400, 16, 8);

  fill(50, 220, 130);
  rectMode(CORNER);
  rect(width / 2 - 200, height / 2 + 72, progresso, 16, 8);

  if (tempoDecorrido >= tempoCalibracao) {
    guardaCalibracao(somaRuido / amostrasRuido);
    if (origemCalibracao === "recalibrar") {
      estado = "inicio";
    } else {
      iniciaNivel(1);
    }
  }
}

// Converte o ruído medido nos limites mínimo e ideal do microfone.
function aplicaCalibracao(valor) {
  ruidoBase = valor;
  limiteMinimo = max(0.03, ruidoBase * 1.8);
  faixaIdealMin = limiteMinimo + 0.08;
  faixaIdealMax = limiteMinimo + 0.28;
}

// Aplica e guarda a calibração no armazenamento local do browser.
function guardaCalibracao(valor) {
  aplicaCalibracao(valor);
  try {
    localStorage.setItem("calibracaoRuido", String(valor));
    avisoCalibracao = "";
  } catch (erro) {
    avisoCalibracao = "Não foi possível guardar a calibração neste browser.";
    console.error("Falha ao guardar calibracaoRuido no localStorage:", erro);
  }
}

// Lê e valida a calibração guardada antes de a aplicar ao jogo.
function carregaCalibracao() {
  let valorGuardado;
  try {
    valorGuardado = localStorage.getItem("calibracaoRuido");
  } catch (erro) {
    avisoCalibracao = "Não foi possível ler a calibração guardada; será feita uma nova.";
    console.error("Falha ao ler calibracaoRuido do localStorage:", erro);
    return false;
  }

  if (valorGuardado === null) return false;

  let valor = Number(valorGuardado);
  if (!Number.isFinite(valor) || valor < 0 || valor > 1) {
    avisoCalibracao = "A calibração guardada é inválida; será feita uma nova.";
    return false;
  }

  avisoCalibracao = "";
  aplicaCalibracao(valor);
  return true;
}

// Inicia a calibração manual e define o ecrã de regresso após a contagem.
function iniciaCalibracao() {
  ativaAudioJogo();
  mic.start();
  somaRuido = 0;
  amostrasRuido = 0;
  cronometroCalib = millis();
  origemCalibracao = "recalibrar";
  estado = "calibrando";
}

// Direciona os cliques para os botões disponíveis no estado atual.
function mousePressed() {
  if (estado === "inicio") {
    // Inicia o jogo com a calibração guardada ou começa uma nova medição.
    if (mouseX > width / 2 - 140 && mouseX < width / 2 + 140 &&
        mouseY > 385 && mouseY < 435) {
      ativaAudioJogo();
      mic.start();
      if (carregaCalibracao()) {
        iniciaNivel(1);
      } else {
        somaRuido = 0;
        amostrasRuido = 0;
        cronometroCalib = millis();
        origemCalibracao = "jogar";
        estado = "calibrando";
      }
    }

    // Inicia a calibração manual a partir do menu.
    if (mouseX > width / 2 - 180 && mouseX < width / 2 - 10 &&
        mouseY > 440 && mouseY < 480) {
      iniciaCalibracao();
    }
    // Abre a seleção de níveis quando existe pelo menos um nível desbloqueado.
    if (nivelMaximoDesbloqueado > 1 && 
        mouseX > width / 2 + 10 && mouseX < width / 2 + 180 && 
        mouseY > 440 && mouseY < 480) {
      origemSelecaoNiveis = "menu";
      estado = "selecaoNiveis";
    }

  } else if (estado === "selecaoNiveis") {
    // Inicia o nível desbloqueado cujo cartão recebeu o clique.
    for (let i = 1; i <= totalNiveis; i++) {
      let bx = 160 + (i - 1) * 120;
      let by = height / 2 - 10;
      
      // Calcula os limites do cartão de cada nível.
      if (mouseX > bx - 45 && mouseX < bx + 45 && mouseY > by - 40 && mouseY < by + 40) {
        if (i <= nivelMaximoDesbloqueado) {
          ativaAudioJogo();
          mic.start();
          iniciaNivel(i);
        }
      }
    }
    if (origemSelecaoNiveis === "jogo") {
      if (mouseX > 170 && mouseX < 390 && mouseY > 460 && mouseY < 510) {
        cronometroJogo += millis() - tempoPausadoNaSelecao;
        tempoPausadoNaSelecao = 0;
        estado = "execucao";
      } else if (mouseX > 410 && mouseX < 630 && mouseY > 460 && mouseY < 510) {
        tempoPausadoNaSelecao = 0;
        estado = "inicio";
      }
    } else if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
               mouseY > 460 && mouseY < 505) {
      estado = "inicio";
    }

  } else if (estado === "execucao") {
    if (tabelaRecompensasAberta) {
      if (mouseX > width / 2 + 200 && mouseX < width / 2 + 240 &&
          mouseY > height / 2 - 150 && mouseY < height / 2 - 110) {
        tabelaRecompensasAberta = false;
      }
      return;
    }

    // Abre a loja e regista o instante em que a partida foi pausada.
    if (mouseX > 360 && mouseX < 435 && mouseY > 10 && mouseY < 40) {
      tempoPausadoNaLoja = millis();
      estadoAnteriorLoja = "execucao";
      estado = "loja";
    }

    // Abre a seleção de níveis e regista o instante em que a partida foi pausada.
    if (mouseX > 440 && mouseX < 520 && mouseY > 10 && mouseY < 40) {
      origemSelecaoNiveis = "jogo";
      tempoPausadoNaSelecao = millis();
      estado = "selecaoNiveis";
    }
    if (mouseX > 525 && mouseX < 675 && mouseY > 10 && mouseY < 40) {
      tabelaRecompensasAberta = true;
    }

  } else if (estado === "fimNivel") {
    // Abre a loja a partir do ecrã de resultados.
    if (mouseX > width / 2 - 210 && mouseX < width / 2 - 10 && mouseY > 410 && mouseY < 460) {
      estadoAnteriorLoja = "fimNivel";
      estado = "loja";
    }
    // Abre a seleção de níveis a partir do ecrã de resultados.
    if (mouseX > width / 2 + 10 && mouseX < width / 2 + 210 && mouseY > 410 && mouseY < 460) {
      origemSelecaoNiveis = "menu";
      estado = "selecaoNiveis";
    }

  } else if (estado === "loja") {
    // Compra um nível do upgrade de largura se houver saldo e níveis disponíveis.
    if (mouseX > width / 2 - 240 && mouseX < width / 2 - 20 && mouseY > 370 && mouseY < 410) {
      let preco = precosUpgradeLargo[upgradeLargo];
      if (upgradeLargo < precosUpgradeLargo.length && moedas >= preco) {
        moedas -= preco;
        upgradeLargo++;
      }
    }
    // Compra um nível do upgrade de tolerância se houver saldo e níveis disponíveis.
    if (mouseX > width / 2 + 20 && mouseX < width / 2 + 240 && mouseY > 370 && mouseY < 410) {
      let preco = precosUpgradeTolerancia[upgradeTolerancia];
      if (upgradeTolerancia < precosUpgradeTolerancia.length && moedas >= preco) {
        moedas -= preco;
        upgradeTolerancia++;
      }
    }
    // Fecha a loja e regressa à partida pausada ou aos resultados.
    if (mouseX > width / 2 - 120 && mouseX < width / 2 + 120 && mouseY > 435 && mouseY < 480) {
      if (estadoAnteriorLoja === "execucao") {
        // Acrescenta a duração da pausa ao cronómetro da partida.
        if (tempoPausadoNaLoja > 0) {
          let duracaoLoja = millis() - tempoPausadoNaLoja;
          cronometroJogo += duracaoLoja;
          tempoPausadoNaLoja = 0;
        }
        estado = "execucao";
      } else {
        // Regressa ao ecrã de resultados.
        estado = "fimNivel";
      }
    }

  } else if (estado === "gameOver") {
    // Reinicia o nível atual ou abre a seleção de níveis após a derrota.
    if (mouseX > width / 2 - 130 && mouseX < width / 2 + 130 && mouseY > 370 && mouseY < 420) {
      iniciaNivel(nivelAtual);
    }
    if (mouseX > width / 2 - 130 && mouseX < width / 2 + 130 && mouseY > 430 && mouseY < 480) {
      origemSelecaoNiveis = "menu";
      estado = "selecaoNiveis";
    }

  } else if (estado === "vitoriaFinal") {
    // Repõe a progressão e regressa ao menu inicial.
    if (mouseX > width / 2 - 120 && mouseX < width / 2 + 120 && mouseY > 425 && mouseY < 475) {
      resetaJogoCompleto();
      estado = "inicio";
    }
  }
}

// Desenha a identificação do projeto nos cantos inferiores do canvas.
function desenhaRodape() {
  rectMode(CORNER);
  fill(255);
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text("Coral Reef Restoration", 10, height - 10);
  textAlign(RIGHT, BOTTOM);
  text("André Freitas · 33782 · ECGM", width - 10, height - 10);
}