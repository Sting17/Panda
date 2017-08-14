const Discord = module.require("discord.js");
const fs = require("fs");


module.exports.run = async (client, message, args) => {

//Check if command executor has the right permissions to do this command
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You arent *based* enough!")

//Get the mentioned user, return if there is none.
let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if(!toMute) return message.channel.send("You did not specifiy a user or ID!");

if(toMute.id == message.author.id) return message.channel.send("You can't ummute yourself!");
if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't ummute a member that has a ~~higher~~ better role or the same as you!");


let role = message.guild.roles.find(r => r.name === "Bad Bois (Muted)");
if(!role || !toMute.roles.has(role.id)) return message.channel.send("This users is not a Bad Boi!");

await toMute.removeRole(role);

delete client.mutes[toMute.id];

fs.writeFile("./mutes.json", JSON.stringify(client.mutes), err => {
    if(err) throw err;
    message.channel.send(`${toMute.user} is no longer a Bad Boi! Welcome back!`);
    console.log(`I have unmuted ${toMute.user.tag}.`);

});




}
module.exports.help = {
  name: "unmute",

}
