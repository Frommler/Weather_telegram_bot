setInterval(() => {
  console.log("setInterval");
  checkTime();
}, 60000);

const { Telegraf } = require("telegraf"),
  TOKEN = "5767772684:AAFIrs0zyy4klNzIEsu2kC40BA7nOkxIV_4",
  bot = new Telegraf(TOKEN);

//TODO - base update by changes

let dataBase = [{ id: 1, city: "London", hours: "9", mins: "15" }];
let cityPerId = {};
let userHoursPerId = {};
let userMinPerId = {};
let i = 0;
let g = 0;

/* user.name = "Alex";
user[name] = "Alex";
user[12412412414] = "Alex";
cityPerId[98765433456789] = "London";
cityPerId.98765433456789 = "London"; */

bot.start((ctx) => {
  dataBase.push({ id: ctx.chat.id });
  console.log(dataBase);

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
  let found = dataBase.find((item) => item.id == ctx.chat.id);
  if (found != undefined) {
    console.log("found", found);
    found.city = ctx.match[1];
  } else {
    dataBase.push({ id: ctx.chat.id, city: ctx.match[1] });
    console.log(dataBase);
  }
  console.log("dataBase", dataBase);
  ctx.replyWithHTML("Set your alert time: ", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Own alert time", callback_data: "setOwnTime" }],
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
//TODO - add IF when object doesn`t exist
bot.action(/^setTime-(\d+)/, (ctx) => {
  try {
    let found = dataBase.find((item) => item.id == ctx.chat.id);
    console.log("found1", found);
    found.hours = ctx.match[1];
    found.mins = "00";
    console.log("dataBase1", dataBase);
    ctx.reply("You set alert time - " + found.hours + ":00");
  } catch (error) {
    console.log("error", error);
  }
});

bot.action("setOwnTime", (ctx) => {
  ctx.reply("Input your time in format HH:MM");
});

//TODO - check hours am pm time zone

bot.hears(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, (ctx) => {
  try {
    let found = dataBase.find((item) => item.id == ctx.chat.id);
    console.log("found2", found);
    found.hours = ctx.match[1];
    found.mins = ctx.match[2];
    console.log("ctx.match[0]", ctx.match[0]);
    console.log("ctx.match[2]", ctx.match[2]);
    console.log("dataBase2", dataBase);
    ctx.reply("You set time - " + ctx.match[0]);
  } catch (error) {
    console.log("error", error);
  }
});

bot.launch();

function checkTime() {
  let now = new Date();
  console.log("checkTime");
  dataBase.forEach((item) => {
    console.log("item", item.hours + item.mins);
    if (
      Number(item.hours) == now.getHours() &&
      Number(item.mins) == now.getMinutes()
    ) {
      console.log("Go to serwer" + item.city);
      fetch("http://localhost:9000/weather/" + item.city)
        .then((response) => response.json())
        .then((data) => {
          g++;
          console.log("go to server" + g);
          bot.telegram.sendMessage(
            item.id,
            "Temperature in " + data.city + ": " + data.temp
          );
        });
    }
  });
}
