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

// quantas pessoas terminaram o quiz
function contarParticipantes() {
    var instrucaoSql = `
        SELECT COUNT(DISTINCT fk_usuario) AS participantes FROM resultado_quiz;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// quantas pessoas em cada nível, contando só a primeira tentativa de cada uma (rosca "Quem são os participantes")
function contarPorNivel() {
    var instrucaoSql = `
        SELECT nivel, COUNT(*) AS qtd
        FROM resultado_quiz r
        WHERE r.id = (SELECT MIN(id) FROM resultado_quiz WHERE fk_usuario = r.fk_usuario)
        GROUP BY nivel;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// a primeira tentativa de cada participante, da maior pontuação para a menor (ranking dos fãs)
// em caso de empate, fica na frente quem fez a pontuação primeiro (menor id)
function buscarRanking() {
    var instrucaoSql = `
        SELECT u.id AS idUsuario, u.nome, r.pontuacao, r.nivel
        FROM resultado_quiz r
        JOIN usuario u ON u.id = r.fk_usuario
        WHERE r.id = (SELECT MIN(r2.id) FROM resultado_quiz r2 WHERE r2.fk_usuario = r.fk_usuario)
        ORDER BY r.pontuacao DESC, r.id ASC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// a primeira tentativa de um usuário (o KPI "Sua pontuação")
function buscarPrimeiraDoUsuario(idUsuario) {
    var instrucaoSql = `
        SELECT pontuacao, nivel FROM resultado_quiz
        WHERE fk_usuario = ?
        ORDER BY id ASC
        LIMIT 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario]);
}

module.exports = {
    salvar,
    contarParticipantes,
    contarPorNivel,
    buscarRanking,
    buscarPrimeiraDoUsuario
};