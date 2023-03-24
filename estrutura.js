const fs = require("fs");
const path = require("path");

const pastaOrigem = "./musicas";
const pastaDestino = "./pastaDestino";

// função que percorre recursivamente a estrutura de pastas da pasta de origem
const criarPastas = (pastaOrigem, pastaDestino) => {
  // criar a pasta de destino, se ela ainda não existir
  if (!fs.existsSync(pastaDestino)) {
    fs.mkdirSync(pastaDestino);
  }

  // percorrer todos os itens da pasta de origem
  const itens = fs.readdirSync(pastaOrigem);
  for (const item of itens) {
    const caminhoItemOrigem = path.join(pastaOrigem, item);
    const caminhoItemDestino = path.join(pastaDestino, item);

    // verificar se é uma pasta e criar a pasta correspondente na pasta de destino
    if (fs.statSync(caminhoItemOrigem).isDirectory()) {
      criarPastas(caminhoItemOrigem, caminhoItemDestino);
    } else {
      continue;
    }
  }
};

// chamar a função para criar a estrutura de pastas na pasta de destino
criarPastas(pastaOrigem, pastaDestino);