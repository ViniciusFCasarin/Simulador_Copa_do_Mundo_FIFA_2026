// js/main.js

// Objeto para guardar o estado atual de cada jogo (qual botão foi clicado)
const estadoJogos = {};

fetch('./data/selecoes.json')
  .then(resposta => {
    if (!resposta.ok) {
        throw new Error('Erro ao carregar o arquivo JSON');
    }
    return resposta.json();
  })
  .then(dados => {
    const containerPrincipal = document.getElementById('grupos-container');
    let htmlGerado = '';

    Object.keys(dados).forEach(nomeGrupo => {
        htmlGerado += `<div class="grupo-linha" data-grupo="${nomeGrupo}">`;
        htmlGerado += `
                <div class="secao-tabela">
                    <h2>${nomeGrupo}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Seleção</th>
                                <th>P</th>
                                <th>SG</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        dados[nomeGrupo].forEach(time => {
            htmlGerado += `
                            <tr data-time-id="${time.id}">
                                <td><img src="${time.bandeira}" alt="Bandeira de ${time.nome}" class="bandeira-tabela">${time.nome}</td>
                                <td>${time.pontos}</td>
                                <td>${time.saldo}</td>
                            </tr>
            `;
        });

        const time1 = dados[nomeGrupo][0];
        const time2 = dados[nomeGrupo][1];
        const time3 = dados[nomeGrupo][2];
        const time4 = dados[nomeGrupo][3];

        // Identificador único para cada jogo
        const idJogo1 = `${nomeGrupo.replace(' ', '')}-1`;
        const idJogo2 = `${nomeGrupo.replace(' ', '')}-2`;

        htmlGerado += `
                        </tbody>
                    </table>
                </div>
                
                <div class="secao-jogos">
                    <div class="jogo" data-jogo-id="${idJogo1}">
                        <div class="jogo-info">
                            <img src="${time1.bandeira}" class="bandeira-jogo">
                            ${time1.nome} vs ${time2.nome}
                            <img src="${time2.bandeira}" class="bandeira-jogo">
                        </div>
                        <div class="botoes-resultado">
                            <button data-resultado="vitoria" onclick="registrarResultado('${nomeGrupo}', ${time1.id}, ${time2.id}, 'vitoria', this)">Vitória ${time1.nome}</button>
                            <button data-resultado="empate" onclick="registrarResultado('${nomeGrupo}', ${time1.id}, ${time2.id}, 'empate', this)">Empate</button>
                            <button data-resultado="derrota" onclick="registrarResultado('${nomeGrupo}', ${time1.id}, ${time2.id}, 'derrota', this)">Vitória ${time2.nome}</button>
                        </div>
                    </div>
                    <div class="jogo" data-jogo-id="${idJogo2}">
                        <div class="jogo-info">
                            <img src="${time3.bandeira}" class="bandeira-jogo">
                            ${time3.nome} vs ${time4.nome}
                            <img src="${time4.bandeira}" class="bandeira-jogo">
                        </div>
                        <div class="botoes-resultado">
                            <button data-resultado="vitoria" onclick="registrarResultado('${nomeGrupo}', ${time3.id}, ${time4.id}, 'vitoria', this)">Vitória ${time3.nome}</button>
                            <button data-resultado="empate" onclick="registrarResultado('${nomeGrupo}', ${time3.id}, ${time4.id}, 'empate', this)">Empate</button>
                            <button data-resultado="derrota" onclick="registrarResultado('${nomeGrupo}', ${time3.id}, ${time4.id}, 'derrota', this)">Vitória ${time4.nome}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    containerPrincipal.innerHTML = htmlGerado;
    window.dadosCopa = dados;

    // Adiciona o listener para o botão de avançar
    document.getElementById('avancar-mata-mata').addEventListener('click', avancarParaMataMata);
  })
  .catch(erro => {
    console.error("❌ Ocorreu um erro ao ler os dados:", erro);
  });

function registrarResultado(nomeGrupo, idTime1, idTime2, novoResultado, botaoClicado) {
    const grupo = window.dadosCopa[nomeGrupo];
    const time1 = grupo.find(t => t.id === idTime1);
    const time2 = grupo.find(t => t.id === idTime2);
    const idJogo = botaoClicado.closest('.jogo').dataset.jogoId;

    const resultadoAnterior = estadoJogos[idJogo];

    // 1. Reverte o resultado anterior, se houver
    if (resultadoAnterior) {
        if (resultadoAnterior === 'vitoria') {
            time1.pontos -= 3;
        } else if (resultadoAnterior === 'empate') {
            time1.pontos -= 1;
            time2.pontos -= 1;
        } else if (resultadoAnterior === 'derrota') {
            time2.pontos -= 3;
        }
    }

    // 2. Aplica o novo resultado ou desliga se for o mesmo botão
    if (resultadoAnterior === novoResultado) {
        // Clicou no mesmo botão: desliga o resultado
        delete estadoJogos[idJogo];
    } else {
        // Clicou num botão diferente: aplica o novo resultado
        if (novoResultado === 'vitoria') {
            time1.pontos += 3;
        } else if (novoResultado === 'empate') {
            time1.pontos += 1;
            time2.pontos += 1;
        } else if (novoResultado === 'derrota') {
            time2.pontos += 3;
        }
        estadoJogos[idJogo] = novoResultado;
    }

    atualizarTabela(nomeGrupo);
    atualizarBotoes(idJogo);
}

function atualizarTabela(nomeGrupo) {
    const grupoLinha = document.querySelector(`.grupo-linha[data-grupo="${nomeGrupo}"]`);
    if (!grupoLinha) return;

    const tabelaBody = grupoLinha.querySelector('tbody');
    const timesOrdenados = [...window.dadosCopa[nomeGrupo]].sort((a, b) => b.pontos - a.pontos || b.saldo - a.saldo);

    timesOrdenados.forEach(time => {
        const linhaTime = tabelaBody.querySelector(`tr[data-time-id="${time.id}"]`);
        if (linhaTime) {
            linhaTime.children[1].textContent = time.pontos;
            tabelaBody.appendChild(linhaTime);
        }
    });
}

function atualizarBotoes(idJogo) {
    const jogoDiv = document.querySelector(`.jogo[data-jogo-id="${idJogo}"]`);
    if (!jogoDiv) return;

    const botoes = jogoDiv.querySelectorAll('.botoes-resultado button');
    const resultadoAtual = estadoJogos[idJogo];

    botoes.forEach(btn => {
        btn.classList.remove('vitoria-selecionada', 'empate-selecionado');
    });

    if (resultadoAtual) {
        const botaoAtivo = jogoDiv.querySelector(`button[data-resultado="${resultadoAtual}"]`);
        if (botaoAtivo) {
            if (resultadoAtual === 'empate') {
                botaoAtivo.classList.add('empate-selecionado');
            } else {
                botaoAtivo.classList.add('vitoria-selecionada');
            }
        }
    }
}

function avancarParaMataMata() {
    const classificados = {};
    const todosOsGrupos = Object.keys(window.dadosCopa);
    let terceirosColocados = [];

    // 1. Identificar classificados de cada grupo
    todosOsGrupos.forEach(nomeGrupo => {
        const timesOrdenados = [...window.dadosCopa[nomeGrupo]].sort((a, b) => b.pontos - a.pontos || b.saldo - a.saldo);
        
        classificados[`1${nomeGrupo.charAt(6)}`] = timesOrdenados[0];
        classificados[`2${nomeGrupo.charAt(6)}`] = timesOrdenados[1];
        terceirosColocados.push(timesOrdenados[2]);
    });

    // 2. Ordenar e selecionar os melhores terceiros
    terceirosColocados.sort((a, b) => {
        if (b.pontos !== a.pontos) {
            return b.pontos - a.pontos;
        }
        if (b.saldo !== a.saldo) {
            return b.saldo - a.saldo;
        }
        return Math.random() - 0.5; // Sorteio aleatório em caso de empate total
    });

    classificados['31'] = terceirosColocados[0];
    classificados['32'] = terceirosColocados[1];

    // 3. Construir e exibir o mata-mata
    construirChaveMataMata(classificados);
}

function construirChaveMataMata(timesMapeados) {
    fetch('./data/mata-mata.json')
        .then(response => response.json())
        .then(estruturaMataMata => {
            const container = document.getElementById('mata-mata-container');
            
            let htmlQuartas = '<div class="fase"><h2>Quartas de Final</h2>';
            estruturaMataMata.quartas.forEach(jogo => {
                const time1 = timesMapeados[jogo.time1_placeholder];
                const time2 = timesMapeados[jogo.time2_placeholder];
                htmlQuartas += `
                    <div class="confronto">
                        <div class="time">
                            <img src="${time1.bandeira}" alt="">
                            <span>${time1.nome}</span>
                        </div>
                        <div class="time">
                            <img src="${time2.bandeira}" alt="">
                            <span>${time2.nome}</span>
                        </div>
                    </div>
                `;
            });
            htmlQuartas += '</div>';

            // Placeholder para futuras fases
            const htmlSemis = '<div class="fase"><h2>Semifinais</h2></div>';
            const htmlFinal = '<div class="fase"><h2>Final</h2></div>';

            container.innerHTML = htmlQuartas + htmlSemis + htmlFinal;
        });
}
