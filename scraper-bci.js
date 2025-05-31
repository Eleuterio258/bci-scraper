const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;
const BCI_URL = 'https://www.bci.co.mz/cambio/';

app.get('/api/cambio', async (req, res) => {
  try {
    const { data } = await axios.get(BCI_URL);
    const $ = cheerio.load(data);
    const resultados = [];

    $('table tbody tr').each((i, el) => {
      const tds = $(el).find('td');

      const pais = $(tds[0]).text().trim();
      const moeda = $(tds[1]).text().trim();
      const compra = parseFloat($(tds[2]).text().trim().replace(',', '.'));
      const venda = parseFloat($(tds[3]).text().trim().replace(',', '.'));

      if (pais && moeda && !isNaN(compra) && !isNaN(venda)) {
        resultados.push({ pais, moeda, compra, venda });
      }
    });

    res.json({ atualizado_em: new Date().toISOString(), cambio: resultados });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar dados do BCI', detalhes: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
