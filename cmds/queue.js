const Discord = module.require("discord.js");
//const MusicPlayer = require('../util/MusicPlayer.js');

module.exports.run = async (client, message, args, servers) => {

  if(typeof servers[message.guild.id] !== 'undefined'){
    if(servers[message.guild.id].queue){
      songList = "The queue contains "+ servers[message.guild.id].queue.length + "\n";
      /*
      servers[message.guild.id].queue.forEach(function(value){
        songList = songList + value +"\n";
      });
      */
      message.channel.send(songList);
    }
  }else{
    message.channel.send("No queue yet.");
  }
}

module.exports.help = {
  name: "queue",
 }
