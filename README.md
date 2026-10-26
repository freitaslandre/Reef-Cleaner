# Reef Cleaner

Jogo interativo desenvolvido em **p5.js** sobre a recuperação de recifes de coral, controlado pelo rato e pelo microfone.

Trabalho prático de *Sistemas Multimédia* · Engenharia da Computação Gráfica e Multimédia (ECGM) · 2026-2027

- **Autor:** André Freitas
- **N.º de aluno:** 33782
- **Tema atribuído:** Coral Reef Restoration

## Sobre o jogo

O jogador limpa manchas de sujidade nos corais com um jato controlado pelo volume captado pelo microfone. A ferramenta acompanha o cursor do rato. A pressão adequada limpa mais depressa; uma pressão abaixo da faixa ideal limpa mais lentamente e a sobrepressão interrompe a limpeza e reduz a saúde do recife.

- O jogo tem **5 níveis**. O tempo limite é de **60, 55, 50, 45 e 40 segundos**, do nível 1 ao nível 5.
- Cada nível começa com **100% de saúde**. A sobrepressão reduz a saúde em **4,5 pontos percentuais por segundo** enquanto se mantiver.
- A calibração mede o ruído ambiente durante **3 segundos**. Ao carregar em **Jogar**, uma calibração guardada em `localStorage` (`calibracaoRuido`) é reutilizada; se não existir um valor válido, é feita uma nova calibração. **Recalibrar** inicia uma medição manual e regressa ao menu quando termina.
- O nível mínimo de pressão e a faixa ideal são calculados a partir da calibração. O upgrade **Tolerância de Pressão** alarga a faixa ideal. Pressão acima dessa faixa causa dano e não limpa; pressão entre o mínimo e o início da faixa ideal limpa mais lentamente. Abaixo do mínimo, o jato não limpa.
- A percentagem limpa é calculada comparando a soma dos raios iniciais das manchas com a soma dos raios que ainda restam; não é uma medição de píxeis.
- Com saúde igual ou superior a **50%**, a recompensa é multiplicada pelo nível atual: **10 moedas** para 75–89% de limpeza, **15 moedas** para 90–99% e **30 moedas** para 100%. Abaixo de 75% não há recompensa. Com saúde inferior a 50%, não se recebem moedas, independentemente da limpeza.
- É necessário limpar **100%** para concluir o nível e desbloquear o seguinte. Se o tempo terminar antes disso, a partida termina sem desbloquear outro nível.
- A loja tem dois upgrades de cinco níveis: **Jato Mais Largo** (20, 45, 80, 130 e 200 moedas) e **Tolerância de Pressão** (25, 55, 95, 150 e 220 moedas). Os valores são os preços de cada compra sucessiva.
- A seleção de níveis mostra apenas os níveis desbloqueados. Se for aberta durante uma partida, permite retomá-la com o tempo e o progresso preservados ou regressar ao menu.
- O cenário inclui bolhas animadas, peixes decorativos, um navio, conchas e corais. As manchas de sujidade são geradas em posições aleatórias junto dos corais; os peixes têm posições iniciais definidas no código.
- A música e os efeitos são sintetizados com p5.sound. O som do jato toca acima do limiar mínimo, incluindo em sobrepressão; outros sons assinalam a limpeza de um coral, a conclusão de um nível e a derrota.
- **Objetivo final:** concluir os cinco níveis, limpando cada um a 100%.

## Controlos e ecrãs

- **Rato:** move a ferramenta e posiciona o jato.
- **Microfone:** a voz ou o sopro controlam a pressão. O browser tem de permitir o acesso ao microfone.
- **Jogar:** inicia o nível 1, usando a calibração guardada ou pedindo uma nova calibração.
- **Recalibrar:** mede novamente o ruído ambiente e regressa ao menu.
- Durante a partida, o HUD dá acesso à loja, à seleção de níveis e à tabela de recompensas. A loja e a seleção pausam o cronómetro da partida.
- O jogo inclui menu inicial, calibração, partida, modal de recompensas, loja, seleção de níveis, resultados, derrota e ecrã de vitória final.

## Persistência

O valor da calibração do microfone é guardado no `localStorage` do browser. Moedas, upgrades e níveis desbloqueados existem apenas enquanto a página do jogo está aberta; não são guardados entre carregamentos da página.

## Como executar

1. Clonar o repositório:

   ```bash
   git clone https://github.com/freitaslandre/Reef-Cleaner.git
   ```

2. Abrir a pasta num servidor local, por exemplo com a extensão *Live Server* do VS Code.
3. Abrir `index.html` no browser e permitir o acesso ao microfone.

O acesso ao microfone requer `localhost` ou HTTPS. Os browsers podem bloquear a reprodução automática de áudio; se isso acontecer, interagir com a página desbloqueia o áudio. O canvas tem dimensões fixas de **800 × 600**.

## Estrutura do projeto

```text
Reef-Cleaner/
├── index.html             # Carrega as bibliotecas e os scripts do jogo
├── sketch.js              # Estado, regras, calibração, áudio e eventos de rato
├── Dirt.js                # Manchas de sujidade e respetiva limpeza
├── UI.js                  # Cenário, HUD, loja e ecrãs
├── player.js              # Ferramenta do jogador e representação do jato
├── Assets.js              # Desenhos procedurais usados pela interface e cenário
├── p5/
│   ├── p5.js              # Biblioteca p5.js
│   └── soundlib/
│       └── p5.sound.js    # Biblioteca de áudio p5.sound
├── DIARIO.md              # Diário de desenvolvimento
└── README.md
```

## Créditos

- [p5.js](https://p5js.org/) e p5.sound — bibliotecas usadas para desenho, interação e áudio.
- Os elementos visuais do jogo são desenhados proceduralmente em `Assets.js`; a música e os efeitos sonoros são gerados com osciladores e ruído do p5.sound. O projeto não carrega ficheiros externos de imagem ou de áudio.

## Utilização de IA

Foi utilizada IA generativa como apoio ao desenvolvimento, à revisão e à documentação do projeto. O diário de desenvolvimento regista as ferramentas e utilizações descritas em cada sessão.

## Diário de desenvolvimento

O registo das sessões, decisões, problemas e utilização de ferramentas de IA encontra-se em [DIARIO.md](./DIARIO.md).
