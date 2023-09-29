// $ indica q é um elemento html
function formatarData(numero) {
    if(numero <= 9) {
        return "0" + numero
    } else {
        return numero
    }
}

let dataAtual = new Date()
let dataFormatada = (formatarData(dataAtual.getDate().toString()) + "/" + (formatarData(dataAtual.getMonth()+1).toString()) + "/" + dataAtual.getFullYear())

let $proventos = document.getElementById('proventos')
let $gastos = document.getElementById('gastos')
let $saldo = document.getElementById('saldo')

let transacoes = []


// PROJETO - CARREGAR
window.addEventListener('DOMContentLoaded', async (e) => {
    const response = await fetch('http://localhost:5000/api/transacoes', {
        method: 'GET'
    })
    
    const dados = await response.json()
    transacoes = dados
    carregarTransacao(transacoes)
})

function carregarTransacao(transacoes) {
    document.querySelector('tablehead')
}

// CRUD [CREATE] PROJETO - CRIAR
const $meuform = document.querySelector('#meu-form');
$meuform.addEventListener('submit', async e => {
  e.preventDefault();
  const descricao = $meuform['desc-name'].value;
  const valor = $meuform['valor-name'].value;
  const tipo = $meuform['radio-name'].value;
  
//   console.log(descricao, valor, tipo);
  
  const response = await fetch('http://127.0.0.1:5000/api/transacoes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ descricao, valor, tipo })
  });

  const dados = await response.json();
  console.log(dados)
  $meuform.reset()
});



document.getElementById('corpoTabela').addEventListener('click', function (infosDaTransacao) {
    const elementoAtual = infosDaTransacao.target

    if (elementoAtual.classList.contains('bi-caret-up-fill') || elementoAtual.classList.contains('bi-caret-down-fill')) {
        const id = elementoAtual.parentNode.parentNode.getAttribute('data-id')

        // Encontre a transação correspondente pelo ID
        const transacao = projeto.transacoes.find(t => t.id === Number(id))

        if (transacao.tipo === 'Entrada') {
            transacao.tipo = 'Saida'
        } else {
            transacao.tipo = 'Entrada'
        }

        // Atualize a classe do ícone na tabela para refletir o novo tipo
        elementoAtual.classList.toggle('bi-caret-up-fill')
        elementoAtual.classList.toggle('bi-caret-down-fill')

        // Atualize o objeto de transação no projeto com o novo tipo
        projeto.atualizarTipoTransacao(id, transacao.tipo)

        atualizarPGS()
    }
})

// valores dos cards
function calcularTipo(tipo) {
    return projeto.transacoes.reduce((total, transacao) => {
        if (transacao.tipo === tipo) {
            return total + parseFloat(transacao.valor) || 0
        }
        return total
    }, 0)
}

function calcularProventos() {
    return calcularTipo('Entrada')
}

function calcularGastos() {
    return calcularTipo('Saida')
}

function atualizarPGS() {
    const totalProventos = calcularProventos() || 0
    const totalGastos = calcularGastos() || 0
    const totalSaldo = totalProventos - totalGastos

    $proventos.innerText = formatarMoeda(totalProventos)
    $gastos.textContent = formatarMoeda(totalGastos)
    $saldo.textContent = formatarMoeda(totalSaldo)

    valorNegativo()
    atualizarFonteSize()
}


//funcao para verificar se o item clicado está sendo atualizado apenas com decimais e inteiros
document.addEventListener('input', function (event) {
    if (event.target.classList.contains('numerico')) {
        let content = event.target.textContent
        content = content.replace(/,/g, '.')

        const isNumeric = /^-?\d+(\.\d*)?(\,\d*)?$/.test(content)

        if (!isNumeric) {
            event.target.textContent = event.target.previousValue || ''
        } else {
            event.target.previousValue = content
            atualizarPGS()
            
        }
    }
})

//funcao para adicionar a cor vermelha e icone no saldo caso seja negativo
function valorNegativo() {
    let saldoStr = $saldo.textContent.substring(2)
    
    // Converte a string para um número
    let saldo = parseFloat(saldoStr.replace(',', '.')) 

    let selecionarIcone = document.querySelector('.bi-check-circle-fill')
    let selecionarIcone2 = document.querySelector('.bi-exclamation-triangle-fill')

    if (saldo < 0) {
        $saldo.style.color = "rgb(123, 21, 21)"
        selecionarIcone.style.display = 'none'
        selecionarIcone2.style.display = 'block'
    } else {
        $saldo.style.color = ""
        selecionarIcone.style.display = 'block'
        selecionarIcone2.style.display = 'none'
    }
}

function atualizarFonteSize() {
    let $comprimentoProventos = $proventos.textContent.length
    let $comprimentoGastos = $gastos.textContent.length
    let $comprimentoSaldo = $saldo.textContent.length

    if ($comprimentoProventos > 17 || $comprimentoGastos > 17 || $comprimentoSaldo > 17) {
        $proventos.style.fontSize = '21px'
        $gastos.style.fontSize = '21px'
        $saldo.style.fontSize = '21px'

        console.log($comprimentoSaldo)
    // } else if ($comprimentoProventos > 21 || $comprimentoGastos > 21 || $comprimentoSaldo > 21) {
    //     $proventos.style.fontSize = '18px'
    //     $gastos.style.fontSize = '18px'
    //     $saldo.style.fontSize = '18px'
     } else {
        $proventos.style.fontSize = '24px'
        $gastos.style.fontSize = '24px'
        $saldo.style.fontSize = '24px'
    }
}

function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
}