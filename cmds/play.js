const Discord = module.require("discord.js");
//

module.exports.run = async (client, message, args) => {

if (!args[1]) {
  message.channel.send("please proviide a link")
    return;

    }
if (!message.mnember.voiceChannel) {
  message.channel.send("please be in a voice channel")
    return;
}


}
module.exports.help = {
  name: "play",

}
