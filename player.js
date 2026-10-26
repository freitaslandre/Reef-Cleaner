// Representa a ferramenta controlada pelo rato e pelo volume do microfone.
class Limpador {
  constructor() {
    // Define o tamanho do bocal e inicia o jato sem intensidade.
    this.tamanho = 55;
    this.intensidadeJato = 0;
  }

  // Guarda o nível de entrada do microfone como intensidade atual do jato.
  atualiza(volumeVal) {
    this.intensidadeJato = volumeVal;
  }

  // Desenha o alcance do jato e posiciona o bocal junto ao cursor.
  desenha(tolMin = faixaIdealMin, tolMax = faixaIdealMax, diametroJato) {
    // Usa o cursor como centro do jato e ponto de referência do bocal.
    let x = mouseX;
    let y = mouseY;

    // Ativa a representação do jato quando o volume ultrapassa o limiar mínimo.
    let ativa = this.intensidadeJato >= limiteMinimo;

    // Desenha o círculo do jato com o diâmetro calculado pelo nível.
    if (ativa) {
      // Usa o diâmetro calculado pelo jogo ou calcula um valor proporcional ao volume.
      let tamanhoJato = diametroJato === undefined
        ? map(this.intensidadeJato, limiteMinimo, 1, 30, 90) + upgradeLargo * 12
        : diametroJato;

      if (this.intensidadeJato >= tolMin && this.intensidadeJato <= tolMax) {
        fill(100, 220, 255, 140);
      } else {
        fill(255, 90, 90, 160);
      }

      // Desenha o círculo sem contorno à volta do cursor.
      noStroke();
      ellipse(x, y, tamanhoJato, tamanhoJato);
    }

    // Desloca o bocal para a direita e espelha-o para apontar ao cursor.
    push();
    translate(x + 50, y);
    scale(-1, 1);
    // Desenha o bocal com o aspeto correspondente ao estado do jato.
    drawCleanerNozzle(0, 0, this.tamanho, ativa);
    pop();
  }
}