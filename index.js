const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

// definir pasta de origem, pasta de destino e bitrate desejado
const pasta_origem = "./musicas";
const pasta_destino = "./convertidas";
const bitrate_desejado = "128k";

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

const converterArquivos = (pasta_origem, pasta_destino, bitrate_desejado) => {
  if (!fs.existsSync(pasta_destino)) {
    fs.mkdirSync(pasta_destino, { recursive: true });
  }

  // percorrer todas as pastas da pasta de origem
  const pastas = [pasta_origem];
  while (pastas.length > 0) {
    const pasta_atual = pastas.shift();

    // percorrer todos os arquivos da pasta atual
    const arquivos = fs.readdirSync(pasta_atual);
    for (const arquivo of arquivos) {
      const caminho_arquivo = path.join(pasta_atual, arquivo);

      // verificar se é um diretório e adicionar à lista de pastas a serem percorridas
      if (fs.statSync(caminho_arquivo).isDirectory()) {
        pastas.push(caminho_arquivo);
      } else if (path.extname(caminho_arquivo) === ".mp3") {
        // converter o arquivo de áudio para o bitrate desejado e salvar na pasta de destino
        const nome_arquivo = path.basename(caminho_arquivo, ".mp3");
        const caminho_destino = path.join(
          pasta_destino,
          path.relative(pasta_origem, pasta_atual),
          `${nome_arquivo}.mp3`
        );

        ffmpeg(caminho_arquivo)
          .audioBitrate(bitrate_desejado)
          .on("error", (err) => {
            console.error(
              `Erro ao converter arquivo ${caminho_arquivo}: ${err.message}`
            );
          })
          .on("end", () => {
            console.log(`Arquivo ${caminho_arquivo} convertido com sucesso.`);
          })
          .save(caminho_destino);
      }
    }
  }
};
criarPastas(pasta_origem, pasta_destino);
converterArquivos(pasta_origem, pasta_destino, bitrate_desejado);
