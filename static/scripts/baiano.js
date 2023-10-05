//definindo as const do cards

const entrada = document.querySelector("#card-entrada");
const saida = document.querySelector("#card-saida");
const saldo = document.querySelector("#card-saldo");

// definindo as conts do botão e da tabela
const btnSave = document.querySelector("#button");
const tbody = document.querySelector("tbody");

let transacao = [];
let edit = false;
let transacaoId = null;

window.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("http://localhost:5000/api/transacoes");
    const data = await response.json()
    transacao = data;

    insertItem(transacao);

});

// clique do botão onde será salvo os dados
btnSave.onclick = async (e) => {
    e.preventDefault();

    const descricao = document.querySelector("#descricao").value;
    const valor = document.querySelector("#valor").value;
    const modalidade = document.querySelector('input[name="modalidade"]:checked').value;

    const response = await fetch('http://localhost:5000/api/transacoes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            descricao: descricao,
            valor: valor,
            modalidade: modalidade
        })
    });

    const data = await response.json();
    console.log(data);
    insertItem(data)

};

function insertItem(transacao) {
    let tr = document.createElement("tr");

    tr.innerHTML = (`
    <td>${transacao.descricao}</td>
    <td>${transacao.valor}</td>
    <td>04/10/2023</td>
    <td>${transacao.modalidade === "entrada"
            ? '<p>Entrada</p>'
            : '<p>Saída</p>'}
    </td>
    <td>
        <button onclick="editarItem(true, ${transacao.id})" id="create"><ion-icon name="create-outline" class="group-icons-create"></ion-icon></button>
        <button onclick="deleteItem(${transacao.id})" id="trash"><ion-icon name="trash-outline" class="group-icons-trash"></ion-icon></button>
    </td>
    `);

    // Certifique-se de ter uma referência válida para o elemento tbody
    const tbody = document.querySelector("tbody");
    tbody.appendChild(tr);
}

function formatMoney(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};