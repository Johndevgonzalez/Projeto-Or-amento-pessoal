class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor ) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		//embora this faça referencia para um objeto baseado em classe
		// esse exemplo se encaixa para obj literais, funcoes construtoras de obj
		//baseados em classes
		for (let i in this ) {
			if(this[i] == undefined || this[i] == '' || this[i] == null){
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1 
	}

	gravar(d) {
		// dois parametros(identificacao do objeto)(dado para armazenar)
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d)) //transforma o obj literal em Json String

		localStorage.setItem('id', id)
	
	}

	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas no localstorage
		//montagem do array de despesa
		for(let i = 1; i <= id; i++) {
			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i)) //transforma obj JSON em obj literal

			// se existe a possibilidade de haver indices removidos
			// nestes casos vamos pular esses indices
			if(despesa === null) {
				continue
			}
			//recuperando o id da key de cada despesa
			despesa.id = i
			despesas.push(despesa) // push acrescenta
		}

		//console.log(despesas)
		return despesas
	}

	pesquisar(despesa) {
		
		let despesasFiltradas = Array()

		despesasFiltradas = this.recuperarTodosRegistros()

		console.log(despesa)

		//ano
		if(despesa.ano != '') {
			console.log('filtro ano')
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		//mes
		if(despesa.mes != '') {
			console.log('filtro mes')
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if(despesa.dia != '') {
			console.log('filtro dia')
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if(despesa.tipo != '') {
			console.log('filtro tipo')
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if(despesa.descricao != '') {
			console.log('filtro descricao')
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if(despesa.valor != '') {
			console.log('filtro valor')
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas
	}

	//criando um metodo para remover os id de despesas
	remover(id) {
		localStorage.removeItem(id)
	}

}

let bd = new Bd()


function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	console.log(ano.value, mes.value, dia.value, 
		tipo.value, descricao.value, valor.value)

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
		)

	if(despesa.validarDados()){
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'//innerHTML  pega os target dentro de h1,h5
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML  = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML  = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso	
		$('#modalRegistraDespesa').modal('show')

		ano.value = '' 
		mes.value = '' 
		dia.value = '' 
		tipo.value = '' 
		descricao.value = ''
		valor.value = ''
			
	} else {

		document.getElementById('modal_titulo').innerHTML  = 'Erro na gravação'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML  = 'Existem campos obrigatórios que não foram preenchidos!'
		document.getElementById('modal_btn').innerHTML  = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'
		
		//dialog de erro
		$('#modalRegistraDespesa').modal('show')
	}

}

// trabalhando na parte da consulta e listando os elementos
function carregarListaDespesa() {

	let despesas = Array()
	despesas = bd.recuperarTodosRegistros()

	// selecionando o elemento TBODY da tabela
	var listaDespesas = document.getElementById('listaDespesas')

	//percorrer o array despesas, listando cada despesa de forma dinamica
	despesas.forEach(function(d) {
		//criando a linha (tr)
		let linha = listaDespesas.insertRow()

		//criar as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//ajustar o tipo
		switch(d.tipo) {
			case '1' : d.tipo = 'Alimentação'
			break
			case '2' : d.tipo = 'Educação'
			break
			case '3' : d.tipo = 'Lazer'
			break
			case '4' : d.tipo = 'Saúde'
			break
			case '5' : d.tipo = 'Transporte'
			break
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor
		// criar o botã de exclusao
		let btn = document.createElement('button')
		//acrescentando uma classe para o botao
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class= "fas fa-times"></i>'  //fonte awesome icon
		btn.id = `id_despesa_${d.id}` // para evitar conflito dentro da aplicacao 		
		btn.onclick = function() {
			//remover despesas
			let id = this.id.replace('id_despesa_','') // substitui o 1 parametro pelo 2'
			//alert(id)
			bd.remover(id)

			// para atualizar a pagina apos a exclusao do id
			window.location.reload()

		}		
		linha.insertCell(4).append(btn) //append -> inclusao do elemento
		//console.log(d) - ver o id acrescentado 
	})	

	
}

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)

	// selecionando o elemento TBODY da tabela
	var listaDespesas = document.getElementById('listaDespesas')
	//para limpar
	listaDespesas.innerHTML = ''

	//percorrer o array despesas, listando cada despesa de forma dinamica
	despesas.forEach(function(d) {
		//criando a linha (tr)
		let linha = listaDespesas.insertRow()

		//criar as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//ajustar o tipo
		switch(d.tipo) {
			case '1' : d.tipo = 'Alimentação'
			break
			case '2' : d.tipo = 'Educação'
			break
			case '3' : d.tipo = 'Lazer'
			break
			case '4' : d.tipo = 'Saúde'
			break
			case '5' : d.tipo = 'Transporte'
			break
		}
		linha.insertCell(1).innerHTML = d.tipo

		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor
	})	
}

