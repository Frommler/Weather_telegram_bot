const { Telegraf } = require("telegraf"),
  TOKEN = "5767772684:AAFIrs0zyy4klNzIEsu2kC40BA7nOkxIV_4",
  bot = new Telegraf(TOKEN);

let cityPerId = {};
let userHoursPerId = {};
let userMinPerId = {};

/* user.name = "Alex";
user[name] = "Alex";
user[12412412414] = "Alex";
cityPerId[98765433456789] = "London";
cityPerId.98765433456789 = "London"; */

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
//-------регулярний вираз / контекст
bot.action(/^setCity-(\w+)/, (ctx) => {
  cityPerId[ctx.chat.id] = ctx.match[1];
  console.log(cityPerId);
  ctx.replyWithHTML("Set your time: ", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Own time", callback_data: "setOwnTime" }],
        [
          { text: "9:00", callback_data: "setTime-9" },
          { text: "10:00", callback_data: "setTime-10" },
          { text: "11:00", callback_data: "setTime-11" },
          { text: "12:00", callback_data: "setTime-12" },
        ],
      ],
    },
  });
});

bot.action(/^setTime-(\d+)/, (ctx) => {
  userHoursPerId[ctx.chat.id] = ctx.match[1];
  userMinPerId[ctx.chat.id] = "00";
  ctx.reply("You set time - " + userHoursPerId[ctx.chat.id] + ":00");
  setInterval(() => {
    checkTime(ctx);
  }, 60000);
});

bot.action("setOwnTime", (ctx) => {
  ctx.reply("Input your time in format HH:MM");
});

//TODO - check hours am pm

bot.hears(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, (ctx) => {
  userHoursPerId[ctx.chat.id] = ctx.match[1];
  userMinPerId[ctx.chat.id] = ctx.match[2];
  setInterval(() => {
    console.log("setInterval");
    checkTime(ctx);
  }, 60000);
  ctx.reply("You set time - " + ctx.match[0]);
});

bot.launch();

function checkTime(ctxObj) {
  let now = new Date();
  console.log("CHECK TIME");
  console.log(userHoursPerId[ctxObj.chat.id] + "=" + now.getHours());
  console.log(userMinPerId[ctxObj.chat.id] + "=" + now.getMinutes());

  if (
    Number(userHoursPerId[ctxObj.chat.id]) == now.getHours() &&
    Number(userMinPerId[ctxObj.chat.id]) == now.getMinutes()
  ) {
    console.log("Go to serwer" + cityPerId);
    fetch("http://localhost:9000/weather/" + cityPerId[ctxObj.chat.id])
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        ctxObj.reply("Temperature in " + data.city + ": " + data.temp);
      });
  }
}

/* setInterval(() => {
  fetch("http://localhost:9000/weather/" + cityPerId[ctx.chat.id])
    .then((response) => response.json())
    .then((data) => {
      ctx.reply("Temperature in " + data.city + ": " + data.temp);
    });
}, 30000); */
