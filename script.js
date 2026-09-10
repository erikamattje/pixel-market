const container = document.querySelector("#produtos");
const botoes = document.querySelectorAll(".categoria");
const campoBusca = document.querySelector("#busca");

const areaCarrinho = document.createElement("div"); //cria a area do carrinho
areaCarrinho.classList.add("carrinho");
document.body.appendChild(areaCarrinho); // coloca a area do carrinho dentro de body
areaCarrinho.innerHTML = "<h2>Meu carrinho</h2>";

const carrinho = [];
const botaoCarrinho = document.querySelector("#carrinho"); //seleciona o elemento do carrinho no HTML

function mostrarCarrinho(){
    areaCarrinho.innerHTML = "";

    for (const itemCarrinho of carrinho){ //percorre cada produto/item adicionado ao array carrinho
        const item = document.createElement("div");
        item.classList.add("item-carrinho");

        const imagem = document.createElement("img");
        imagem.src = itemCarrinho.produto.imagem;        
        item.appendChild(imagem);

        const nome = document.createElement("p");
        nome.textContent = itemCarrinho.produto.nome;
        item.appendChild(nome);

        const quantidade = document.createElement("p"); // cria um elemento <p> para mostrar a quantidade do produto.
        quantidade.textContent = itemCarrinho.quantidade; // coloca dentro do <p> o número da quantidade daquele item no carrinho.
        

        const diminuir = document.createElement("button");
        diminuir.textContent = "-";
        item.appendChild(diminuir);

        item.appendChild(quantidade); // coloca o elemento <p> da quantidade dentro do elemento "item" do carrinho.

        const aumentar = document.createElement("button")
        aumentar.textContent = "+";
        item.appendChild(aumentar)

        areaCarrinho.appendChild(item);

        aumentar.addEventListener("click", () => { //para cada botão + de cada produto será associado esse evento.
            itemCarrinho.quantidade += 1;
            mostrarCarrinho();
        });

        diminuir.addEventListener("click", () => {
            if (itemCarrinho.quantidade > 1){
                itemCarrinho.quantidade -= 1;
            }
            mostrarCarrinho();
        });

        const remover = document.createElement("button")
        remover.textContent = "X";
        item.appendChild(remover);

        remover.addEventListener("click", () => {
            const indice = carrinho.findIndex(
                item => item.produto.nome === itemCarrinho.produto.nome
            )

            carrinho.splice(indice, 1);
            mostrarCarrinho();
        });

    }
};

botaoCarrinho.addEventListener("click", () => {
   mostrarCarrinho();
});

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
                const card = document.createElement("div"); //cria a div e guarda em card

                card.classList.add("card"); //adiciona a classe CSS a essa div

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
                    <button class="botao adicionar">
                        <i data-lucide="shopping-cart"></i>
                        Adicionar ao carrinho
                    </button>
                `;
                container.appendChild(card); //adicione a div que esta em card, dentro de container

                const botaoAdicionar = card.querySelector(".adicionar"); //procura elementos que tenham classe adicionar, somente dentro de card

                botaoAdicionar.addEventListener("click", () => { //dentro do for para criar um evento em cada botão
                    const itemCarrinho = carrinho.find(
                        item => item.produto.nome === produto.nome //compara os numeros
                    );

                    if (itemCarrinho) {
                        itemCarrinho.quantidade += 1;
                    } else {
                        carrinho.push({ //adiciona ao final do array
                            produto: produto,
                            quantidade: 1
                        });
                    }
                    mostrarCarrinho();
                    
                });


                lucide.createIcons(); //cria icone do carrinho
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