const { Telegraf } = require("telegraf"),
  TOKEN = "5767772684:AAFIrs0zyy4klNzIEsu2kC40BA7nOkxIV_4",
  bot = new Telegraf(TOKEN);

let cityPerId = {};

bot.start((ctx) => {
  ctx.replyWithHTML("Choise your city: ", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "London", callback_data: "setCity-London" }],
        [{ text: "Szczecin", callback_data: "setCity-Szczecin" }],
        [
          { text: "Bodegraven", callback_data: "setCity-Bodegraven" },
          { text: "Kharkiv", callback_data: "setCity-Kharkiv" },
        ],
      ],
    },
  });
});
//регулярний вираз / контекст
bot.action(/^setCity-(\w+)/, (ctx) => {
  cityPerId[ctx.chat.id] = ctx.match[1];
  console.log(cityPerId);
  setInterval(() => {
    fetch("http://localhost:9000/weather/" + cityPerId[ctx.chat.id])
      .then((response) => response.json())
      .then((data) => {
        ctx.reply("Temperature in " + data.city + ": " + data.temp);
      });
  }, 30000);
});
bot.launch();
