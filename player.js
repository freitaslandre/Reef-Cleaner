// Player.js - Ferramenta Limpadora posicionada à direita a apontar para o círculo

class Limpador {
  constructor() {
    this.tamanho = 55;
    this.intensidadeJato = 0;
  }

  atualiza(volumeVal) {
    this.intensidadeJato = volumeVal;
  }

  desenha(tolMin = faixaIdealMin, tolMax = faixaIdealMax, diametroJato) {
    let x = mouseX;
    let y = mouseY;

    let ativa = this.intensidadeJato >= limiteMinimo;

    // 1. Círculo do Jato de Água exato sobre a posição do rato (mouseX, mouseY)
    if (ativa) {
      let tamanhoJato = diametroJato === undefined
        ? map(this.intensidadeJato, limiteMinimo, 1, 30, 90) + upgradeLargo * 12
        : diametroJato;

      if (this.intensidadeJato >= tolMin && this.intensidadeJato <= tolMax) {
        fill(100, 220, 255, 140); // Pressão Ideal Suave
      } else {
        fill(255, 90, 90, 160);  // Pressão Excessiva
      }

      noStroke();
      ellipse(x, y, tamanhoJato, tamanhoJato);
    }

    // 2. Desenha a ferramenta do LADO DIREITO, espelhada horizontalmente
    // para que a ponta do bocal fique junto à borda do círculo e a apontar para a esquerda (para o rato)
    push();
    translate(x + 50, y);  // Posiciona o ponto de origem 50px à direita do rato
    scale(-1, 1);          // Inverte horizontalmente para a ferramenta apontar para a esquerda
    drawCleanerNozzle(0, 0, this.tamanho, ativa);
    pop();
  }
}