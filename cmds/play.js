const Discord = module.require("discord.js");
const ytdl = require("ytdl-core");
//const request = require("request");
//const getYouTubeID = require("get-youtube-id");
//const fetchVideoInfo = require("yourtube-info")

module.exports.run = async (client, message, args) => {

// voiceChannel = message.member.voiceChannel;

function play(connection, message) {
    var server = servers[message.guild.id];
console.log(id)

server.dispatcher = connection.playStream(ytdl(server.queue[1], {filter: "audioonly"}));

server.queue.shift();

server.dispatcher.on("end", function() {
      if (server.queue[1]) play(connection, message);
      else connection.disconnect();
  });
}

var servers ={};
var server = servers[message.guild.id];


if (!args[0]) {
  message.channel.send("Please provide a YoutTube link!")
    return;

    }
if (!message.member.voiceChannel) {
  message.channel.send("You must be in a Voice Channel for this command to work!")
    return;
}
  if(!server[message.guild.id]) servers[message.guild.id] = {
      queue: []

  };


  if (!message.guild.voiceConnection) voiceChannel.join().then(function(connection) {
    console.log(join)
    play(connection, message);
  });


server.queue.push(args[0]);


}


module.exports.help = {
  name: "play",

}
