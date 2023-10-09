// $ indica q é um elemento html

let transacoes = [];
let editando = false;
let transacaoId = null;

// CRUD [CREATE] PROJETO - CRIAR
const $meuform = document.querySelector("#meu-form");
$meuform.addEventListener("submit", async (e) => {
  e.preventDefault();
  const descricao = $meuform["desc-name"].value;
  const valor = $meuform["valor-name"].value;
  const tipo = $meuform["radio-name"].value;

  if (!editando) {
    const response = await fetch("http://127.0.0.1:5000/api/transacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ descricao, valor, tipo }),
    });

    const dados = await response.json();
    transacoes.unshift(dados);
  } else {
    const response = await fetch(
      `http://127.0.0.1:5000/api/transacoes/${transacaoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ descricao, valor, tipo }),
      }
    );

    const updateTransacao = await response.json();
    transacoes = transacoes.map((transacao) =>
      transacao.id === updateTransacao.idtransacao ? updateTransacao : transacao
    );
    console.log(transacoes);

    editando = false;
    transacaoId = null;
  }

  carregarTran(transacoes);

  $meuform.reset();
});

// PROJETO - CARREGAR
window.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("http://127.0.0.1:5000/api/transacoes");
  const dados = await response.json();
  transacoes = dados;
  carregarTran(transacoes);
});

function carregarTran(transacoes) {
  const transacoesLista = document.getElementById("corpoTabela");
  transacoesLista.innerHTML = "";

  transacoes.forEach((transacao) => {
    const transacaoItem = document.createElement("tr");
    transacaoItem.innerHTML = `
      <td>${transacao.descricao}</td>
      <td>${transacao.valor}</td>
      <td>${transacao.tipo}</td>
      <td>${transacao.data}</td>
      <td class="btns">
        <i class="bi bi-pencil-fill btn-edit"></i>
        <i class="bi bi-trash3-fill btn-delete"></i>
      </td>
    `;
    const btnDelete = transacaoItem.querySelector(".btn-delete");
    btnDelete.addEventListener("click", async () => {
      const response = await fetch(
        `http://127.0.0.1:5000/api/transacoes/${transacao.idtransacao}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      transacoes = transacoes.filter(
        (transacao) => transacao.idtransacao !== data.idtransacao
      );
      carregarTran(transacoes);
    });

    const btnEdit = transacaoItem.querySelector(".btn-edit");
    btnEdit.addEventListener("click", async (e) => {
      const response = await fetch(
        `http://127.0.0.1:5000/api/transacoes/${transacao.idtransacao}`
      );
      const data = await response.json();
      $meuform["desc-name"].value = data.descricao;
      $meuform["valor-name"].value = data.valor;
      $meuform["radio-name"].value = data.tipo;
      let type = $meuform["radio-name"].value;
      if ($meuform["radio-name"].value == "Entrada") {
        document.querySelector("#entrada").checked = true;
      } else {
        document.querySelector("#saida").checked = true;
      }

      editando = true;
      transacaoId = transacao.idtransacao;
    });

    transacoesLista.appendChild(transacaoItem);
  });
}

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
