module.exports.run = async (client, message, args) => {
  let msg = await message.channel.send("Generating avatar....");

  console.log("this is a message", message);

    await message.channel.send({files: [
      {
        attachment: message.author.displayAvatarURL,
        name: "avatar.png"
      }
    ]});
msg.delete();
}
module.exports.help = {
  name: "avatar",

}
