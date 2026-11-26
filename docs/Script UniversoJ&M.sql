CREATE DATABASE universo_jm;
USE universo_jm;

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(45) NOT NULL
);

CREATE TABLE resultado_quiz (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    pontuacao INT NOT NULL,
    nivel VARCHAR(30) NOT NULL,
    respostas VARCHAR(40),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

SHOW COLUMNS FROM resultado_quiz;

-- Todos os usuários
SELECT * FROM usuario;

-- Todos os resultados do quiz
SELECT * FROM resultado_quiz;

-- LIMPAR TUDO (apaga resultados e logins)
-- Rodar os três comandos juntos e nesta ordem:
-- primeiro os resultados, porque eles dependem do usuário

DELETE FROM resultado_quiz WHERE id > 0;

DELETE FROM usuario WHERE id > 0;

ALTER TABLE usuario AUTO_INCREMENT = 1;