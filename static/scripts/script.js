const $meuform = document.querySelector("#meu-form");

let transacoes = [];
let editando = false;
let transacaoId = null;

// PROJETO - CARREGAR
window.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("http://127.0.0.1:5000/api/transacoes");
  const dados = await response.json();
  transacoes = dados;
  carregarTransacoes(transacoes);
});

// PROJETO - CRIAR
$meuform.addEventListener("submit", async (e) => {
  e.preventDefault();
  const descricao = document.getElementById('form-desc')
  const valor = document.getElementById('form-valor')
  const tipo = $meuform["radio-name"].value;


  if (!editando) {
    const response = await fetch("http://127.0.0.1:5000/api/transacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descricao,
        valor,
        tipo,
        dataFormatada
      }),
    });

    const dados = await response.json();
    transacoes.push(dados);
    carregarTransacoes(transacoes);
  } else {
    const response = await fetch(`http://127.0.0.1:5000/api/transacoes/${transacaoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descricao,
        valor,
        tipo,
        dataFormatada
      }),
    });

    const updateTransacao = await response.json();
    transacoes = transacoes.map((transacao) => transacao.idtransacao === updateTransacao.idtransacao ? updateTransacao : transacao);

    carregarTransacoes(transacoes);

    editando = false;
    transacaoId = null;
  }
  // location.reload();
  $meuform.reset();
});


function carregarTransacoes(transacoes) {
  const transacoesLista = document.getElementById("corpoTabela");
  transacoesLista.innerHTML = "";

  transacoes.forEach((transacao) => {
    const transacaoItem = document.createElement("tr");
    transacaoItem.innerHTML = `
      <td>${transacao.descricao}</td>
      <td>${transacao.valor}</td>
      <td class="tipo">${transacao.tipo}</td>
      <td>${transacao.data}</td>
      <td class="btns">
        <i data-id"${transacao.idtransacao} class="bi bi-pencil-fill btn-edit""></i>
        <i data-id"${transacao.idtransacao} class="bi bi-trash3-fill btn-delete""></i>
      </td>
    `;

    // deletar transacao
    const btnDelete = transacaoItem.querySelector(".btn-delete");
    btnDelete.addEventListener("click", async (e) => {
      const response = await fetch(
        `http://127.0.0.1:5000/api/transacoes/${transacao.idtransacao}`, {
        method: "DELETE",
      });

      const data = await response.json();

      transacoes = transacoes.filter(
        (transacao) => transacao.idtransacao !== data.idtransacao
      );
      carregarTransacoes(transacoes);
    });

    transacoesLista.appendChild(transacaoItem);

    //editar transacao
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
  });
}


// // CARREGAR CARDS
// window.addEventListener("DOMContentLoaded", async () => {
//   const response = await fetch("http:127.0.1:5000/valores")
//   const dados = await response.json()
//   valores = dados
//   console.log(valores.saldo)
// })

// window.onload