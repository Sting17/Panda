const Discord = module.require("discord.js");
const ytdl = require("ytdl-core");

module.exports.run = async (client, message, args, servers) => {
  if (!args[0]) {
    message.channel.send("Please provide a YoutTube link!")
    return;
  }

  if (!message.member.voiceChannel) {
    message.channel.send("You must be in a Voice Channel for this command to work!")
    return;
  }

  if(!servers[message.guild.id]){
    servers[message.guild.id] = {
      queue: []
    }
  }

  servers[message.guild.id].queue.push(args[0]);

  if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(_connection) {
    servers[message.guild.id].connection = _connection;
    play(_connection, message, servers);
  });


}//end module.exports.run

module.exports.help = {
  name: "play"
}

function play (connection, message, servers) {
    servers[message.guild.id].dispatcher = connection.playStream(ytdl(servers[message.guild.id].queue[0], {filter: "audioonly"}));
    servers[message.guild.id].queue.shift();

    servers[message.guild.id].dispatcher.on("end", function() {
        if (servers[message.guild.id].queue[0]) play(servers[message.guild.id].connection, message, servers);
        else connection.disconnect();
    });
}
