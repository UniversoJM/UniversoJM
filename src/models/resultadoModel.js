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

// a melhor pontuação de cada participante, da maior para a menor (ranking dos fãs)
// em caso de empate, fica na frente quem fez a pontuação primeiro (menor id)
function buscarRanking() {
    var instrucaoSql = `
        SELECT u.id AS idUsuario, u.nome, r.pontuacao, r.nivel
        FROM resultado_quiz r
        JOIN usuario u ON u.id = r.fk_usuario
        WHERE r.id = (
            SELECT r2.id FROM resultado_quiz r2
            WHERE r2.fk_usuario = r.fk_usuario
            ORDER BY r2.pontuacao DESC, r2.id DESC
            LIMIT 1
        )
        ORDER BY r.pontuacao DESC, r.id ASC;
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
    buscarRanking,
    buscarMelhorDoUsuario
};