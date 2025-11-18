//pagina dos produtos

const dadosProdutos = {
    'caneca_coracao': {
        id: 'caneca_coracao',
        nome: "Caneca de Cerâmica Coração",
        preco: 37.90, // Preço corrigido para o HTML
        precoOriginal: 50.00,
        tituloPagina: "Caneca de Cerâmica Estampa Coração",
        descricaoDetalhada: "Caneca de cerâmica de alta qualidade com estampa de coração. Ideal para presentear e colecionar. Capacidade de 325ml. Acompanha caixa personalizada. Material: Cerâmica Premium. Capacidade: 325 ml. Pode ir ao micro-ondas e lava-louças.",
        variacoes: ["Azul", "Vermelha", "Amarela"],
        imagens: [
            "img/caneca_coracao_azul_principal.jpg", 
            "img/caneca_coracao_vermelha_principal.jpg",
            "img/caneca_coracao_amarela_principal.jpg"
        ]
    },
    'caneta-azul': {
        id: 'caneta-azul',
        nome: "caneta-azul",
        preco: 49.90, // Preço corrigido para o HTML (equivalente à Caneta Azul)
        precoOriginal: 60.00,
        tituloPagina: "Caneca Estampa Geométrica Moderna",
        descricaoDetalhada: "Caneca moderna com estampa geométrica em tons neutros. Perfeita para qualquer bebida. Capacidade de 325ml. Material: Porcelana.",
        variacoes: ["Preta", "Branca"],
        imagens: [
            "https://down-br.img.susercontent.com/file/br-11134207-23030-mhdaern6mlov60.webp", 
            "https://down-br.img.susercontent.com/file/br-11134207-7qukw-lgn4i5tqmunq7e"
        ]
    },
    'caneca-berserk': {
        id: 'caneca-berserk',
        nome: "Caneca Berserk",
        preco: 32.90, 
        precoOriginal: 39.11,
        tituloPagina: "Caneca Berserk Caveira (Edição Especial)",
        descricaoDetalhada: "Caneca de cerâmica de alta qualidade com a marca do sacrifício de Berserk. Item obrigatório para fãs do mangá e anime. Material: Cerâmica.",
        variacoes: ["Preta"],
        imagens: [
            "image_0fd21c.png", // Arquivo carregado
            "img/caneca_berserk_fundo_min.jpg" // Exemplo de imagem secundária
        ]
    },
    'caneca_personalizada': {
        id: 'caneca_personalizada',
        nome: "Caneca Personalizável",
        preco: 37.90,
        precoOriginal: 42.11,
        tituloPagina: "Caneca para Personalizar a Seu Gosto",
        descricaoDetalhada: "Caneca branca simples, pronta para receber a sua arte, foto ou logotipo. Material de alta resistência e durabilidade.",
        variacoes: ["Branca"],
        imagens: [
            "image_0fd65a.png" // Arquivo carregado
        ]
    }
};

// =================================
// VARIÁVEIS GLOBAIS DO DOM
// =================================

let itensNoCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const elementoContador = document.getElementById("contador-carrinho");

// 🔑 CORREÇÃO: Variável modalLogin precisa ser declarada globalmente
const modalCarrinho = document.getElementById('modal-carrinho');
const modalLogin = document.getElementById('modal-login'); // 👈 VARIÁVEL CORRIGIDA

const listaCarrinho = document.getElementById('lista-carrinho');
const valorTotalSpan = document.getElementById('valor-total');
const campoPesquisa = document.getElementById("campo-pesquisa");
const botaoPesquisa = document.getElementById("botao-pesquisa");


// =================================
// FUNÇÕES DE CARRINHO
// =================================

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(itensNoCarrinho));
    calcularTotais();
    atualizarContadorCarrinho();
    atualizarModalCarrinho();
}

function atualizarContadorCarrinho() {
    const totalItens = itensNoCarrinho.reduce((soma, item) => soma + item.quantidade, 0);
    if (elementoContador) {
        elementoContador.textContent = totalItens;
    }
}

