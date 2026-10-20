// Player.js - Limpador e Jato de Áudio

class Limpador {
  constructor() {
    this.raioLimpador = 25;
    this.intensidadeJato = 0;
  }

  atualiza(volumeVal) {
    this.intensidadeJato = volumeVal;
  }

  desenha() {
    let x = mouseX;
    let y = mouseY;

    // Se o volume ultrapassar o limite mínimo (Histerese), ativa o jato
    if (this.intensidadeJato >= limiteMinimo) {
      let tamanhoJato = map(this.intensidadeJato, limiteMinimo, 1, 30, 90);
      
      if (this.intensidadeJato >= faixaIdealMin && this.intensidadeJato <= faixaIdealMax) {
        fill(100, 220, 255, 160); // Jato Suave Ideal
      } else {
        fill(255, 100, 100, 180); // Jato Demasiado Forte
      }

      noStroke();
      ellipse(x, y, tamanhoJato, tamanhoJato);
    }

    // Ferramenta / Ponteiro do Limpador (Rato)
    stroke(255);
    strokeWeight(2);
    fill(40, 180, 220);
    ellipse(x, y, this.raioLimpador, this.raioLimpador);
  }
}