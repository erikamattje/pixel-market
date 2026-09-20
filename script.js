const container = document.querySelector("#produtos");
const botoes = document.querySelectorAll(".categoria");
const campoBusca = document.querySelector("#busca");

const header = document.querySelector("header");

const carrinhoContainer = document.createElement("div");
carrinhoContainer.classList.add("carrinho-container"); //adiciona classe a div
header.appendChild(carrinhoContainer);

const areaCarrinho = document.createElement("div"); //cria a area do carrinho
areaCarrinho.classList.add("carrinho");

const carrinho = [];
const botaoCarrinho = document.querySelector("#carrinho"); //seleciona o elemento do carrinho no HTML

carrinhoContainer.appendChild(botaoCarrinho);
carrinhoContainer.appendChild(areaCarrinho);
areaCarrinho.innerHTML = "<h2>Meu carrinho</h2>";


function atualizarCarrinho(){
    let totalItens = 0;

    for (const itemCarrinho of carrinho){
        totalItens += itemCarrinho.quantidade;
    }

    const textoCarrinho = botaoCarrinho.querySelector("span");
    textoCarrinho.textContent = `Carrinho (${totalItens})`;
}

function atualizarBotao(produto) {
    const botaoAdicionar = document.querySelector(
        `[data-produto="${produto.nome}"]`
    );

    let itemCarrinho = carrinho.find( // Procura o produto no carrinho
        item => item.produto.nome === produto.nome
    );

    const quantidade = itemCarrinho?.quantidade ?? 0; // Se encontrou, pega a quantidade.Se não encontrou, considera quantidade 0.
                    
    if (quantidade === produto.estoque) { // Desabilita quando o carrinho atingir o estoque.
        botaoAdicionar.disabled = true;
    } else { // Mantém habilitado enquanto ainda houver estoque.
        botaoAdicionar.disabled = false;
    }
}

function mostrarCarrinho(){
    areaCarrinho.innerHTML = "";

    if (carrinho.length === 0){ //verifica se o carrinho esta vazio
        areaCarrinho.innerHTML = `
            <div class="carrinho-vazio">
                <i data-lucide="shopping-cart"></i>
                <h2>Seu carrinho está vazio</h2>
                <p>Adicione produtos para vê-los aqui!</p>
            </div>
        `;
        lucide.createIcons();
    } 

    for (const itemCarrinho of carrinho){ //percorre cada produto/item adicionado ao array carrinho
        const item = document.createElement("div");
        item.classList.add("item-carrinho");

        const produtoCarrinho = document.createElement("div");
        produtoCarrinho.classList.add("produto-carrinho");

        const imagem = document.createElement("img");
        imagem.src = itemCarrinho.produto.imagem;        
        produtoCarrinho.appendChild(imagem);

        const nome = document.createElement("p");
        nome.textContent = itemCarrinho.produto.nome;
        produtoCarrinho.appendChild(nome);

        const controleQuantidade = document.createElement("div");
        controleQuantidade.classList.add("controle-quantidade");      
        
        const diminuir = document.createElement("button");
        diminuir.textContent = "-";
        controleQuantidade.appendChild(diminuir);

        const quantidade = document.createElement("p"); // cria um elemento <p> para mostrar a quantidade do produto.
        quantidade.textContent = itemCarrinho.quantidade; // coloca dentro do <p> o número da quantidade daquele item no carrinho.
        controleQuantidade.appendChild(quantidade); // // coloca o <p> da quantidade dentro do controle de quantidade.

        const aumentar = document.createElement("button")
        aumentar.textContent = "+";
        aumentar.disabled = itemCarrinho.quantidade === itemCarrinho.produto.estoque;
        controleQuantidade.appendChild(aumentar);

        item.appendChild(produtoCarrinho);
        item.appendChild(controleQuantidade);

        areaCarrinho.appendChild(item);

        aumentar.addEventListener("click", (evento) => { //para cada botão + de cada produto será associado esse evento.
            evento.stopPropagation();

            if (itemCarrinho.quantidade < itemCarrinho.produto.estoque){ //verifica o estoque do produto
                itemCarrinho.quantidade +=1;
            }

            atualizarBotao(itemCarrinho.produto);
            atualizarCarrinho();
            mostrarCarrinho();
            
        });

        diminuir.addEventListener("click", (evento) => {
            evento.stopPropagation();
            
            if (itemCarrinho.quantidade > 1){
                itemCarrinho.quantidade -= 1;
            }

            atualizarBotao(itemCarrinho.produto);
            atualizarCarrinho();
            mostrarCarrinho();
        });

        const preco = document.createElement("p");
        preco.textContent = itemCarrinho.produto.preco.toLocaleString( "pt-BR", {
            style: "currency",
            currency: "BRL"
        });
        item.appendChild(preco);

        const subtotal = document.createElement("p"); //elemento HTML
        const valorSubtotal = itemCarrinho.quantidade * itemCarrinho.produto.preco; //valor calculado
        subtotal.textContent = valorSubtotal.toLocaleString( "pt-BR", { //coloca dentro de p e formata na moeda correta
            style: "currency",
            currency: "BRL"
        });
        item.appendChild(subtotal);

        const remover = document.createElement("button");
        remover.classList.add("remover");
        remover.textContent = "X";
        item.appendChild(remover);

        remover.addEventListener("click", (evento) => {
            evento.stopPropagation();
            
            const indice = carrinho.findIndex(
                item => item.produto.nome === itemCarrinho.produto.nome
            )

            carrinho.splice(indice, 1);

            atualizarBotao(itemCarrinho.produto);

            atualizarCarrinho();
            mostrarCarrinho();
        });     

    }
};

botaoCarrinho.addEventListener("click", () => {
    areaCarrinho.classList.toggle("aberto");
    mostrarCarrinho();
});

document.addEventListener("click", (evento) => {
    if (!carrinhoContainer.contains(evento.target)){ //o elemento que foi clicado esta fora de carrinhoContainer?
        areaCarrinho.classList.remove("aberto"); 
    } 
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
                    <button class="botao adicionar" data-produto="${produto.nome}">
                        <i data-lucide="shopping-cart"></i>
                        Adicionar ao carrinho
                    </button>
                `;
                container.appendChild(card); //adicione a div que esta em card, dentro de container

                const botaoAdicionar = card.querySelector(".adicionar"); //procura elementos que tenham classe adicionar, somente dentro de card
                
                

                botaoAdicionar.addEventListener("click", () => { //dentro do for para criar um evento em cada botão
                    let itemCarrinho = carrinho.find(
                        item => item.produto.nome === produto.nome //compara os nomes
                    );

                    if (itemCarrinho) {
                        itemCarrinho.quantidade += 1;
                    } else {
                        const novoItem = {
                            produto: produto,
                            quantidade: 1
                        }
                        carrinho.push(novoItem) //adiciona ao final do array
                        itemCarrinho = novoItem;                        
                    
                    };

                    atualizarBotao(produto);

                    atualizarCarrinho();

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


    const faixa = document.querySelector(".faixa-mensagem");    

    const velocidade = 100;   
    
    function ajustarVelocidade(){
        const distancia = window.innerWidth; //largura atual da janela do navegador em pixels
        const duracao = distancia / velocidade;

        faixa.style.animation = `passar ${duracao}s linear infinite`;
    }

    ajustarVelocidade();
    window.addEventListener("resize", ajustarVelocidade);
    
