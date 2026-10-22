// Dirt.js - Gestão de Manchas de Sujidade com Associação a Todos os Corais

class ManchaSujidade {
  constructor(x, y, raio, idCoral) {
    this.x = x;
    this.y = y;
    this.raioInicial = raio;
    this.raioAtual = raio;
    this.limpa = false;
    this.idCoral = idCoral; // Guarda a qual coral esta mancha pertence
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
    fill(35, 75, 25, 210);
    ellipse(this.x, this.y, this.raioAtual * 2, this.raioAtual * 1.6);
    fill(20, 50, 15, 180);
    ellipse(this.x + 2, this.y - 2, this.raioAtual, this.raioAtual * 0.8);
    pop();
  }
}

// Gera manchas de sujidade espalhadas por TODOS os corais da cena
function geraSujidadeAleatoria(quantidade) {
  let lista = [];

  for (let i = 0; i < quantidade; i++) {
    // Escolhe qualquer um dos 5 corais
    let idCoral = floor(random(0, posicoesCorais.length));
    let coralAlvo = posicoesCorais[idCoral];

    let offsetX = random(-coralAlvo.size * 0.35, coralAlvo.size * 0.35);
    let offsetY = random(-coralAlvo.size * 0.5, -coralAlvo.size * 0.1);

    let x = coralAlvo.x + offsetX;
    let y = coralAlvo.y + offsetY;
    let r = random(12, 22);

    lista.push(new ManchaSujidade(x, y, r, idCoral));
  }

  return lista;
}