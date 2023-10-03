// valores dos cards
function calcularTipo(tipo) {
  return projeto.transacoes.reduce((total, transacao) => {
    if (transacao.tipo === tipo) {
      return total + parseFloat(transacao.valor) || 0;
    }
    return total;
  }, 0);
}

function calcularProventos() {
  return calcularTipo("Entrada");
}

function calcularGastos() {
  return calcularTipo("Saida");
}

function atualizarPGS() {
  const totalProventos = calcularProventos() || 0;
  const totalGastos = calcularGastos() || 0;
  const totalSaldo = totalProventos - totalGastos;

  $proventos.innerText = formatarMoeda(totalProventos);
  $gastos.textContent = formatarMoeda(totalGastos);
  $saldo.textContent = formatarMoeda(totalSaldo);

  valorNegativo();
  atualizarFonteSize();
}

//funcao para adicionar a cor vermelha e icone no saldo caso seja negativo
function valorNegativo() {
  let saldoStr = $saldo.textContent.substring(2);

  // Converte a string para um número
  let saldo = parseFloat(saldoStr.replace(",", "."));

  let selecionarIcone = document.querySelector(".bi-check-circle-fill");
  let selecionarIcone2 = document.querySelector(
    ".bi-exclamation-triangle-fill"
  );

  if (saldo < 0) {
    $saldo.style.color = "rgb(123, 21, 21)";
    selecionarIcone.style.display = "none";
    selecionarIcone2.style.display = "block";
  } else {
    $saldo.style.color = "";
    selecionarIcone.style.display = "block";
    selecionarIcone2.style.display = "none";
  }
}

function atualizarFonteSize() {
  let $comprimentoProventos = $proventos.textContent.length;
  let $comprimentoGastos = $gastos.textContent.length;
  let $comprimentoSaldo = $saldo.textContent.length;

  if (
    $comprimentoProventos > 17 ||
    $comprimentoGastos > 17 ||
    $comprimentoSaldo > 17
  ) {
    $proventos.style.fontSize = "21px";
    $gastos.style.fontSize = "21px";
    $saldo.style.fontSize = "21px";

    // } else if ($comprimentoProventos > 21 || $comprimentoGastos > 21 || $comprimentoSaldo > 21) {
    //     $proventos.style.fontSize = '18px'
    //     $gastos.style.fontSize = '18px'
    //     $saldo.style.fontSize = '18px'
  } else {
    $proventos.style.fontSize = "24px";
    $gastos.style.fontSize = "24px";
    $saldo.style.fontSize = "24px";
  }
}

function formatarMoeda(valor) {
  return `R$ ${valor
    .toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
}
