# Reef Cleaner

Jogo interativo em **p5.js** sobre a recuperação de recifes de coral, controlado por **rato + microfone**.

Trabalho prático de *Sistemas Multimédia* · Engenharia da Computação Gráfica e Multimédia (ECGM) · 2026-2027

- **Autor:** André Freitas
- **N.º de aluno:** 33782
- **Tema atribuído:** Coral Reef Restoration

> **Estado:** em desenvolvimento.

## Sobre o jogo

O jogador restaura um recife de coral degradado e branqueado, removendo algas, sedimentos e lixo com um limpador subaquático suave.

- O jogo tem **5 níveis**. Começa-se no nível 1, com a ferramenta de nível 1 e 0 moedas.
- Cada nível dura **60 s**.
- O **rato** move o limpador.
- O **volume da voz/sopro** (microfone) controla a intensidade do jato, que é mais eficaz quanto mais perto estiver da zona ideal. Fraco demais não limpa e forte demais danifica o coral.
- No fim de cada nível, o jogador vê a % de recife limpa e as moedas ganhas (≥ 75%, ≥ 90% e 100%).
- As moedas servem para melhorar a ferramenta na loja de upgrades.
- **Objetivo final:** completar o nível 5 com 100% de limpeza.

## Funcionalidades planeadas

- Controlo apenas por microfone + rato
- Calibração do microfone e histerese entre dois limiares
- Limpeza por camada de sujidade, com % limpa calculada por amostragem de píxeis
- Aleatoriedade controlada (sujidade e peixes gerados aleatoriamente)
- Colisões entre objetos (jato, sujidade, peixes, corais)
- Sons e feedback constante (tempo, % limpa, moedas, nível, saúde do recife)
- Ecrãs: Início, Execução, Resultado/Repetir e Loja de upgrades
- Sistema de moedas e upgrades da ferramenta

## Como executar

1. Clonar o repositório:
```bash
   git clone https://github.com/freitaslandre/Reef-Cleaner.git
```
2. Abrir a pasta num servidor local (por exemplo, a extensão *Live Server* do VS Code). O acesso ao microfone exige `localhost` ou HTTPS.
3. Abrir `index.html` no browser e **permitir o acesso ao microfone**.

## Estrutura (prevista)

```
Reef-Cleaner/
├── index.html
├── sketch.js
├── classes/      # Game, Level, Cleaner, MicInput, Dirt, Fish, Shop
├── assets/       # imagens e sons
└── README.md
```

## Créditos

Material não original (imagens, sons, bibliotecas) será indicado aqui, com a respetiva origem.

- [p5.js](https://p5js.org/) e p5.sound

## Utilização de IA

Foi usada IA generativa como apoio à ideia, ao planeamento e à revisão. O registo detalhado consta do diário de desenvolvimento.
