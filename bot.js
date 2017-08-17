const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const fs = require("fs");

const prefix = botSettings.prefix;
// const yt_api_key = botSettings.yt_api_key;



const client = new Discord.Client({disableEveryone: true})
client.commands = new Discord.Collection();
client.mutes = require("./mutes.json");

fs.readdir("./cmds", (err, files) => {
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0) {
        console.log("No commands to load!");
        return;

    }
    console.log(`Loading ${jsfiles.length} commands!`)

    jsfiles.forEach((f, i) => {
      let props = require(`./cmds/${f}`);
      console.log(`${i + 1}: ${f} loaded!`);
      client.commands.set(props.help.name, props);

    });
});


client.on("ready", async () => {
   console.log(`${client.user.username} is ready! - Groooowwwl! `);

// client.on("debug", async(info)=>{
//     console.log(info);
// })


  client.setInterval(() => {
    for(let i in client.mutes) {
      let time = client.mutes[i].time;
      let guildId = client.mutes[i].guild;
      let guild = client.guilds.get(guildId);
      let member = guild.members.get(i);
      let mutedRole = guild.roles.find(r => r.name === "Bad Bois (Muted)");
      if(!mutedRole) continue;

      if(Date.now() > time) {
        console.log(`${i} is now able to me unmuted`)

        member.removeRole(mutedRole);
        delete client.mutes[i];

        fs.writeFile("./mutes.json", JSON.stringify(client.mutes), err => {
            if(err) throw err;
            console.log(`I have unmuted ${member.user.tag}.`);
        });
      }
    }
  }, 5000)

//   try {
//     let link = await client.generateInvite(["ADMINISTRATOR"]);
//     console.log(link);
//   } catch(e) {
//     console.log(e.stack);
//   }

});



client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return message.channel.send("No DM commands");

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(prefix)) return;

    let cmd = client.commands.get(command.slice(prefix.length));
    if(cmd) cmd.run(client, message, args);



});

client.login(botSettings.token);
