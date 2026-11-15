var resultadoModel = require("../models/resultadoModel");

var niveisValidos = ["Novato do Sertanejo", "Admirador J&M", "Coração J&M", "Lenda J&M"];

// pontos máximos de cada uma das 10 perguntas do quiz, na ordem
var maximos = [3, 2, 2, 2, 2, 2, 3, 3, 3, 3];

// posições (0 = primeira pergunta) das 5 perguntas que têm resposta certa
var perguntasConhecimento = [1, 2, 3, 4, 5];

// confere se "respostas" tem 10 números, cada um dentro do máximo da pergunta, e se somam a pontuação
function respostasValidas(respostas, pontuacao) {
    if (typeof respostas != "string") {
        return false;
    }

    var partes = respostas.split(",");
    if (partes.length != maximos.length) {
        return false;
    }

    var soma = 0;
    for (var i = 0; i < partes.length; i++) {
        var pontos = Number(partes[i]);
        if (partes[i] === "" || isNaN(pontos) || pontos < 0 || pontos > maximos[i]) {
            return false;
        }
        soma += pontos;
    }

    return soma == pontuacao;
}

function salvar(req, res) {
    var fkUsuario = req.body.idUsuarioServer;
    var pontuacao = req.body.pontuacaoServer;
    var nivel = req.body.nivelServer;
    var respostas = req.body.respostasServer;

    if (fkUsuario == undefined) {
        res.status(400).send("Seu id de usuário está undefined!");
    } else if (pontuacao == undefined || isNaN(pontuacao) || pontuacao < 0 || pontuacao > 25) {
        res.status(400).send("Sua pontuação é inválida (use de 0 a 25)!");
    } else if (niveisValidos.includes(nivel) == false) {
        res.status(400).send("Seu nível é inválido!");
    } else if (respostasValidas(respostas, pontuacao) == false) {
        res.status(400).send("Suas respostas são inválidas!");
    } else {
        resultadoModel.salvar(fkUsuario, pontuacao, nivel, respostas)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log("\nHouve um erro ao salvar o resultado! Erro: ", erro.sqlMessage);

                // o id guardado no navegador não existe mais na tabela usuario (ex: usuários apagados no banco)
                if (erro.code == "ER_NO_REFERENCED_ROW_2") {
                    res.status(404).json("Usuário não encontrado. Saia e entre de novo.");
                } else {
                    res.status(500).json(erro.sqlMessage);
                }
            });
    }
}

// devolve tudo que o dashboard precisa em um único JSON
function dados(req, res) {
    var idUsuario = req.params.idUsuario;

    Promise.all([
        resultadoModel.contarParticipantes(),
        resultadoModel.contarPorNivel(),
        resultadoModel.buscarRespostas(),
        resultadoModel.buscarMelhorDoUsuario(idUsuario)
    ])
        .then(function (respostas) {

            // 4 grupos, de acordo com o que a pessoa respondeu em "Você conhece Jorge & Mateus?"
            // grupo 0 = Não conheço muito ... grupo 3 = Sou fã (é a quantidade de pontos daquela resposta)
            var grupos = [];
            for (var g = 0; g < 4; g++) {
                grupos.push({ pontos: g, pessoas: 0, soma: 0 });
            }

            // máximo de pontos nas perguntas que têm resposta certa
            var maximoConhecimento = 0;
            for (var c = 0; c < perguntasConhecimento.length; c++) {
                maximoConhecimento += maximos[perguntasConhecimento[c]];
            }

            var somaGeral = 0;
            var pessoasGeral = 0;

            for (var j = 0; j < respostas[2].length; j++) {
                var partes = respostas[2][j].respostas.split(",");
                if (partes.length == maximos.length) {
                    var grupo = Number(partes[0]);

                    var acertos = 0;
                    for (var k = 0; k < perguntasConhecimento.length; k++) {
                        acertos += Number(partes[perguntasConhecimento[k]]);
                    }

                    if (grupo >= 0 && grupo <= 3) {
                        grupos[grupo].pessoas++;
                        grupos[grupo].soma += acertos;
                        somaGeral += acertos;
                        pessoasGeral++;
                    }
                }
            }

            // acerto médio de cada grupo, em % (null se ninguém está no grupo)
            var resultadoGrupos = [];
            for (var m = 0; m < grupos.length; m++) {
                var acerto = null;
                if (grupos[m].pessoas > 0) {
                    acerto = Math.round(grupos[m].soma / grupos[m].pessoas / maximoConhecimento * 100);
                }
                resultadoGrupos.push({ pontos: grupos[m].pontos, pessoas: grupos[m].pessoas, acerto: acerto });
            }

            var acertoGeral = null;
            if (pessoasGeral > 0) {
                acertoGeral = Math.round(somaGeral / pessoasGeral / maximoConhecimento * 100);
            }

            var melhor = null;
            if (respostas[3].length > 0) {
                melhor = respostas[3][0];
            }

            res.json({
                participantes: respostas[0][0].participantes,
                niveis: respostas[1],
                grupos: resultadoGrupos,
                acertoGeral: acertoGeral,
                melhor: melhor
            });
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao buscar os resultados! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    salvar,
    dados
};