function calcularTotais() {
    let total = itensNoCarrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
    
    if (valorTotalSpan) {
        valorTotalSpan.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}

function atualizarModalCarrinho() {
    if (!listaCarrinho) return;

    listaCarrinho.innerHTML = '';
    
    if (itensNoCarrinho.length === 0) {
        listaCarrinho.innerHTML = '<p style="text-align:center; padding: 15px;">Seu carrinho está vazio.</p>';
    } else {
        itensNoCarrinho.forEach((item, index) => {
            const itemHTML = document.createElement('div');
            itemHTML.classList.add('item-carrinho');
            // Formatação de preço e quantidade no modal
            const precoItem = item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const precoTotal = (item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            itemHTML.innerHTML = `
                <span class="item-info">
                    ${item.nome} (${precoItem} x ${item.quantidade})
                </span>
                <span class="item-actions">
                    <span class="item-preco-total">${precoTotal}</span>
                    <button class="btn-remover" data-index="${index}">Remover</button>
                </span>
            `;
            listaCarrinho.appendChild(itemHTML);
        });
    }
    calcularTotais();
}

// 🔑 Função global para remover item pelo índice (usada no modal)
window.removerDoCarrinhoPorIndice = function(index) {
    if (index > -1 && index < itensNoCarrinho.length) {
        itensNoCarrinho.splice(index, 1);
        salvarCarrinho();
    }
}

function removerDoCarrinho(index) {
    if (index > -1 && index < itensNoCarrinho.length) {
        itensNoCarrinho.splice(index, 1);
        salvarCarrinho();
    }
}

// 🔑 Função global para adicionar item ao carrinho (Chamada pelos botões Comprar/Adicionar)
window.adicionarAoCarrinho = function(nome, preco, id, quantidadePadrao = 1) {
    // Para a página de detalhes (produtos.html), tenta obter a quantidade do input
    const inputQuantidade = document.getElementById('quantidade');
    const quantidadeFinal = inputQuantidade ? parseInt(inputQuantidade.value) || 1 : quantidadePadrao;

    // Garante que o preço seja um número, mesmo que venha do HTML como string
    let precoNumerico = typeof preco === 'number' ? preco : parseFloat(String(preco).replace(',', '.'));
    if (isNaN(precoNumerico)) {
        console.error("Preço inválido para adicionar ao carrinho:", preco);
        return;
    }

    const itemExistente = itensNoCarrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += quantidadeFinal;
    } else {
        itensNoCarrinho.push({ nome, preco: precoNumerico, id, quantidade: quantidadeFinal });
    }

    salvarCarrinho();
    alert(`${quantidadeFinal}x ${nome} adicionado(s) ao carrinho!`);
}

window.limparCarrinho = function() {
    if (confirm("Tem certeza que deseja limpar o carrinho?")) {
        itensNoCarrinho = [];
        salvarCarrinho();
        // O modal do carrinho deve ser atualizado por salvarCarrinho
        alert("Carrinho limpo com sucesso!");
    }
}

window.finalizarCompra = function() {
    if (itensNoCarrinho.length === 0) {
        alert("Seu carrinho está vazio. Adicione produtos antes de finalizar.");
        return;
    }
    alert(`Compra finalizada! Total de ${valorTotalSpan.textContent}. O carrinho será limpo.`);
    itensNoCarrinho = [];
    salvarCarrinho();
    if (modalCarrinho) modalCarrinho.style.display = 'none';
}


// =================================
// FUNÇÕES DE LOGIN
// =================================

window.fazerLogin = function () {
    const usuarioInput = document.getElementById('usuario');
    const senhaInput = document.getElementById('senha');
    const mensagem = document.getElementById('mensagem-login');

    if (!usuarioInput || !senhaInput || !mensagem) {
        console.error("Elementos de login não encontrados.");
        return;
    }

    const usuario = usuarioInput.value;
    const senha = senhaInput.value;

    if (usuario === "admin" && senha === "1234") {
        mensagem.style.color = "green";
        mensagem.textContent = "Login bem-sucedido!";
        if(modalLogin) modalLogin.style.display = 'none'; // Fecha o modal
        alert("Login efetuado com sucesso!");
    } else {
        mensagem.style.color = "red";
        mensagem.textContent = "Usuário ou senha incorretos.";
    }
}


// =========================================================
// FUNÇÕES DE IMAGEM E ZOOM (Detalhes do Produto)
// =========================================================

const zoomLevel = 2; 
let lupa; 

function inicializarEventosDeImagem() {
    const imagemPrincipal = document.getElementById('imagem-principal');
    const miniaturas = document.querySelectorAll('.miniatura'); 
    const zoomContainer = document.querySelector('.zoom-container');

    if (!imagemPrincipal || !zoomContainer) return; 

    // Limpa a lupa antiga
    if (lupa) lupa.remove();
    
    // Cria e anexa a nova lupa
    lupa = document.createElement('div');
    lupa.classList.add('lupa-zoom');
    zoomContainer.appendChild(lupa);

    lupa.style.backgroundImage = `url(${imagemPrincipal.src})`;

    miniaturas.forEach(miniatura => {
        // Garante que não haja ouvintes duplicados
        miniatura.removeEventListener('click', handleMiniaturaClick); 
        miniatura.addEventListener('click', handleMiniaturaClick);
        
        // Define a miniatura ativa inicial (se aplicável)
        const principalSrc = miniatura.src.endsWith('.png') ? miniatura.src : miniatura.src.replace('_min.jpg', '_principal.jpg');

        if (principalSrc === imagemPrincipal.src) {
            miniatura.classList.add('active');
        } else {
             miniatura.classList.remove('active');
        }
    });

    function handleMiniaturaClick() {
        miniaturas.forEach(m => m.classList.remove('active'));
        
        // Determina o caminho da imagem principal a partir da miniatura
        // Se for PNG, usa o mesmo SRC. Se for JPG, troca _min por _principal.
        const novaSrc = this.src.endsWith('.png') ? this.src : this.src.replace('_min.jpg', '_principal.jpg');
        
        imagemPrincipal.src = novaSrc;
        this.classList.add('active');
        
        if (lupa) {
            lupa.style.backgroundImage = `url(${novaSrc})`;
        }
    }

    // Lógica de Zoom (Lupa)
    zoomContainer.addEventListener('mousemove', function(e) {
        lupa.style.backgroundSize = `${imagemPrincipal.offsetWidth * zoomLevel}px ${imagemPrincipal.offsetHeight * zoomLevel}px`;
        
        const rect = zoomContainer.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top; 

        // Define a posição do background dentro da lupa
        const backgroundX = (x / zoomContainer.offsetWidth) * 100;
        const backgroundY = (y / zoomContainer.offsetHeight) * 100;

        lupa.style.backgroundPosition = `${backgroundX}% ${backgroundY}%`;

        // Posiciona a lupa no cursor
        lupa.style.left = `${x}px`;
        lupa.style.top = `${y}px`;
    });

    zoomContainer.addEventListener('mouseenter', function() {
        lupa.style.display = 'block'; 
        imagemPrincipal.style.opacity = '0.5'; 
    });

    zoomContainer.addEventListener('mouseleave', function() {
        lupa.style.display = 'none'; 
        imagemPrincipal.style.opacity = '1';
    });
}


// =========================================================
// FUNÇÃO CHAVE: CARREGAR DADOS DO PRODUTO (Produtos.html)
// =========================================================

function carregarDetalhesDoProduto(produtoId) {
    const produto = dadosProdutos[produtoId];
    
    if (!produto) {
        console.error("Produto não encontrado para o ID:", produtoId);
        if(document.getElementById('titulo-produto')) document.getElementById('titulo-produto').textContent = "Produto não encontrado";
        return;
    }

    // 1. ATUALIZAÇÃO DOS DETALHES (Títulos, Preços, Descrição)
    if (document.getElementById('titulo-produto')) document.getElementById('titulo-produto').textContent = produto.tituloPagina;
    
    // Corrigido para garantir que o preço seja exibido corretamente
    const precoOriginalFormatado = produto.precoOriginal.toFixed(2).replace('.', ',');
    const precoOfertaFormatado = produto.preco.toFixed(2).replace('.', ',');

    if (document.querySelector('.preco-original')) document.querySelector('.preco-original').textContent = `De R$ ${precoOriginalFormatado}`;
    if (document.querySelector('.preco-oferta')) document.querySelector('.preco-oferta').textContent = `Por R$ ${precoOfertaFormatado}`;
    if (document.querySelector('.descricao-completa-texto')) document.querySelector('.descricao-completa-texto').innerHTML = produto.descricaoDetalhada;

    // 2. ATUALIZAÇÃO DA IMAGEM PRINCIPAL E MINIATURAS (CRIAÇÃO DO HTML)
    const imagemPrincipal = document.getElementById('imagem-principal');
    const miniaturasContainer = document.querySelector('.miniaturas');
    
    if (imagemPrincipal && miniaturasContainer && produto.imagens.length > 0) {
        imagemPrincipal.src = produto.imagens[0];
        
        miniaturasContainer.innerHTML = '';
        produto.imagens.forEach((src) => {
            const miniatura = document.createElement('img');
            // Lógica para usar a mesma imagem para PNGs ou trocar para _min para JPGs
            const miniaturaSrc = src.endsWith('.png') ? src : src.replace('_principal.jpg', '_min.jpg');
            
            miniatura.src = miniaturaSrc; 
            miniatura.alt = "Miniatura do produto";
            miniatura.classList.add('miniatura');
            miniaturasContainer.appendChild(miniatura);
        });
        
        // 3. RE-INICIALIZAÇÃO DOS EVENTOS DE IMAGEM
        inicializarEventosDeImagem();
    }
    
    // 4. ATUALIZAÇÃO DO BOTÃO ADICIONAR AO CARRINHO
    const btnAdicionar = document.querySelector('.btn-comprar-detalhe'); 
    if (btnAdicionar) {
        // Uso de aspas invertidas
        btnAdicionar.setAttribute('onclick', `adicionarAoCarrinho('${produto.nome.replace(/'/g, "\\'")}', ${produto.preco}, '${produto.id}')`);
    }
}


// FUNÇÃO PARA INJETAR COMENTÁRIOS E AVALIAÇÕES ALEATÓRIAS

function gerarAvaliacoesAleatorias() {
    const nomes = ["Ana C.", "Carlos M.", "Beatriz S.", "Rodrigo L.", "Juliana P.", "Felipe B."];
    const comentariosBase = [
        "Produto excelente e chegou super rápido! Recomendo a todos.",
        "Ótima qualidade, superou minhas expectativas.",
        "Chegou com um pequeno atraso, mas o produto é perfeito.",
        "Muito bom! Exatamente como descrito no site.",
        "Gostei, mas poderia ser um pouco mais resistente. No geral, vale a pena.",
        "Simplesmente amei! Cinco estrelas com certeza.",
        "Cor vibrante e material confortável. Voltarei a comprar."
    ];
    
    const estrelasContainer = document.getElementById('estrelas-avaliacao');
    const contagemContainer = document.getElementById('contagem-avaliacao');
    const listaComentariosContainer = document.getElementById('lista-comentarios');

    if (!estrelasContainer || !listaComentariosContainer) return;

    // Geração de nota e contagem aleatória
    const notaMedia = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1); 
    const numAvaliacoes = Math.floor(Math.random() * (200 - 50 + 1)) + 50; 
    
    // Geração das estrelas visuais
    let htmlEstrelas = '';
    const estrelasCheias = Math.floor(notaMedia);
    const temMeiaEstrela = notaMedia - estrelasCheias >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < estrelasCheias) {
            htmlEstrelas += '<i class="fa fa-star" style="color:#FFD700;"></i>'; 
        } else if (i === estrelasCheias && temMeiaEstrela) {
            htmlEstrelas += '<i class="fa fa-star-half-o" style="color:#FFD700;"></i>'; 
        } else {
            htmlEstrelas += '<i class="fa fa-star-o" style="color:#CCC;"></i>'; 
        }
    }

    estrelasContainer.innerHTML = htmlEstrelas;
    contagemContainer.textContent = `${notaMedia} / 5.0 (${numAvaliacoes} avaliações)`;

    // Injeção dos comentários individuais
    const numComentarios = Math.floor(Math.random() * (7 - 4 + 1)) + 4; 
    listaComentariosContainer.innerHTML = ''; 
    
    for (let i = 0; i < numComentarios; i++) {
        const nomeAleatorio = nomes[Math.floor(Math.random() * nomes.length)];
        const comentarioAleatorio = comentariosBase[Math.floor(Math.random() * comentariosBase.length)];
        const diasAtras = Math.floor(Math.random() * 30) + 1;
        
        const itemHtml = `
            <div class="comentario-item">
                <span class="comentario-nome">${nomeAleatorio}</span>
                <p class="comentario-texto">${comentarioAleatorio}</p>
                <span class="comentario-data">${diasAtras} dias atrás</span>
            </div>
        `;
        listaComentariosContainer.innerHTML += itemHtml;
    }
}


