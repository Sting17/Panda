const Discord = module.require("discord.js");
const ytdl = require("ytdl-core");
//const request = require("request");
//const getYouTubeID = require("get-youtube-id");
//const fetchVideoInfo = require("yourtube-info")
//

module.exports.run = async (client, message, args) => {

function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(ytdl(server.queue[1], {filter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() {
      if (server.queue[1]) play(connection, message);
      else connection.disconnect();
  });
}

if (!args[0]) {
  message.channel.send("Please provide a YoutTube link!")
    return;

    }
if (!message.member.voiceChannel) {
  message.channel.send("You must be in a Voice Channel for this command to work!")
    return;
}
  if(!server[message.guid.id]) servrs[message.guild.id] = {
    queue: []
  };

 var server = server[message.guild.id];

 if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
   play(connection, message);
 });

}





module.exports.help = {
  name: "play",

}
