const container = document.querySelector("#produtos");
const botoes = document.querySelectorAll(".categoria");
const campoBusca = document.querySelector("#busca");

let categoriaSelecionada = "Todos";
let textoBusca = "";

fetch("produtos.json")
    .then(resposta => resposta.json())
    .then(dados => {

        function mostrarProdutos() {
            container.innerHTML = "";

            let produtosFiltrados;
            
            produtosFiltrados = dados.filter(produto => {
                const correspondeCategoria =
                    categoriaSelecionada === "Todos" || produto.categoria === categoriaSelecionada;

                const correspondeBusca = produto.nome.includes(textoBusca);

                return correspondeCategoria && correspondeBusca;
            });

            for (const produto of produtosFiltrados) {
                const card = document.createElement("div");

                card.classList.add("card");

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
            categoriaSelecionada = botao.textContent; //categoria digitada pelo usuário
            mostrarProdutos(); //executa novamente para atualizar os produtos da página
        });
    }

    campoBusca.addEventListener("input",() => { 
        textoBusca = campoBusca.value ; //pega conteúdo que esta dentro do input
        mostrarProdutos();
    });

    });