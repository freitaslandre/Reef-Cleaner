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

  // Aumentamos a quantidade de manchas para cobrir os corais grandes com detalhes pequenos
  let qtdAjustada = quantidade + 8; 

  for (let i = 0; i < qtdAjustada; i++) {
    let idCoral = floor(random(0, posicoesCorais.length));
    let coralAlvo = posicoesCorais[idCoral];

    // Dispersão adaptada à escala 2.2x (espala-se na largura e sobe pelo corpo do coral)
    let offsetX = random(-coralAlvo.size * 0.7, coralAlvo.size * 0.7);
    let offsetY = random(-coralAlvo.size * 1.5, -coralAlvo.size * 0.2);

    let x = coralAlvo.x + offsetX;
    let y = coralAlvo.y + offsetY;
    
    // Manchas pequenas (raio 10 a 16px) em vez das manchas gigantes de 40px
    let r = random(10, 16);

    lista.push(new ManchaSujidade(x, y, r, idCoral));
  }

  return lista;
}