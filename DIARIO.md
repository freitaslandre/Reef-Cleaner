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

---

## Sessão 5 – 20 de outubro de 2026

**Objetivo:** Implementar a geração aleatória de manchas de sujidade/algas, programar a mecânica de limpeza por sopro/colisão, reformular a estética visual dos ecrãs e atualizar o repositório.

**Atividades realizadas:**
- Decidi criar o módulo `Dirt.js` para gerir a classe `ManchaSujidade` e a função de geração procedural `geraSujidadeAleatoria()`, espalhando as algas e sedimentos aleatoriamente pelo recife a cada partida (requisito de aleatoriedade).
- Programei a lógica de colisão no `Dirt.js` e `sketch.js`, onde o jato de limpeza atua sobre as manchas e reduz o seu raio em tempo real apenas quando o volume do microfone está dentro da zona de pressão ideal.
- Implementei o cálculo contínuo da percentagem de recife limpa no HUD, com base na área/raio de sujidade eliminada em relação ao total inicial.
- Redesenhei o ambiente visual em `UI.js` para um estilo marinho turquesa mais iluminado, adicionando um gradiente de água, raios de luz solar subaquáticos, leito de areia clara e animação suave de bolhas.
- Reformulei o layout do ecrã de Início e o ecrã de Calibração, ajustando os cartões de instrução, o botão de ação e adicionando uma barra de progresso verde e contador numérico em destaque durante a calibração de 3 segundos.
- Corrigi as coordenadas de clique da função `mousePressed()` no `sketch.js` para alinhar com o novo botão "Calibrar e Jogar".
- Atualizei o ficheiro `README.md` com a nova árvore de ficheiros e fiz o *commit* consolidado das alterações no GitHub.

**Problemas:**
- Ao ajustar o visual do botão de início no `UI.js`, o clique deixou de responder e o jogo não passava para a calibração.

**Solução:**
- Reajustei os limites da área clicável (`mouseX` e `mouseY`) dentro da função `mousePressed()` no `sketch.js` para corresponderem exatamente à nova posição central em Y (410) e às dimensões do botão.

**Decisões:**
- Criar o ficheiro `Dirt.js` em vez de sobrecarregar o `sketch.js`, mantendo a arquitetura modular do projeto.
- Tornar a mecânica de limpeza estritamente dependente da faixa verde de pressão ideal, incentivando o controlo do sopro por parte do jogador.
- Agrupar as alterações visuais e a lógica de sujidade num único *commit* bem documentado.

**Utilização de IA:**
- Ferramenta: Gemini.
- Finalidade: Apoio na reestruturação da função `mousePressed()` para a área redefinida do botão e sugestões para os estilos visuais de gradiente e bolhas no p5.js.
- Resultado utilizado: Lógica de cálculo de clique no botão e código base para o gradiente e bolhas de fundo.
- Decisões minhas: Criar a classe e mecânica do `Dirt.js`, ajustar a sensibilidade de limpeza das manchas, definir a nova paleta de cores turquesa e organizar a documentação.

---

## Sessão 6 – 21 de outubro de 2026

**Objetivo:** Integrar uma biblioteca gráfica procedural completa em P5.js com assets ilustrados (fauna marinha, corais, navio naufragado, tesouro e ferramenta de limpeza) e ligar o módulo `Assets.js` ao ecossistema do jogo.

**Atividades realizadas:**
- Elaborei um *prompt* estruturado em inglês para geração de código procedural em P5.js com auxílio de IA (Claude) para criação do ficheiro `Assets.js`.
- Adicionei o módulo `Assets.js` à raiz do projeto e declarei-o no `index.html` garantindo a correta ordem de carregamento antes dos módulos de interface e jogador.
- Atualizei o ficheiro `Player.js` para utilizar a nova função `drawCleanerNozzle()`, substituindo a representação circular simples do limpador por uma bocal metálico com indicação LED de estado e partículas de jato[cite: 4].
- Reformulei o `UI.js` para desenhar os novos elementos visuais: peixes animados a nadar no fundo marinho (`drawFish`), corais saudáveis (`drawCoralHealthy`), corais branqueados (`drawCoralBleached`), conchas (`drawShell`), o navio naufragado com baú de moedas (`drawSunkenShipwreck`) e o ícone de moeda dourada (`drawGoldCoin`) no HUD.
- Resolvi os erros de carregamento e escopo na consola (`404 Not Found` e `drawFish is not defined`) garantindo a correta inclusão do script `Assets.js`.
- Documentei o progresso e realizei o *commit* no GitHub com a mensagem `"Integrate procedural Assets.js module with fish, corals, shipwreck, treasure and cleaner nozzle"`.

