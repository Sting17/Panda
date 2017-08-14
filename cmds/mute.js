const Discord = module.require("discord.js");
const fs = module.require("fs");

module.exports.run = async (client, message, args) => {
  // Check if command executor has the right permissions to do this command
      if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You arent *based* enough!")

      //Get the mentioned user, return if there is none.
      let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
      if(!toMute) return message.channel.send("You did not specifiy a user or ID!");

      if(toMute.id == message.author.id) return message.channel.send("You can't mute yourself!");
      if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't mute a member that has a ~~higher~~ better role or the same as you!");

      let role = message.guild.roles.find(r => r.name === "Bad Bois (Muted)");
      if (!role) {

            role = await message.guild.createRole({
              name: "Bad Bois (Muted)",
              color: "Black",
              permissions: []
            });

            message.guild.channels.forEach(async (channel, id) => {
              await channel.overwritePermissions(role, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
              });

            });

      }
try{
      if(toMute.roles.has(role.id)) return message.channel.send("This users is already a Bad Boi!");

      client.mutes[toMute.id] = {
          guild: message.guild.id,
          time: Date.now() + parseInt(args[1]) * 1000
      }

      fs.writeFile("./mutes.json", JSON.stringify(client.mutes, null, 4), err => {
        if(err) throw err;
        //  message.channel.send("**TIMED MUTE**")
      });
}catch(e) {
  console.log(e.stack);

}
      await toMute.addRole(role);
      message.channel.send(`${toMute.user} is a Bad Boi! STFU!`);

}
module.exports.help = {
  name: "mute",

}
