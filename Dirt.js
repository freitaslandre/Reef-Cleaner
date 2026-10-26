// Representa uma mancha de sujidade ligada a um coral.
class ManchaSujidade {
  constructor(x, y, raio, idCoral) {
    // Guarda a posição inicial, os raios e o coral associado à mancha.
    this.x = x;
    this.y = y;
    this.raioInicial = raio;
    this.raioAtual = raio;
    this.limpa = false;
    this.idCoral = idCoral; // Guarda a qual coral esta mancha pertence
  }

  // Reduz a mancha quando o jato alcança a sua posição.
  limpar(mx, my, raioJato, dentroDaZonaIdeal, nivel = 1) {
    // Não altera uma mancha que já foi completamente limpa.
    if (this.limpa) return;

    // Mede a distância entre o centro do jato e o centro da mancha.
    let d = dist(mx, my, this.x, this.y);

    // Só limpa a mancha quando ela está dentro do alcance do jato.
    if (d < raioJato / 2) {
      // Escolhe a taxa de limpeza conforme a pressão do jato.
      let taxaLimpezaBase = dentroDaZonaIdeal ? 0.075 : 0.0165;

      // Seleciona a resistência correspondente ao nível atual.
      let fatoresResistencia = [0.8, 1.2, 1.6, 1.85, 2.15];
      let indiceNivel = Math.max(0, Math.min(fatoresResistencia.length - 1, nivel - 1));
      let fatorResistenciaNivel = fatoresResistencia[indiceNivel];
      // Reduz a taxa de limpeza de acordo com a resistência do nível.
      let reducao = taxaLimpezaBase / fatorResistenciaNivel;

      // Diminui o raio visível da mancha.
      this.raioAtual -= reducao;

      // Marca a mancha como limpa quando resta apenas um raio residual.
      if (this.raioAtual <= 2) {
        this.raioAtual = 0;
        this.limpa = true;
      }
    }
  }

  // Desenha a mancha enquanto ainda existir sujidade.
  desenhar() {
    // Ignora manchas que já foram limpas ou cujo raio chegou a zero.
    if (this.limpa || this.raioAtual <= 0) return;

    // Desenha duas elipses para representar a forma e o centro da sujidade.
    push();
    noStroke();
    fill(35, 75, 25, 210);
    ellipse(this.x, this.y, this.raioAtual * 2, this.raioAtual * 1.6);
    fill(20, 50, 15, 180);
    ellipse(this.x + 2, this.y - 2, this.raioAtual, this.raioAtual * 0.8);
    pop();
  }
}

// Cria manchas em posições aleatórias próximas dos corais da cena.
function geraSujidadeAleatoria(quantidade) {
  // Cria a lista que será devolvida ao nível.
  let lista = [];

  // Acrescenta manchas à quantidade base recebida.
  let qtdAjustada = quantidade + 8; 

  // Escolhe um coral e uma posição para cada mancha.
  for (let i = 0; i < qtdAjustada; i++) {
    let idCoral = floor(random(0, posicoesCorais.length));
    let coralAlvo = posicoesCorais[idCoral];

    // Gera deslocamentos dentro da área aproximada do coral selecionado.
    let offsetX = random(-coralAlvo.size * 0.7, coralAlvo.size * 0.7);
    let offsetY = random(-coralAlvo.size * 1.5, -coralAlvo.size * 0.2);

    let x = coralAlvo.x + offsetX;
    let y = coralAlvo.y + offsetY;
    
    // Define um raio aleatório para a mancha.
    let r = random(10, 16);

    // Adiciona a mancha com a posição e o coral selecionados.
    lista.push(new ManchaSujidade(x, y, r, idCoral));
  }

  // Devolve todas as manchas geradas.
  return lista;
}