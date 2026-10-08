// Reef Cleaner - esqueleto inicial
// Sistemas Multimédia | ECGM | 2026-2027

// Estado atual do jogo: "inicio", "execucao" ou "resultado"
let estado = "inicio";

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(20, 90, 120);

  if (estado === "inicio") {
    desenhaInicio();
  }

  desenhaRodape();
}

// Ecrã de início (por agora só o título)
function desenhaInicio() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("REEF CLEANER", width / 2, height / 2);
}

// Tema (esquerda) e identificação (direita), exigidos no enunciado
function desenhaRodape() {
  fill(255);
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text("Coral Reef Restoration", 10, height - 10);
  textAlign(RIGHT, BOTTOM);
  text("André Freitas · 33782 · ECGM", width - 10, height - 10);
}
