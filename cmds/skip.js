const Discord = module.require("discord.js");
//const MusicPlayer = require('../util/MusicPlayer.js');
const ytdl = require("ytdl-core");

module.exports.run = async (client, message, args, servers) => {
  if (servers[message.guild.id].queue[0]) {
    play(servers[message.guild.id].connection, message, servers);
  }else {
    servers[message.guild.id].connection.disconnect()
  };
}

module.exports.help = {
  name: "skip",
 }

function play (connection, message, servers) {
     servers[message.guild.id].dispatcher = connection.playStream(ytdl(servers[message.guild.id].queue[0], {filter: "audioonly"}));
     servers[message.guild.id].queue.shift();
     servers[message.guild.id].dispatcher.end();
     servers[message.guild.id].dispatcher.on("end", function() {
         if (servers[message.guild.id].queue[0]) play(servers[message.guild.id].connection, message, servers);
         else connection.disconnect();
     });
}
