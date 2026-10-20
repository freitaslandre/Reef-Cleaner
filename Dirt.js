// Dirt.js - Gestão das Manchas de Sujidade/Algas

class ManchaSujidade {
  constructor(x, y, raio) {
    this.x = x;
    this.y = y;
    this.raioInicial = raio;
    this.raioAtual = raio;
    this.limpa = false;
  }

  // Verifica colisão com o jato e reduz a sujidade
  limpar(xLimpador, yLimpador, raioJato, dentroDaZonaIdeal) {
    if (this.limpa) return;

    let d = dist(this.x, this.y, xLimpador, yLimpador);

    // Se o jato tocar na mancha
    if (d < this.raioAtual + raioJato / 2) {
      if (dentroDaZonaIdeal) {
        // Reduz a mancha quando a pressão é a ideal
        this.raioAtual -= 0.4;
        if (this.raioAtual <= 3) {
          this.raioAtual = 0;
          this.limpa = true;
        }
      }
    }
  }

  desenhar() {
    if (this.limpa || this.raioAtual <= 0) return;

    push();
    noStroke();
    // Cor de alga/sedimento (Verde/Castanho)
    fill(40, 80, 30, 200);
    ellipse(this.x, this.y, this.raioAtual * 2, this.raioAtual * 1.6);
    fill(25, 50, 20, 180);
    ellipse(this.x + 2, this.y - 2, this.raioAtual, this.raioAtual * 0.8);
    pop();
  }
}

// Função para gerar manchas aleatórias no recife
function geraSujidadeAleatoria(quantidade) {
  let lista = [];
  for (let i = 0; i < quantidade; i++) {
    // Espalha aleatoriamente na zona central/inferior do ecrã
    let x = random(100, width - 100);
    let y = random(300, height - 80);
    let r = random(15, 35);
    lista.push(new ManchaSujidade(x, y, r));
  }
  return lista;
}