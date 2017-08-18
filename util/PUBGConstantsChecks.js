//Ensures that the string we send matches one of the defined vaules
//if not the default is used
module.exports.matchSeasonConstant = (arg) =>{
  const lowerArg = arg.toLowerCase();
  switch(lowerArg){
    case "2017-pre1":
      return lowerArg
    case "2017-pre2":
      return lowerArg
    case "2017-pre3":
      return lowerArg;
    default:
      return "2017-pre3";
  }
}

//Ensures that the string we send matches one of the defined vaules
//if not the default is used
module.exports.matchRegionConstant = (arg) =>{
  const lowerArg = arg.toLowerCase();
  switch(lowerArg){
    case "all":
      return "agg";
    case "as":
      return lowerArg;
    case "eu":
      return lowerArg;
    case "na":
      return lowerArg;
    case "oc":
      return lowerArg;
    case "sa":
      return lowerArg;
    case "sea":
      return lowerArg;
    default:
      return "agg";
  }
}

//Ensures that the string we send matches one of the defined vaules
//if not the default is used
module.exports.matchModeConstant = (arg) => {
  const lowerArg = arg.toLowerCase();
  switch(lowerArg){
    case "solo":
      return lowerArg;
    case "duo":
      return lowerArg;
    case "squad":
      return lowerArg;
    default:
      return "squad";
  }
}

module.exports.matchStatType = (arg) =>{
  switch(arg){
    case "kda":
      return performance.killDeathRatio;
    case "killsPg":
      return perGame.killsPg;
  }
}