**Problemas:**
- Ao carregar a aplicação, a consola apresentou o erro `Assets.js 404 (Not Found)` e `drawFish is not defined`, impedindo a renderização do ecrã do jogo.

**Solução:**
- Verifiquei a localização do ficheiro `Assets.js`, garantindo que estava posicionado na raiz do repositório e que a tag `<script src="Assets.js"></script>` antecedia o `UI.js` no `index.html`.

**Decisões:**
- Optar por ilustrações procedurais em P5.js com primitives, curvas Bézier e gradientes Canvas em vez de ficheiros PNG externos, garantindo uma estética coerente, leve e de melhor avaliação técnica no âmbito da disciplina.
- Manter o foco na arquitetura modular sem sobrecarregar o `sketch.js`.

**Utilização de IA:**
- Ferramenta: Gemini e Claude.
- Finalidade: Criação do *prompt* de geração vetorial para P5.js e auxílio na integração das funções do `Assets.js` nos ficheiros `UI.js` e `Player.js`.
- Resultado utilizado: Código completo do `Assets.js` com as funções de desenho tridimensional e reestruturação do `Player.js` e `UI.js`.
- Decisões minhas: Definir a lista de assets necessários para o tema do jogo, testar a integração dos scripts e validar o comportamento visual do ecossistema.

---

## Sessão 7 – 22 de outubro de 2026

**Objetivo:** Ajustar a composição visual do leito marinho (perspetiva e profundidade), implementar o ciclo completo de níveis, ecrãs de transição, recompensa de tesouro, loja de melhorias e restauro dinâmico da cor dos corais.

**Atividades realizadas:**
- Reorganizei a composição do leito marinho em `UI.js`, criando uma planície de areia com relevo natural e dois planos de profundidade.
- Inclinei o navio naufragado na diagonal (`rotate(0.22)`) e reduzi a sua escala (`scale(0.65)`) no segundo plano, sobrepondo uma camada de areia para criar o efeito de estar parcialmente enterrado ao fundo.
- Desenvolvi a mecânica de progressão de níveis (1 a 5) no `sketch.js`, aumentando a quantidade de manchas de sujidade e ajustando o tempo limite em níveis mais avançados.
- Programei o ecrã de Resultados/Fim de Nível (`desenhaFimNivel()`), calculando as moedas de ouro ganhas com base no nível e na percentagem de recife limpo.
- Implementei o ecrã da Loja (`desenhaLoja()`), permitindo ao jogador gastar moedas em *upgrades* para a ferramenta de limpeza (jato mais largo e maior tolerância de pressão).
- Criei o ecrã de Derrota/Game Over (`desenhaGameOver()`) caso o tempo esgoste com menos de 70% do recife limpo.
- Corrigi a geração de sujidade em `Dirt.js` para associar manchas a todos os corais e implementei a restauração dinâmica da cor em `UI.js`: o coral é desenhado como branqueado enquanto tiver sujidade e recupera a cor viva assim que a última mancha é eliminada.
- Documentei e enviei as alterações para o repositório GitHub através de *commits* dedicados.

**Problemas:**
- A sujidade estava a focar-se apenas nos corais do centro e os corais branqueados continuavam pálidos mesmo após serem completamente limpos.

**Solução:**
- Associei um identificador de coral (`idCoral`) a cada mancha de sujidade no `Dirt.js` para distribuir as algas por todos os 5 corais. No `UI.js`, passei a verificar em tempo real se ainda existem manchas ativas no coral; caso não existam, o jogo desenha a versão saudável e colorida (`drawCoralHealthy`).

