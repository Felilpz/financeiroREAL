// data
function formatarData(numero) {
    if (numero <= 9) {
        return "0" + numero;
    } else {
        return numero;
    }
}

let dataAtual = new Date();
let dataFormatada =
    formatarData(dataAtual.getDate().toString()) +
    "/" +
    formatarData(dataAtual.getMonth() + 1).toString() +
    "/" +
    dataAtual.getFullYear();
console.log(dataFormatada);
