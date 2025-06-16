let index = 0;
    const slides = document.querySelectorAll('.carrossel .slide');
    const videoSlide = document.getElementById('slide-video');

    function mostrarSlideManual(i) {
        slides.forEach((slide, idx) => {
        slide.classList.remove('ativo');
        if (idx === i) {
            slide.classList.add('ativo');
            // Se for vídeo, reinicia e toca
            if (slide.tagName === "VIDEO") {
            slide.currentTime = 0;
            slide.play();
            } else if (videoSlide) {
            videoSlide.pause();
            videoSlide.currentTime = 0;
            }
        }
        });
        index = i;
    }

    function mostrarSlide() {
        // Se o slide atual for vídeo e não terminou, não avança
        if (slides[index].tagName === "VIDEO") {
        if (!slides[index].ended && !slides[index].paused) {
            return;
        }
        }
        slides.forEach((slide, i) => slide.classList.remove('ativo'));
        index = (index + 1) % slides.length;
        slides[index].classList.add('ativo');
        // Se for vídeo, toca
        if (slides[index].tagName === "VIDEO") {
        slides[index].currentTime = 0;
        slides[index].play();
        } else if (videoSlide) {
        videoSlide.pause();
        videoSlide.currentTime = 0;
        }
    }

    // Quando o vídeo terminar, avança para o próximo slide
    if (videoSlide) {
        videoSlide.addEventListener('ended', () => {
        slides[index].classList.remove('ativo');
        index = (index + 1) % slides.length;
        slides[index].classList.add('ativo');
        });
    }

    setInterval(mostrarSlide, 3000); // muda a cada 3 segundos (exceto vídeo)
    window.addEventListener('DOMContentLoaded', () => {
        mostrarSlideManual(0);
    });

    let valorPixAtual = "0.00";

function abrirPix(nomePresente, idCard) {
  document.getElementById("presente-titulo").innerText = nomePresente;
  document.getElementById("comentario-pix").value = "";
  document.getElementById("card-pix").style.display = "flex";
  // Pega o valor do atributo data-valor
  const card = document.getElementById(idCard);
  valorPixAtual = card ? card.getAttribute('data-valor') : "0.00";
  mostrarQrCodePix();
}

function gerarCodigoPixCopiaCola() {
  const chave = "92986437318";
  const valor = valorPixAtual; // valor dinâmico
  const nome = "CHEILA MARQUES";
  const cidade = "MANAUS";
  // Payload simplificado (para produção, use uma lib!)
  return `00020126360014BR.GOV.BCB.PIX0111932986437318520400005303986540${valor.replace('.', '')}5802BR5913${nome}6006${cidade}62070503***6304`;
}

