// Dirt.js - Gestao de Manchas de Sujidade/Algas focado nos Corais

class ManchaSujidade {
  constructor(x, y, raio) {
    this.x = x;
    this.y = y;
    this.raioInicial = raio;
    this.raioAtual = raio;
    this.limpa = false;
  }

  limpar(xLimpador, yLimpador, raioJato, dentroDaZonaIdeal) {
    if (this.limpa) return;

    let d = dist(this.x, this.y, xLimpador, yLimpador);

    if (d < this.raioAtual + raioJato / 2) {
      if (dentroDaZonaIdeal) {
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
    // Manchas verdes/castanhas de alga sobre o coral
    fill(35, 75, 25, 210);
    ellipse(this.x, this.y, this.raioAtual * 2, this.raioAtual * 1.6);
    fill(20, 50, 15, 180);
    ellipse(this.x + 2, this.y - 2, this.raioAtual, this.raioAtual * 0.8);
    pop();
  }
}

// Gera manchas de sujidade posicionadas estritamente sobre os corais
function geraSujidadeAleatoria(quantidade) {
  let lista = [];

  // Filtra apenas os corais que estão branqueados/sujos na UI
  let coraisSujos = posicoesCorais.filter(c => c.eBranqueado);

  for (let i = 0; i < quantidade; i++) {
    // Escolhe um dos corais branqueados aleatoriamente
    let coralAlvo = random(coraisSujos);

    // Gera um desvio aleatório em torno da estrutura do coral
    let offsetX = random(-coralAlvo.size * 0.35, coralAlvo.size * 0.35);
    let offsetY = random(-coralAlvo.size * 0.5, -coralAlvo.size * 0.1);

    let x = coralAlvo.x + offsetX;
    let y = coralAlvo.y + offsetY;
    let r = random(12, 22);

    lista.push(new ManchaSujidade(x, y, r));
  }

  return lista;
}