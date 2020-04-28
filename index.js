const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const emoji = require('node-emoji')

const token = '1079380672:AAEFfeo0EAh-T3k4h8BqOfEKgySP1MVKLng';
const bot = new TelegramBot(token, {
  polling: true
});

bot.on("polling_error", (err) => console.log(err));

bot.onText(/\/cases (.*)/, (msg, match) => {
  request.get('https://coronavirus-19-api.herokuapp.com/countries/' + match[1],
    function(err, res, body) {
      if (body == "Country not found") {
        return bot.sendMessage(msg.chat.id, "Can't find country: " + match[1]);
      }
      let data = JSON.parse(body);
      request.get('https://restcountries.eu/rest/v2/name/' + match[1],
        function(err1, res1, body1) {
          if (data['country'].toLowerCase() == "israel") {
            return bot.sendMessage(msg.chat.id, "Can't find country: " + match[1]);
          }
          data['country'] = data['country'] == "World" ? "World" + emoji.emojify(":earth_asia:") : data['country'] + " " + emoji.emojify(":flag-" + JSON.parse(body1)[0].alpha2Code.toLowerCase() + ":");
          bot.sendMessage(msg.chat.id, Object.keys(data).map((key, i) => `${key} : ${Object.values(data)[i]}\n`).join ``);
        }
      );
    });
});
