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

---

## Sessão 4 – 20 de outubro de 2026

**Objetivo:** Configurar o ambiente de desenvolvimento local, estruturar o código de forma modular e implementar a calibração de áudio, o HUD e os elementos do cenário.

**Atividades realizadas:**
- Clonei o repositório GitHub para a minha máquina local e configurei o ambiente no Visual Studio Code, com o apoio da extensão *Live Server*.
- Baixei e organizei as bibliotecas `p5.js` e `p5.sound.js` na pasta local `p5/` do projeto, ligando-as ao `index.html`.
- Decidi modularizar o projeto para melhorar a organização e legibilidade do código, criando os ficheiros `UI.js` (interface, HUD e elementos gráficos) e `Player.js` (ferramenta de limpeza e jato de pressão) na raiz do projeto.
- Programei a calibração de microfone de 3 segundos no ecrã inicial para medir o ruído ambiente e calcular dinamicamente os limiares de histerese e a faixa de pressão ideal.
- Desenhei no `UI.js` a barra vertical de medição do som do microfone com marcadores visuais para a zona ideal (faixa verde) e indicadores de pressão/danos.
- Implementei o HUD superior com o nível, tempo restante, % limpa, saúde do recife e o sistema de moedas do tesouro.
- Decidi enriquecer o cenário subaquático desenhando no fundo um navio naufragado com um baú do tesouro de onde saem as moedas douradas que o jogador pode resgatar.
- Atualizei a documentação do projeto nos ficheiros `README.md` e `DIARIO.md` e fiz os respetivos *commits* no GitHub com mensagens descritivas.

**Problemas:**
- Ao separar o código nos novos ficheiros `UI.js` e `Player.js`, o navegador apresentou erros de funções não encontradas (`not defined`) ao tentar executar o jogo.
- O microfone não capturava som ao iniciar a aplicação, devido às restrições de privacidade dos navegadores modernos que bloqueiam o acesso ao áudio sem uma interação direta do utilizador.

**Solução:**
- Reordenei as tags `<script>` no ficheiro `index.html` para garantir que as bibliotecas e os módulos `UI.js` e `Player.js` são carregados antes do script principal `sketch.js`.
- Associei a autorização e ativação do microfone (`userStartAudio()` e `mic.start()`) ao evento de clique do rato no botão de calibração dentro da função `mousePressed()`.

**Decisões:**
- Modularizar o código em múltiplos ficheiros `.js` para cumprir as boas práticas de estruturação e facilitar a manutenção à medida que o jogo cresce.
- Guardar os ficheiros das bibliotecas do p5 localmente no repositório para permitir o desenvolvimento e testes offline.
- Substituir a ideia de moedas genéricas por "moedas do tesouro" associadas ao navio naufragado no fundo do mar, tornando a narrativa e a interface mais imersivas.**(sugerido pelo professor)**

**Utilização de IA:**
- Ferramenta: Gemini.
- Finalidade: Apoio na resolução de dúvidas de configuração do Git no VS Code, sugestões para a modularização do código em ficheiros `.js` e ajuste da documentação (`README.md`).
- Resultado utilizado: Estrutura base dos módulos `UI.js` e `Player.js`.
- Decisões minhas: Escrever todo o código do jogo no VS Code, definir a inclusão local das bibliotecas do p5, criar a temática do navio naufragado/baú do tesouro, escolher a convenção de *commits* em inglês e validar cada etapa do projeto.