var express = require("express");
var router = express.Router();

var resultadoController = require("../controllers/resultadoController");

// o quiz manda a pontuação para cá quando termina
router.post("/salvar", function (req, res) {
    resultadoController.salvar(req, res);
});

// o dashboard busca os números e gráficos aqui (o id é do usuário logado, para o KPI "Sua pontuação")
router.get("/dados/:idUsuario", function (req, res) {
    resultadoController.dados(req, res);
});

module.exports = router;