var resultadoModel = require("../models/resultadoModel");

var niveisValidos = ["Novato do Sertanejo", "Ouvinte de Estrada", "Sofredor Profissional", "Lenda J&M"];

// pontos máximos de cada uma das 10 perguntas do quiz, na ordem
var maximos = [3, 2, 2, 2, 2, 2, 3, 3, 3, 3];

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

                // usuário não existe mais
                if (erro.code == "ER_NO_REFERENCED_ROW_2") {
                    res.status(404).json("Usuário não encontrado. Saia e entre de novo.");
                } else {
                    res.status(500).json(erro.sqlMessage);
                }
            });
    }
}

// só o primeiro nome aparece no ranking (os outros participantes não veem o nome completo)
function primeiroNome(nome) {
    return String(nome).trim().split(" ")[0];
}

// devolve tudo que o dashboard precisa em um único JSON
function dados(req, res) {
    var idUsuario = req.params.idUsuario;

    Promise.all([
        resultadoModel.contarParticipantes(),
        resultadoModel.contarPorNivel(),
        resultadoModel.buscarMelhorDoUsuario(idUsuario),
        resultadoModel.buscarRanking()
    ])
        .then(function (respostas) {

            // ranking: top 5
            var lista = respostas[3];
            var ranking = [];
            var eu = null;

            for (var i = 0; i < lista.length; i++) {
                var item = {
                    posicao: i + 1,
                    nome: primeiroNome(lista[i].nome),
                    pontuacao: lista[i].pontuacao,
                    nivel: lista[i].nivel,
                    voce: lista[i].idUsuario == idUsuario
                };

                if (i < 5) {
                    ranking.push(item);
                }
                if (item.voce) {
                    eu = item;
                }
            }

            var melhor = null;
            if (respostas[2].length > 0) {
                melhor = respostas[2][0];
            }

            res.json({
                participantes: respostas[0][0].participantes,
                niveis: respostas[1],
                melhor: melhor,
                ranking: ranking,
                eu: eu
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