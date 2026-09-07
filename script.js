const container = document.querySelector("#produtos");
const botoes = document.querySelectorAll(".categoria");
const campoBusca = document.querySelector("#busca");

let categoriaSelecionada = "Todos";
let textoBusca = "";
botoes[0].classList.add("ativo");

fetch("produtos.json")
    .then(resposta => resposta.json())
    .then(dados => {

        function mostrarProdutos() {
            container.innerHTML = ""; //limpa a div com id produto, que esta em container

            let produtosFiltrados;
            
            produtosFiltrados = dados.filter(produto => {
                const correspondeCategoria =
                    categoriaSelecionada === "Todos" || produto.categoria === categoriaSelecionada; //categoria é igual a Todos? || categoria deste produto é igual a categoria que o usuário selecionou?

                const correspondeBusca = produto.nome.toLowerCase().includes(textoBusca.trim().toLowerCase()); //o nome desse produto contém o texto que o usuário pesquisou? Deixa tudo minusculos e sem espaços para ser mais resistente a erros de digitação.
                

                return correspondeCategoria && correspondeBusca;
            });

            if (produtosFiltrados.length === 0) { 
                container.innerHTML = `
                    <div class="sem-produtos">
                        <img src="images/produto-nao-encontrado.png" alt="Nenhum produto encontrado">
                        <h2>Nenhum produto encontrado</h2>
                        <p>Tente buscar outro produto.</p>
                    </div>
                `;
            }
            

            for (const produto of produtosFiltrados) { //cria os cards no ecommerce
                const card = document.createElement("div"); //cria a div

                card.classList.add("card"); //adiciona a classe CSS

                card.innerHTML = `
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <h2>${produto.nome}</h2>
                    <p class="preco">${produto.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}</p>
                    <div class="info">
                        <p>🎮 ${produto.categoria}</p>
                        <p>📦 ${produto.estoque} em estoque</p>
                    </div>
                `;
                container.appendChild(card);
            }
        }

    mostrarProdutos();

    for (const botao of botoes) {
         botao.addEventListener("click", () => {

            for (const botao of botoes){
                botao.classList.remove("ativo"); //remove class ativo do antigo botao selecionado
            }

            botao.classList.add("ativo"); //adiciona class para o novo botao selecionado

            categoriaSelecionada = botao.textContent; //categoria digitada pelo usuário
            mostrarProdutos(); //executa novamente para atualizar os produtos da página
        });
    }

    campoBusca.addEventListener("input",() => { 
        textoBusca = campoBusca.value ; //pega conteúdo que esta dentro do input
        mostrarProdutos();
    });

    });