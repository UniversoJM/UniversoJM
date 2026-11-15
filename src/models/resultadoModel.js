var database = require("../database/config");

// grava a pontuação de um usuário quando ele termina o quiz
// "respostas" guarda os pontos de cada pergunta, separados por vírgula (ex: "3,2,0,2,2,0,3,1,2,3")
function salvar(fkUsuario, pontuacao, nivel, respostas) {
    var instrucaoSql = `
        INSERT INTO resultado_quiz (fk_usuario, pontuacao, nivel, respostas) VALUES (?, ?, ?, ?);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [fkUsuario, pontuacao, nivel, respostas]);
}

// Nas consultas abaixo, cada pessoa conta uma vez só: vale o ÚLTIMO resultado dela
// (o subselect pega o maior id de resultado_quiz daquele usuário).

// quantas pessoas terminaram o quiz
function contarParticipantes() {
    var instrucaoSql = `
        SELECT COUNT(DISTINCT fk_usuario) AS participantes FROM resultado_quiz;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// quantas pessoas em cada nível (rosca "Quem são os participantes")
function contarPorNivel() {
    var instrucaoSql = `
        SELECT nivel, COUNT(*) AS qtd
        FROM resultado_quiz r
        WHERE r.id = (SELECT MAX(id) FROM resultado_quiz WHERE fk_usuario = r.fk_usuario)
        GROUP BY nivel;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// os pontos de cada pergunta de todos os participantes (os grupos são calculados no controller)
function buscarRespostas() {
    var instrucaoSql = `
        SELECT respostas
        FROM resultado_quiz r
        WHERE respostas IS NOT NULL
        AND r.id = (SELECT MAX(id) FROM resultado_quiz WHERE fk_usuario = r.fk_usuario);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// a melhor pontuação de um usuário (o KPI "Sua melhor pontuação")
function buscarMelhorDoUsuario(idUsuario) {
    var instrucaoSql = `
        SELECT pontuacao, nivel FROM resultado_quiz
        WHERE fk_usuario = ?
        ORDER BY pontuacao DESC, id DESC
        LIMIT 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario]);
}

module.exports = {
    salvar,
    contarParticipantes,
    contarPorNivel,
    buscarRespostas,
    buscarMelhorDoUsuario
};