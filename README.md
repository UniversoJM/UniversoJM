# 🎶 Universo J&M

Site de fãs da dupla sertaneja **Jorge & Mateus**, com a história da dupla, discografia, quiz e painel de resultados.

## 💛 Sobre o projeto

O Universo J&M reúne em um só lugar o que a música de Jorge & Mateus significa para um fã: memórias, amizade e emoção. O visitante conhece a trajetória da dupla, responde a um quiz sobre ela e descobre em que posição fica no ranking dos fãs.

O projeto nasceu de uma história pessoal: ouvir a dupla com o pai e ir a shows com primos e amigos. A ideia foi transformar essa ligação em um site.

## 🧭 O que tem no site

- **Home:** apresentação da dupla e acesso rápido às seções.
- **História:** quem são Jorge e Mateus, com fotos e as capas dos álbuns.
- **Quiz:** perguntas sobre a dupla. No final, o fã recebe uma pontuação e um nível.
- **Cadastro e login:** cada fã tem a sua conta, e o resultado do quiz fica salvo.
- **Dashboard:**
  - quantos fãs já participaram;
  - a sua pontuação e a **sua posição** no ranking;
  - um gráfico com a distribuição dos fãs por nível;
  - o **ranking dos fãs**, com a melhor pontuação de cada pessoa.

## 🛠️ Tecnologias

- **Front-end:** HTML, CSS e JavaScript
- **Back-end:** Node.js e Express
- **Banco de dados:** MySQL

## ▶️ Como rodar

```bash
npm install
npm start
```

Depois, abra `http://localhost:3333`. É preciso ter o MySQL com as tabelas `usuario` e `resultado_quiz` e um arquivo `.env` baseado no `.env.dev`.

## 📄 Licença

Distribuído sob a licença MIT.