function mostrarQrCodePix() {
  const codigoPix = gerarCodigoPixCopiaCola(); // Gera o código copia e cola correto
  document.getElementById("codigo-pix").value = codigoPix;
  const qrDiv = document.getElementById("qrcode-pix");
  qrDiv.innerHTML = ""; // Limpa antes de gerar novo

  // Gera o QR Code como imagem
  new QRCode(qrDiv, {
    text: codigoPix,
    width: 180,
    height: 180,
    colorDark: "#003366",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

    function fecharPix() {
        document.getElementById("card-pix").style.display = "none";
    }

    function copiarCodigoPix() {
  const input = document.getElementById("codigo-pix");
  if (input) {
    navigator.clipboard.writeText(input.value).then(() => {
      alert("Código PIX copia e cola copiado!");
    });
  }
}

    // Mapeia nome do presente para a imagem do presente fixo
    const imagensPresentesFixos = {
    "1 mês de Netflix": "teste.jpg",
    "Kit miojo gourmet": "teste.jpg",
    "Vale brigadeiro para crises conjugais": "teste.jpg"
    };

    function uploadImgur(base64) {
    const clientId = "e97188fb3420e97"; // Seu Client-ID do Imgur
    return fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
        Authorization: "Client-ID " + clientId,
        Accept: "application/json"
        },
        body: new URLSearchParams({
        image: base64.split(',')[1],
        type: "base64"
        })
    })
        .then(response => response.json())
        .then(data => data.data.link)
        .catch(() => "teste.jpg"); // fallback se der erro
    }

    // function confirmarPresente() {
    //   const nomePresente = document.getElementById("presente-titulo").innerText;
    //   const comentario = document.getElementById("comentario-pix").value;
    //   const nomeDoador = document.getElementById("nome-doador").value || "Anônimo";

    //   let srcImagem = document.getElementById("card-pix").dataset.imagemConfirmacao;
    //   if (!srcImagem) {
    //     srcImagem = imagensPresentesFixos[nomePresente] || "teste.jpg";
    //   }

    //   const presenteHTML = `
    //     <div class="presente">
    //       <img src="${srcImagem}" alt="${nomePresente}" style="width:100%; border-radius: 8px; margin-bottom: 10px;">
    //       <p><strong>${nomePresente}</strong></p>
    //       <p>De: <em>${nomeDoador}</em></p>
    //       <p>${comentario || "Sem comentário 😅"}</p>
    //     </div>
    //   `;

    //   adicionarPresenteConfirmado(presenteHTML);

    //   fecharPix();

    //   const imgTemp = document.getElementById("img-temp");
    //   if (imgTemp) imgTemp.remove();
    //   delete document.getElementById("card-pix").dataset.imagemConfirmacao;
    //   currentIndex = listaConfirmados.children.length - 1;
    //   updateSlider();
    // }

    // Função para tratar o presente personalizado com upload de imagem
    function presentearOutroPresente() {
    const nomeDoador = document.getElementById("outro-nome").value || "Anônimo";
    const presente = document.getElementById("outro-presente").value;
    const comentario = document.getElementById("outro-mensagem").value || "Sem comentário 😅";
    const imagemInput = document.getElementById("outro-foto");
    const imagemArquivo = imagemInput.files[0];

    if (!presente) {
        alert("Por favor, preencha o nome do presente.");
        return;
    }

    if (imagemArquivo) {
        const reader = new FileReader();
        reader.onload = function(e) {
        const srcImagem = e.target.result;

        // Atualiza o card PIX para confirmação
        document.getElementById("presente-titulo").innerText = presente;
        document.getElementById("comentario-pix").value = comentario;
        document.getElementById("nome-doador").value = nomeDoador;

        // Exibe a imagem no card (opcional)
        // Por exemplo, criar uma imagem temporária no card
        let imgTemp = document.getElementById("img-temp");
        if (!imgTemp) {
            imgTemp = document.createElement("img");
            imgTemp.id = "img-temp";
            imgTemp.style.width = "100px";
            imgTemp.style.borderRadius = "8px";
            imgTemp.style.marginBottom = "10px";
            const conteudoCard = document.querySelector(".conteudo-card");
            conteudoCard.insertBefore(imgTemp, conteudoCard.firstChild);
        }
        imgTemp.src = srcImagem;

        document.getElementById("card-pix").style.display = "flex";

        // Guardar a imagem no input para depois exibir na confirmação
        document.getElementById("card-pix").dataset.imagemConfirmacao = srcImagem;
        };
        reader.readAsDataURL(imagemArquivo);
    } else {
        // Sem imagem: limpa a imagem temporária do card, se houver
        const imgTemp = document.getElementById("img-temp");
        if (imgTemp) imgTemp.remove();

        document.getElementById("presente-titulo").innerText = presente;
        document.getElementById("comentario-pix").value = comentario;
        document.getElementById("nome-doador").value = nomeDoador;
        document.getElementById("card-pix").removeAttribute("data-imagemConfirmacao");
        document.getElementById("card-pix").style.display = "flex";
    }
    }

    // Ajuste na confirmação para pegar a imagem temporária se for presente personalizado
    function confirmarPresente() {
    const nomePresente = document.getElementById("presente-titulo").innerText;
    const comentario = document.getElementById("comentario-pix").value;
    const nomeDoador = document.getElementById("nome-doador").value || "Anônimo";
    let srcImagem = document.getElementById("card-pix").dataset.imagemConfirmacao;
    if (!srcImagem) {
        srcImagem = imagensPresentesFixos[nomePresente] || "teste.jpg";
    }

    // Envia para o Google Forms
    salvarPresenteGoogleForms(nomeDoador, nomePresente, comentario, srcImagem);

    // Adiciona na lista visual
    const lista = document.getElementById("lista-confirmados");
    const div = document.createElement("div");
    div.className = "presente";
    div.innerHTML = `
        <img src="${srcImagem}" alt="${nomePresente}" style="width:100px; border-radius: 8px; margin-bottom: 10px;" onerror="this.src='teste.jpg'">
        <p><strong>${nomePresente}</strong></p>
        <p>De: <em>${nomeDoador}</em></p>
        <p>${comentario || "Sem comentário 😅"}</p>
    `;
    lista.appendChild(div);
    div.classList.add('adicionado');
    setTimeout(() => div.classList.remove('adicionado'), 300);

    fecharPix();
    const imgTemp = document.getElementById("img-temp");
    if (imgTemp) imgTemp.remove();
    delete document.getElementById("card-pix").dataset.imagemConfirmacao;
    currentIndex = document.querySelectorAll('#lista-confirmados .presente').length - 1;
    updateSlider();
    }

    // Substitua a função confirmarPresente por esta versão:

    function confirmarPresente() {
    const nomePresente = document.getElementById("presente-titulo").innerText;
    const comentario = document.getElementById("comentario-pix").value;
    const nomeDoador = document.getElementById("nome-doador").value || "Anônimo";
    let srcImagem = document.getElementById("card-pix").dataset.imagemConfirmacao;
    if (!srcImagem) {
        srcImagem = imagensPresentesFixos[nomePresente] || "teste.jpg";
    }

    // Se for imagem base64, faz upload para o Imgur
    if (srcImagem.startsWith("data:image")) {
        uploadImgur(srcImagem).then(urlImgur => {
        salvarPresenteGoogleForms(nomeDoador, nomePresente, comentario, urlImgur);
        adicionarPresenteVisual(nomePresente, nomeDoador, comentario, urlImgur);
        });
    } else {
        salvarPresenteGoogleForms(nomeDoador, nomePresente, comentario, srcImagem);
        adicionarPresenteVisual(nomePresente, nomeDoador, comentario, srcImagem);
    }

    fecharPix();
    const imgTemp = document.getElementById("img-temp");
    if (imgTemp) imgTemp.remove();
    delete document.getElementById("card-pix").dataset.imagemConfirmacao;
    currentIndex = document.querySelectorAll('#lista-confirmados .presente').length - 1;
    updateSlider();
    }

    // Adicione também esta função para exibir o presente na lista
    function adicionarPresenteVisual(nomePresente, nomeDoador, comentario, imagemUrl) {
    const lista = document.getElementById("lista-confirmados");
    const div = document.createElement("div");
    div.className = "presente";
    let html = "";
    if (imagemUrl) {
    html += `<img src="${imagemUrl}" alt="${nomePresente}" style="width:100px; border-radius: 8px; margin-bottom: 10px;">`;
    }
    html += `
        <p><strong>${nomePresente}</strong></p>
        <p>De: <em>${nomeDoador}</em></p>
        <p>${comentario || "Sem comentário 😅"}</p>
    `;
    div.innerHTML = html;
    lista.appendChild(div);
    div.classList.add('adicionado');
    setTimeout(() => div.classList.remove('adicionado'), 300);
    }
    // Ajustes nos scripts para o Google Forms

    // Substitua pelos nomes corretos dos campos conforme seu formulário
    function salvarPresenteGoogleForms(nome, presente, mensagem, imagemUrl = "") {
    const url = "https://docs.google.com/forms/d/e/1FAIpQLSfCJIMQ1ThR8norkqsdJ-NcKfy_6n3sHn0RSPs03AouadBONA/formResponse";
    const formData = new FormData();
    formData.append("entry.899788188", nome);      // Nome
    formData.append("entry.1283992162", presente); // Presente
    formData.append("entry.707539019", mensagem);  // Mensagem
    formData.append("entry.2112860432", imagemUrl); // Imagem (se houver)

    alert("Presente confirmado! (O Google Forms não retorna resposta, mas tentamos enviar)");
    fetch(url, {
        method: "POST",
        mode: "no-cors",
        body: formData
    });
    }
    function carregarPresentesConfirmados() {
    const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSj-N-lKq4ga601XJjxpwjGKxJEHcOOJI0nMLZi1A_0_bX6-pGNpsn3T6iPGhRBoZCxC_1raQbyCZRq/pub?gid=1229724433&single=true&output=csv" + "&cachebust=" + Date.now();
    fetch(urlCSV)
        .then(response => response.text())
        .then(csv => {
            // Divide o CSV em linhas, mas ignora linhas vazias
            const linhas = csv.split('\n').filter(l => l.trim()).slice(1); // pula o cabeçalho
            const presentesConfirmados = [];
            linhas.forEach(linha => {
                // Divide corretamente, mesmo se houver vírgulas dentro de aspas
                const colunas = [];
                let atual = '';
                let dentroAspas = false;
                for (let i = 0; i < linha.length; i++) {
                    const char = linha[i];
                    if (char === '"' && linha[i + 1] !== '"') {
                        dentroAspas = !dentroAspas;
                    } else if (char === ',' && !dentroAspas) {
                        colunas.push(atual.replace(/(^"|"$)/g, ""));
                        atual = '';
                    } else {
                        atual += char;
                    }
                }
                colunas.push(atual.replace(/(^"|"$)/g, "")); // último campo

                if (colunas.length < 5) return;
                const nome = colunas[1];
                const presente = colunas[2];
                const mensagem = colunas[3];
                let imagemUrl = colunas[4].replace(/[\r\n]/g, "").trim().replace(/^"+|"+$/g, "");
                if (!imagemUrl) {
                    imagemUrl = "teste.jpg"; // fallback padrão se estiver vazio
                }
                if (
                    imagemUrl &&
                    !/^https?:\/\//.test(imagemUrl) &&
                    !/\.(jpg|jpeg|png|gif)$/i.test(imagemUrl)
                ) {
                    imagemUrl = "teste.jpg";
                }

                if (nome && presente) {
                    adicionarPresenteVisual(presente, nome, mensagem, imagemUrl);
                    presentesConfirmados.push(presente.trim().toLowerCase());
                }
            });

            // Remover da lista de opções os presentes já presenteados
            const cards = document.querySelectorAll('.container-presentes .presente');
            cards.forEach(card => {
                // O nome do presente está no <p> ou <strong>
                let nome = card.querySelector('p')?.innerText || '';
                // Para presentes via PIX, pode estar em <strong>
                if (!nome && card.querySelector('strong')) {
                    nome = card.querySelector('strong').innerText;
                }
                if (presentesConfirmados.includes(nome.trim().toLowerCase())) {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Chame ao carregar a página
    window.addEventListener('DOMContentLoaded', carregarPresentesConfirmados);

    function enviarConfirmacaoPresenca(event) {
    event.preventDefault();
    const form = event.target;
    const nomePessoa = form.nomePessoa.value;
    const quantidade = form.quantidade.value;
    const acompanhantes = form.acompanhantes.value;

    const url = "https://docs.google.com/forms/d/e/1FAIpQLSfCJIMQ1ThR8norkqsdJ-NcKfy_6n3sHn0RSPs03AouadBONA/formResponse";
    const formData = new FormData();
    formData.append("entry.1292148400", nomePessoa);      // Nome completo (presença)
    formData.append("entry.362223164", quantidade);      // Quantidade de pessoas (presença) ou presente
    formData.append("entry.76194983", acompanhantes);    // Nomes dos acompanhantes ou mensagem

    fetch(url, {
        method: "POST",
        mode: "no-cors",
        body: formData
    });

    alert("Presença confirmada com sucesso!");
    form.reset();
    }

    // CONTADOR REGRESSIVO CASAMENTO
    function atualizarContadorCasamento() {
    const dataCasamento = new Date("2026-09-12T18:30:00-04:00"); // Horário de Brasília
    const agora = new Date();
    const diff = dataCasamento - agora;

    if (diff <= 0) {
        document.getElementById("contador-casamento").innerHTML = "<span style='color:#d4af37'>É hoje! 💍</span>";
        return;
    }

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    document.getElementById("dias") .textContent = String(dias).padStart(2, '0');
    document.getElementById("horas").textContent = String(horas).padStart(2, '0');
    document.getElementById("minutos").textContent = String(minutos).padStart(2, '0');
    document.getElementById("segundos").textContent = String(segundos).padStart(2, '0');
    }

    setInterval(atualizarContadorCasamento, 1000);
    window.addEventListener('DOMContentLoaded', atualizarContadorCasamento);

    window.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('slide-video');
    if (video) {
        video.volume = 1; // volume inicial (máximo)
        function fadeOutVolume() {
        let fade = setInterval(function() {
            if (video.volume > 0.31) { // para em 0.3
            video.volume -= 0.01;
            } else {
            video.volume = 0.3;
            clearInterval(fade);
            }
        }, 100); // diminui a cada 100ms
        }
        video.addEventListener('play', function() {
        setTimeout(fadeOutVolume, 2000); // inicia o fade após 2 segundos
        });
    }
    });

    let headerMinimalAtivo = false;

    window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    const frase = document.getElementById('frase-final');
    if (!header) return;

    const scrollY = window.scrollY;

    // Ativa minimal ao rolar para baixo pela primeira vez
    if (!headerMinimalAtivo && scrollY > 10) {
        header.classList.add('minimal');
        if (frase) frase.style.opacity = '0';
        headerMinimalAtivo = true;
    }
    // Só desativa minimal se voltar totalmente ao topo
    else if (headerMinimalAtivo && scrollY === 0) {
        header.classList.remove('minimal');
        if (frase) frase.style.opacity = '1';
        headerMinimalAtivo = false;
    }
    // Se scrollY está entre 1 e 10, NÃO faz nada!
    });

    let idPresenteAmazonSelecionado = null;

// Abre o card Amazon e salva o ID do presente selecionado
function abrirCardAmazon(idPresente) {
  idPresenteAmazonSelecionado = idPresente;
  document.getElementById('card-amazon').style.display = 'flex';
}

// Fecha o card Amazon
function fecharCardAmazon() {
  document.getElementById('card-amazon').style.display = 'none';
}

// Confirma o presente Amazon e remove o card correspondente
function confirmarPresenteAmazon() {
  let nomePresente = "Escorredor de Louça";
  if (idPresenteAmazonSelecionado) {
    const card = document.getElementById(idPresenteAmazonSelecionado);
    if (card) {
      nomePresente = card.querySelector('p').innerText;
      card.style.display = 'none';
    }
  }
  const comentario = document.getElementById("comentario-amazon").value;
  const nomeDoador = document.getElementById("nome-doador-amazon").value || "Anônimo";
  const srcImagem = "https://m.media-amazon.com/images/I/71vp5wxidlL._AC_SX569_.jpg";

  salvarPresenteGoogleForms(nomeDoador, nomePresente, comentario, srcImagem);

  // Adiciona imediatamente na lista visual de confirmados
  adicionarPresenteVisual(nomePresente, nomeDoador, comentario, srcImagem);

  fecharCardAmazon();
  document.getElementById("comentario-amazon").value = "";
  document.getElementById("nome-doador-amazon").value = "";
  idPresenteAmazonSelecionado = null;

  alert("Presente confirmado! Ele aparecerá na lista de confirmados em alguns minutos.");
}


    function fadeOutVolume(video) {
    video.volume = 1;
    let fade = setInterval(function() {
        if (video.volume > 0.31) {
        video.volume -= 0.01;
        } else {
        video.volume = 0.3;
        clearInterval(fade);
        }
    }, 100);
    }

    function liberarAudioMusica() {
    const video = document.getElementById('video-musica');
    if (video) {
        video.muted = false;
        video.play();
        setTimeout(() => fadeOutVolume(video), 2000); // inicia o fade após 2 segundos
    }
    }

    ['touchstart', 'touchend', 'click', 'scroll'].forEach(evt => {
    window.addEventListener(evt, liberarAudioMusica, { once: true });
    });

    window.addEventListener('DOMContentLoaded', function() {
    const videoMusica = document.getElementById('video-musica');
    if (videoMusica) {
        videoMusica.volume = 1; // volume inicial (máximo)
        function fadeOutVolume() {
        let fade = setInterval(function() {
            if (videoMusica.volume > 0.31) { // para em 0.3
            videoMusica.volume -= 0.01;
            } else {
            videoMusica.volume = 0.2;
            clearInterval(fade);
            }
        }, 100); // diminui a cada 100ms
        }
        videoMusica.addEventListener('play', function() {
        setTimeout(fadeOutVolume, 2000); // inicia o fade após 2 segundos
        });
    }
    });

window.addEventListener('beforeunload', function (e) {
  if (document.getElementById('card-amazon').style.display === 'flex') {
    e.preventDefault();
    e.returnValue = 'Não esqueça de confirmar que presenteou antes de sair!';
    return e.returnValue;
  }
});

let urlAmazonParaAbrir = null;

function confirmarEIrParaAmazon(url) {
  urlAmazonParaAbrir = url;
  document.getElementById('modal-amazon-alert').style.display = 'flex';
}

function fecharModalAmazonAlert() {
  document.getElementById('modal-amazon-alert').style.display = 'none';
  urlAmazonParaAbrir = null;
}

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('btn-continuar-amazon');
  if (btn) {
    btn.onclick = function() {
      if (urlAmazonParaAbrir) {
        window.open(urlAmazonParaAbrir, '_blank');
        fecharModalAmazonAlert();
      }
    };
  }
});


