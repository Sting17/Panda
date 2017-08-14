const Discord = module.require("discord.js");

module.exports.run = async (client, message, args) => {
          let embed = new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setDescription(`This is ${message.author.username}'s info!`)
            .setThumbnail(message.author.avatarURL)
            .setColor("#ffca00")
            .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
            .addField("Now Playing", message.author.game)
            .addField("Joined Discord", message.author.createdAt)
            .addField(`Is ${message.author.username} an Admin?`, `Yes`  )


            message.channel.send({embed: embed});


}
module.exports.help = {
  name: "userinfo",

}
