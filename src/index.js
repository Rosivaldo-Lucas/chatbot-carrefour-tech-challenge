const request = require('request');
const TelegramBot = require('node-telegram-bot-api');

const configs = require('./config/configs');
const util = require('./utils/toConvert');

const URL_API = configs.URL_API;
const TOKEN_API = configs.TOKEN_API;
const TOKEN_TELEGRAM = configs.TOKEN_TELEGRAM;

const bot = new TelegramBot(TOKEN_TELEGRAM, { polling: true });

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json;charset=UTF-8',
    'x-ibm-client-id': TOKEN_API,
  }
};

let productList = [];

function find(productName) {
  const products = productList.filter((product) => product.name.includes(productName));

  return products;
}

request.get(URL_API, options, (error, response) => {
  if (error) {
    console.log('Error: ', error);
    return;
  }

  const products = util.toConvert(JSON.parse(response.body).products);

  productList = products;
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
    'Olá ' +
    msg.from.first_name +
    ', sejá bem vindo ao Botzinho Carrefour. Aqui você encontra tudo que precisa, ' +
    'sem sair do conforto da sua casa.\nPara começar a usar, pesquise pelo produto que deseja: ');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const { text } = msg;

  if (text.toString().toLowerCase().includes('/start')) {
    return;
  }

  const message = text.toLowerCase();
  if (message === 'olá' || message === 'oi') {
    bot.sendMessage(chatId, 'Olá, comece pesquisando um produto:');
    return;
  }

  const products = find(text);

  bot.sendMessage(chatId, 'Pesquisando o produto...');

  if (products.length === 0) {
    bot.sendMessage(chatId, 'Infelizmente não encontramos o seu produto. Por favor, verifique se digitou nome válido.');
    return;
  }

  for (const p of products) {
    bot.sendMessage(chatId,
      `Descrição: ${p.name}\n\nPreço: ${p.price}\n\nEncontre o produto em: ${p.path}`);
  }

  bot.sendMessage(chatId, 'Encontrou o seu produto?');
  bot.sendMessage(chatId, 'Continue pesquisando por seus produtos preferidos. :)');
});
