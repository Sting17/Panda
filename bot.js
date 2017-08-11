const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const prefix = botSettings.prefix;

const client = new Discord.Client({disableEveryone: true})

client.on("ready", async () => {
   console.log(`${client.user.username} is ready! - Groooowwwl! `);

   try {
     let link = await client.generateInvite(["ADMINISTRATOR"]);
     console.log(link);
   } catch(e) {
     console.log(e.staack);
   }

});

client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return message.channel.sendMessage("No DM commands");

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice[1];

    if(!command.startsWith(prefix)) return;

    if(command === `${prefix}userinfo`) {
        let embed = new Discord.RichEmbed()
          .setAuthor(message.author.username)
          .setDescription(`This is ${message.author.username}'s info!`)
          .setThumbnail(message.author.avatarURL)
          .setColor("#ffca00")
          .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
          .addField("Joined Discord", message.author.createdAt);


          message.channel.sendEmbed(embed);

          return;
    }

});

client.login(botSettings.token);
