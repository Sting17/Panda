const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true});

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
    //Check Region Mode, SeasonsArgument and assing one if missing
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

        if(!stats && !data){
          message.channel.send("Ooops! Thats not good! We didnt get any stats?");
        }else{
          //Ok we have stats data we need to make a file to send now
          //call our send command and pass the function call to our createStatsImage(stats)
          createStatsImage(data, stats, function(image){
            message.channel.send({
              files: [
                      image
                    ]
            });
          })

          /*
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
          */
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


function createStatsImage(profile, stats, callback){
  const imageDir = "assets/images/";
  const statsBackground = imageDir + "stats-bg-small.jpg";
  const statsImage = imageDir + stats.playerName  + ".jpg";

  //START WITH OUR BACKGROUND IN THE UPPER LEFT
  gm(statsBackground)
  .gravity("NorthWest")
  .font('assets/fonts/Oswald-Bold.ttf')
  .fill("#ffff00")
  .fontSize(45)
  .drawText(20,10, stats.playerName)

  .fontSize(16)
  .fill("#fefefe")
  .font('assets/fonts/Oswald-Light.ttf')
  .drawText(20,75, (stats.match.charAt(0).toUpperCase()+ stats.match.slice(1)) +" - " + stats.region.toUpperCase() +"  " + stats.season )


  //--RATING
  .gravity("West")
  .fontSize(14)
  .fill("#fefefe")
  .font('assets/fonts/Oswald-Light.ttf')
  .drawText(160,-65, "TOP")

  .gravity("West")
  .fontSize(20)
  .fill("#ffff00")
  .font('assets/fonts/Oswald-Regular.ttf')
  .drawText(25,-50, "RATING")

  .fontSize(30)
  .font('assets/fonts/Oswald-Medium.ttf')
  .drawText(65,-15, stats.skillRating.rating)


  //--WINS
  .gravity("Center")
  .fontSize(14)
  .fill("#fefefe")
  .font('assets/fonts/Oswald-Light.ttf')
  .drawText(70,-65, "TOP")
  .drawText(70,-50, stats.performance.winTop10Ratio +"%")
  .drawLine(20,150, 180,150)

  .gravity("Center")
  .fontSize(20)
  .fill("#ffff00")
  .font('assets/fonts/Oswald-Medium.ttf')
  .drawText(-70,-50, "WINS")

  .fontSize(30)
  .font('assets/fonts/Oswald-Medium.ttf')
  .drawText(0,-15, stats.performance.wins)




  //--Top 10s
  .gravity("East")
  .fontSize(14)
  .fill("#fefefe")
  .font('assets/fonts/Oswald-Light.ttf')
  .drawText(20,-65, "TOP")
  .drawText(20,-50, stats.performance.top10Ratio +"%")
  .drawLine(200,150, 380,150)


  .gravity("East")
  .fontSize(20)
  .fill("#ffff00")
  .font('assets/fonts/Oswald-Medium.ttf')
  .drawText(130,-50, "TOP 10s")
  //.drawLine(20,-25, 160,-25)

  .fontSize(30)
  .font('assets/fonts/Oswald-Medium.ttf')
  .drawText(80,-15, stats.performance.top10s)
  .drawLine(400,150, 580,150)



  //--KD
  .gravity("West")
  .fontSize(14)
  .fill("#fefefe")
  .font('assets/fonts/Oswald-Light.ttf')
  .drawText(160,45, "TOP")

  .gravity("West")
  .fontSize(20)
  .fill("#ffff00")
  .font('assets/fonts/Oswald-Regular.ttf')
  .drawText(25,60, "K/D")
  .drawLine(20,260, 180,260)

  .fontSize(30)
  .font('assets/fonts/Oswald-Medium.ttf')
  .drawText(65,95, stats.performance.killDeathRatio)



  //--WIN %'s'
  .gravity("Center")
  .fontSize(14)
  .fill("#fefefe")
  .font('assets/fonts/Oswald-Light.ttf')
  .drawText(60,45, "TOP")
  .drawText(60,60, stats.performance.winTop10Ratio +"%")

  .gravity("Center")
  .fontSize(20)
  .fill("#ffff00")
  .font('assets/fonts/Oswald-Medium.ttf')
  .drawText(-70,60, "WIN %")

  .fontSize(30)
  .font('assets/fonts/Oswald-Medium.ttf')
  .drawText(0,100, stats.performance.winRatio)
  .drawLine(200,260, 380,260)


  //--Top 10s
  .gravity("East")
  .fontSize(14)
  .fill("#fefefe")
  .font('assets/fonts/Oswald-Light.ttf')

  .gravity("East")
  .fontSize(20)
  .fill("#ffff00")
  .font('assets/fonts/Oswald-Medium.ttf')
  .drawText(80,60, "TIME SURVIED")
  //.drawLine(20,-25, 160,-25)

  .fontSize(30)
  .font('assets/fonts/Oswald-Medium.ttf')
  .drawText(60,100, stats.performance.timeSurvived)
  .drawLine(400,260, 580,260)

  //LASTLY WRITE THIS TO A LOCAL FILE AND SEND IT OFF
  .write(statsImage, function(err){
    if(!err){
      callback(statsImage);
    }else{
      console.log(err);
    }
  })

}