// =========================================================
// FUNÇÕES DE UTILIDADE (Banner Rotativo e Busca)
// =========================================================

// Banner rotativo (para index.html)
const imagensBanner = [
    "https://down-br.img.susercontent.com/file/9fe3aa3d22cf3eec4e46157967a48f38",
    "https://cf.shopee.com.br/file/1932d8aaf0f1fe7ca840facfa320405b",
    "https://down-br.img.susercontent.com/file/f0ee1949de8e6963e2bbdfeeb9a03903"
];
let slideIndex = 0;
function showSlides() {
    const banner = document.getElementById('banner-slide');
    if (banner) {
        slideIndex = (slideIndex + 1) % imagensBanner.length;
        banner.src = imagensBanner[slideIndex];
        setTimeout(showSlides, 3000);
    }
}

// Busca funcional (para index.html)
function filtrarProdutos() {
    if (!campoPesquisa) return;

    const termo = campoPesquisa.value.toLowerCase();
    const produtos = document.querySelectorAll(".card-produto");

    produtos.forEach(produto => {
        const nome = produto.querySelector("h3").textContent.toLowerCase();
        produto.style.display = nome.includes(termo) ? "block" : "none";
    });
}


// =================================
// INICIALIZAÇÃO GERAL (DOMContentLoaded)
// =================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicializa o contador de carrinho
    atualizarContadorCarrinho();

    // 2. === LÓGICA ESPECÍFICA DO INDEX.HTML (Página Principal) ===
    if (document.querySelector('.grade-produtos')) {
        // Inicializa Banner Rotativo
        showSlides(); 

        // Inicializa Busca
        if (campoPesquisa && botaoPesquisa) {
            campoPesquisa.addEventListener("input", filtrarProdutos);
            botaoPesquisa.addEventListener("click", filtrarProdutos);
        }

        // Adiciona listeners para os botões "Adicionar ao carrinho" na grade de produtos
        const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
        botoesAdicionar.forEach(botao => {
            botao.addEventListener('click', (evento) => {
                const cardProduto = evento.target.closest('.card-produto');
                const nomeProduto = cardProduto.querySelector('h3').textContent.trim();
                const preco = botao.getAttribute('data-preco');
                const id = cardProduto.getAttribute('data-id');
                if (nomeProduto && preco && id) {
                    adicionarAoCarrinho(nomeProduto, preco, id);
                }
            });
        });
    }

    // 3. === LÓGICA ESPECÍFICA DO PRODUTOS.HTML (Página de Detalhes) ===
    if (document.getElementById('imagem-principal')) { 
        const urlParams = new URLSearchParams(window.location.search);
        const produtoId = urlParams.get('id');

        if (produtoId) {
            carregarDetalhesDoProduto(produtoId);
        } else {
            // Caso de fallback: carrega um produto padrão
            carregarDetalhesDoProduto('caneca_coracao'); 
        }
        
        // Inicializa a injeção de avaliações (se o HTML existir)
        gerarAvaliacoesAleatorias();
    }


    // 4. === MODAL DE LOGIN (Universal) ===
    const abrirLoginBtn = document.getElementById('abrir-login');
    const fecharLoginBtn = document.getElementById('fechar-login');
    const btnSubmitLogin = document.getElementById('btn-submit-login'); // Botão de submit do formulário de login

    if (abrirLoginBtn && modalLogin) {
        abrirLoginBtn.addEventListener('click', () => { modalLogin.style.display = 'flex'; });
    }

    if (fecharLoginBtn && modalLogin) {
        fecharLoginBtn.addEventListener('click', () => { modalLogin.style.display = 'none'; });
    }
    
    // Adiciona o listener ao botão de login, prevenindo o comportamento padrão do form
    if (btnSubmitLogin) {
        btnSubmitLogin.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o envio do formulário e o recarregamento da página
            fazerLogin();
        });
    }


    // 5. === MODAL DE CARRINHO (Universal) ===
    const abrirCarrinhoBtn = document.querySelector('.carrinho');
    const fecharCarrinhoBtn = document.querySelector('#modal-carrinho .close-button');
    const btnFinalizar = document.querySelector('.btn-finalizar'); // Corrigido para a classe do seu HTML
    const btnLimpar = document.querySelector('.btn-limpar'); // 🔑 Variável do botão Limpar

    if (abrirCarrinhoBtn && modalCarrinho) {
        abrirCarrinhoBtn.addEventListener('click', () => {
            atualizarModalCarrinho();
            modalCarrinho.style.display = 'flex';
        });
    }

    if (fecharCarrinhoBtn && modalCarrinho) {
        fecharCarrinhoBtn.addEventListener('click', () => { modalCarrinho.style.display = 'none'; });
    }
    
    // Adiciona listeners para botões do carrinho
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }
    
    if (btnLimpar) { // 🔑 Listener para o botão Limpar Carrinho
        btnLimpar.addEventListener('click', limparCarrinho);
    }

    // Adiciona listener de remoção ao container da lista do carrinho
    if (listaCarrinho) {
        listaCarrinho.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remover')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                removerDoCarrinho(index);
            }
        });
    }

    // 6. === BOTÃO VOLTAR AO TOPO (Universal) ===
    const btnTopo = document.getElementById("btnTopo");
    if (btnTopo) {
        window.onscroll = function() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                btnTopo.style.display = "block";
            } else {
                btnTopo.style.display = "none";
            }
        };

        btnTopo.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});


