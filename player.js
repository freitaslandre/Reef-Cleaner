// Player.js - Ferramenta Limpadora com Integração de Assets

class Limpador {
  constructor() {
    this.tamanho = 55;
    this.intensidadeJato = 0;
  }

  atualiza(volumeVal) {
    this.intensidadeJato = volumeVal;
  }

  desenha() {
    let x = mouseX;
    let y = mouseY;

    let ativa = this.intensidadeJato >= limiteMinimo;

    // Jato de Água / Pressão (Efeito Visual)
    if (ativa) {
      let tamanhoJato = map(this.intensidadeJato, limiteMinimo, 1, 40, 110);

      if (this.intensidadeJato >= faixaIdealMin && this.intensidadeJato <= faixaIdealMax) {
        fill(100, 220, 255, 140); // Pressão Ideal Suave
      } else {
        fill(255, 90, 90, 160);  // Pressão Demasiado Forte
      }

      noStroke();
      ellipse(x + 25, y, tamanhoJato, tamanhoJato);
    }

    // Desenha a Ferramenta Limpadora Usando o Asset em P5.js
    drawCleanerNozzle(x, y, this.tamanho, ativa);
  }
}