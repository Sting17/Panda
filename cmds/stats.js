const botSettings = require("../botsettings.json");
const Discord = module.require("discord.js");
const {PubgAPI, PubgAPIErrors, REGION, SEASON, MATCH} = require('pubg-api-redis');

const {matchSeasonConstant, matchRegionConstant, matchModeConstant} = require('../util/PUBGConstantsChecks.js');

//init our api object //no redis settings for now
const pubg = new PubgAPI({
  apikey: botSettings.pubgApiKey
})

//export out the run command
module.exports.run = async (client, message, args) => {
  if(args.length == 0){
    message.channel.send("`stats **playername** *region* *mode* \n" +
    "Available options listed below. \n" +
    "playername: **Required** PUBG Nickname \n" +
    "region: as, eu, na, oc, sa, sea, *all(default)*  \n" +
    "Mode: solo, duo, *squad(default)* \n" +
    "Seasons: 2017-pre1, 2017-pre2, *2017-pre3(default)* "
   );
  }

  //Check for minimium arguments
  if(args.length >= 1){
    //Check Region Argument and assing one if missing
    var region, mode, season;

    if(args[1]){
      region = matchRegionConstant(args[1]);
    }else{
      region = "agg";
    }

    if(args[2]){
      mode = matchModeConstant(args[2]);
    }else{
      mode = "squad";
    }

    if(args[3]){
      season = matchSeasonConstant(args[3]);
    }else{
      season = "2017-pre3";
    }

    //Send a notification back that we are working on getting the data!
    message.channel.send("Getting " + args[0] +"'s Stats For Region: **" + region + "**  Mode:**" + mode +"**  Season:**" +season + "**" );

    //Get this players stats
    pubg.profile.byNickname(args[0])
      .then((profile) =>{

        //console.log(profile);

        const data = profile.content;
        const stats = profile.getStats({
          region: region,
          match: mode,
          season: season
        });

        if(!stats){
          message.channel.send("Ooops! Thats not good! We didnt get any stats?");
        }else{
          let embed = new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setDescription(`This is ${args[0]}'s PUBG Stats!`)
            .setThumbnail(message.author.avatarURL)
            .setColor("#ffca00")
            .addField("Rating", stats.skillRating.rating)
            .addField("Wins", stats.performance.wins)
            .addField("Wins Top 10 Ratio", stats.performance.winTop10Ratio)
            .addField("Top 10", stats.performance.top10s)
            .addField("Top 10 Ratio", stats.performance.top10Ratio)

          message.channel.send({embed: embed});
        }
      }).catch((error)=>{
        console.log(error)
        message.channel.send("Ooops! Thats not good! We had an error" + JSON.stringify(error));
      });
  }

}

module.exports.help = {
  name: "stats",
  description: "Does things with stats"
}