**Decisões:**
- Inclinar o navio em segundo plano para dar maior destaque aos corais no primeiro plano.
- Condicionar a passagem de nível a um mínimo de 70% de limpeza caso o tempo esgoste, incentivando o jogador a ser eficiente.
- Associar a restauração visual do ecossistema ao progresso real de limpeza, reforçando a componente educativa do jogo.

**Utilização de IA:**
- Ferramenta: Gemini.
- Finalidade: Apoio na reestruturação da máquina de estados do `sketch.js` para acomodar a loja e na lógica de verificação dinâmica do estado dos corais.
- Resultado utilizado: Estrutura de botões da loja, controlo do tempo limite por nível e condicional de restauração de cor dos corais.
- Decisões minhas: Definir o preço e impacto dos *upgrades*, ajustar a inclinação e posição do navio em segundo plano e organizar o fluxo entre níveis.

---

## Sessão 8 – 22 de outubro de 2026

**Objetivo:** Refinar o posicionamento visual da ferramenta de limpeza, ajustar o cenário do navio afundado e corrigir a lógica de reinício de nível e o fluxo de navegação da loja.

**Atividades realizadas:**
- Ajustei o alinhamento da ferramenta de limpeza em `Player.js`: posicionei-a do lado direito do cursor do rato, espelhada horizontalmente (`scale(-1, 1)`), garantindo que o círculo de ação do jato fica exatamente sobre a coordenada `(mouseX, mouseY)`.
- Adicionei o botão de acesso à **🛒 Loja** no HUD superior em `UI.js`, permitindo abrir a loja em pleno jogo e pausando o temporizador do nível durante as compras.
- Reposicionei o baú do tesouro no `Assets.js` para o convés principal do navio naufragado e inclinei a embarcação (`rotate(0.32)`) em `UI.js`, sobrepondo uma duna de areia para dar o efeito de ter a proa enterrada no fundo do mar.
- Corrigi a lógica de reinício em `sketch.js`: a função `iniciaNivel()` passou a recriar e redefinir do zero as manchas de sujidade e o estado dos corais ao clicar em "Tentar Novamente".
- Refiz o fluxo de navegação da loja: ao aceder à loja após concluir um nível, o botão de saída passa a indicar "Voltar aos Resultados", regressando ao ecrã de fim de nível em vez de avançar automaticamente para o nível seguinte.
- Documentei e enviei o progresso para o repositório GitHub através de *commits* incrementais.

**Problemas:**
- A ferramenta de limpeza ficava desenhada sobre o centro da área de ação do jato e invertida.
- Ao clicar em "Tentar Novamente", o nível mantinha o progresso de limpeza anterior sem reiniciar as manchas de sujidade.
- A saída da loja no ecrã pós-nível forçava o início imediato do nível seguinte sem permitir ao jogador rever as opções.

**Solução:**
- Reorganizei a translação do bocal no `Player.js` para deslocar a ferramenta 50px à direita do rato com espelhamento horizontal.
- Garanti que a lista `listaSujidade` é completamente esvaziada e reinstanciada dentro da função `iniciaNivel()`.
- Criei a variável `estadoAnteriorLoja` para registar a origem do jogador e redefinir o botão de saída da loja dinamicamente em `UI.js` e `sketch.js`.

**Decisões:**
- Permitir a abertura da loja em dois momentos (durante a execução do nível e no ecrã de resultados pós-nível) para dar maior flexibilidade e fluidez à jogabilidade.
- Afundar e inclinar o navio em segundo plano com sobreposição de areia para reforçar a profundidade e o realismo do ecossistema marinho.

**Utilização de IA:**
- Ferramenta: Gemini.
- Finalidade: Apoio na transformação geométrica do bocal em P5.js, ajuste da duna de areia sobre a proa do navio e reestruturação da lógica de fluxo da loja.
- Resultado utilizado: Código de espelhamento do bocal em `Player.js`, coordenadas do baú no convés em `Assets.js` e navegação condicional em `sketch.js`.
- Decisões minhas: Definir a posição exata da ferramenta em relação ao ponteiro do rato, validar visualmente o enquadramento do navio e ajustar a usabilidade dos botões da loja.