function clickMenu() {
    let itensMenu = document.getElementById('itens');
    let iconeMenu = document.getElementById('icone-menu'); // CHAVE: Pega o ícone

    // 1. Alterna a classe 'ativo' no menu
    itensMenu.classList.toggle('ativo');

    // 2. Troca o ícone
    if (itensMenu.classList.contains('ativo')) {
        // Se o menu está ativo (aberto), troca para o 'X'
        // Se estiver usando Font Awesome (fa-times)
        iconeMenu.classList.remove('fa-bars');
        iconeMenu.classList.add('fa-times'); 
        
        // OU se estiver usando texto simples:
        // iconeMenu.innerHTML = '✖';
        
    } else {
        // Se o menu está inativo (fechado), volta para o hambúrguer
        // Se estiver usando Font Awesome (fa-bars)
        iconeMenu.classList.remove('fa-times');
        iconeMenu.classList.add('fa-bars');
        
        // OU se estiver usando texto simples:
        // iconeMenu.innerHTML = '☰';
    }
}

//login
document.addEventListener('DOMContentLoaded', function () {
    const abrir = document.getElementById('abrir-login');
    const fechar = document.getElementById('fechar-login');
    const modal = document.getElementById('modal-login');

    abrir.addEventListener('click', () => {
      modal.classList.add('ativo');
    });

    fechar.addEventListener('click', () => {
      modal.classList.remove('ativo');
    });
  });