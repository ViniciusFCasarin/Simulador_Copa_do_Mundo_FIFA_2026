// js/main.js

// Usamos a função fetch para buscar o arquivo JSON local
fetch('./data/selecoes.json')
  .then(resposta => {
    // Verifica se o arquivo foi encontrado corretamente
    if (!resposta.ok) {
        throw new Error('Erro ao carregar o arquivo JSON');
    }
    return resposta.json(); // Converte a resposta para um objeto JavaScript
  })
  .then(dados => {
    console.log("JSON carregado com sucesso!\n\n");
    
    // Podemos printar o objeto inteiro para ver a estrutura bruta:
    console.log("Estrutura completa:", dados);
    console.log("----------------------------------\n");

    // Object.keys(dados) retorna um array com as chaves: ["Grupo A", "Grupo B"]
    Object.keys(dados).forEach(nomeGrupo => {
        
        console.log(`🏆 ${nomeGrupo.toUpperCase()}:`);
        console.log("----------------------------------");

        // dados[nomeGrupo] acessa o array correspondente à chave atual do loop
        dados[nomeGrupo].forEach(time => {
            console.log(`ID: ${time.id} | ${time.nome.padEnd(20, ' ')} | Pontos: ${time.pontos} | Saldo: ${time.saldo}`);
        });

        console.log("\n"); // Quebra de linha entre os grupos
    });

  })
  .catch(erro => {
    console.error("Ocorreu um erro:", erro);
  });