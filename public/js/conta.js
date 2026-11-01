function atualizarMenu() {
    var logado = sessionStorage.NOME_USUARIO != null;

    document.getElementById("link-conta").classList.toggle("escondido", logado);
    document.getElementById("btn-sair").classList.toggle("escondido", !logado);
}

function sair() {
    sessionStorage.clear();
    window.location = "index.html";
}

atualizarMenu();
