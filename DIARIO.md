## Sessão 1 – 7 de outubro de 2026

**Objetivo:** Compreender o enunciado e definir a ideia do exercício.

**Atividades realizadas:**
- Li o enunciado e identifiquei o que tinha de entregar até dia 12 (relatório de 2 páginas, protótipo, repositório Git).
- Tema a trabalhar: Coral Reef Restoration.
- Propus um jogo de limpeza no estilo "simulador de limpeza" e discuti a ideia com a IA, que a adaptou ao tema (limpador subaquático suave, recife a ganhar cor).
- Defini como cada requisito obrigatório seria cumprido: microfone + rato, calibração, histerese, aleatoriedade, colisões, sons, feedback e 3 ecrãs.
- Identifiquei a técnica de limpeza (camada de sujidade apagada pelo jato, com % limpa por amostragem de píxeis).

**Problemas:**
- Risco de o âmbito ficar demasiado grande para 2 semanas.

**Solução:**
- Ordenei as funcionalidades por prioridade: primeiro limpeza, microfone com calibração e histerese e os 3 ecrãs; depois colisões, sons e aleatoriedade; por fim a funcionalidade original.

**Decisões:**
- Ficar com a ideia do jogo de limpeza de recife, com a "pressão ideal" como funcionalidade original.

**Utilização de IA:**
- Ferramenta: Claude e Gemini.
- Finalidade: adaptar a minha ideia ao tema e sugerir como cumprir os requisitos.
- Resultado utilizado: a estrutura dos requisitos e a técnica de limpeza com camada e máscara.
- Decisões minhas: a escolha do conceito do jogo e do que ficaria ou não no âmbito.

---

## Sessão 2 – 8 de outubro de 2026

**Objetivo:** Evoluir a ideia, escrever o relatório inicial e preparar o repositório.

**Atividades realizadas:**
- Acrescentei ao jogo 5 níveis, moedas (por ≥ 75%, ≥ 90% e 100% de limpeza) e uma loja de upgrades da ferramenta, com o objetivo final de completar o nível 5 a 100%.
- Escolhi que o controlo da ferramenta é pelo volume do microfone.
- Fiz uma primeira versão do relatório.
- Desenhei os dois protótipos de baixa fidelidade (Início e Execução).
- Criei o repositório no GitHub e escrevi o README inicial, com ajuda da IA.
- Pedi à IA uma revisão do relatório e identifiquei correções a fazer.

**Problemas:**
- Percebi que a barra de calibração não estava no ecrã inicial.
- Tive dúvidas se a % limpa e as moedas contavam como "pontuação".

**Solução:**
- Acrescentar a barra de calibração ao esboço do Ecrã 1.
- Concluí que a % limpa e as moedas cumprem o requisito de pontuação.

**Decisões:**
- Manter a % limpa e as moedas como mecanismos de pontuação.
- Fazer commits com mensagens descritivas desde o início.

**Utilização de IA:**
- Ferramenta: Claude e Gemini.
- Finalidade: revisão do relatório, sugestões para a histerese e as colisões.
- Resultado utilizado: o texto do relatório e do README, que uma vez revisto, foi corrigido
- Decisões minhas: o sistema de níveis e moedas, o controlo por volume, os esboços feitos à mão e as correções ao texto.

---

## Sessão 3 – 8 de outubro de 2026

**Objetivo:** Criar o esqueleto inicial do projeto p5.js no repositório.

**Atividades realizadas:**
- Criei o ficheiro `index.html` no repositório.
- Criei o ficheiro `sketch.js` com o esqueleto inicial: função `setup()` (canvas de 800×600), função `draw()` com a variável `estado` ("inicio", "execucao" ou "resultado"), um ecrã de início que mostra só o título "REEF CLEANER" e o rodapé obrigatório (tema em baixo à esquerda; nome, n.º de aluno e ECGM em baixo à direita).

**Problemas:**
- O `index.html` ficou criado mas sem código lá dentro. Por isso o `sketch.js` ainda não é carregado e o jogo não corre no browser.

**Solução:**
- Ainda por resolver: preencher o `index.html` com as bibliotecas p5.js e p5.sound e a ligação ao `sketch.js`, e testar com o Live Server.

**Decisões:**
- Organizar o jogo por estados (`estado`), para depois acrescentar os ecrãs de Execução, Resultado e Loja.
- Manter o rodapé numa função própria (`desenhaRodape()`), para aparecer em todos os ecrãs.

**Utilização de IA:**
- Ferramenta: Claude.
- Finalidade: rever e ajudar na escrita do código para o esqueleto do `sketch.js`.
- Resultado utilizado: o código do `sketch.js`.
- Decisões minhas: começar por definir uma variável estado, criar o rodapé, a estrutura do repositório e o que fica em cada ficheiro.
