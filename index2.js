const { nextISSTimesForMyLocation } = require('./iss_promised'); //why we exoirted ab object

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date();
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    return printPassTimes(passTimes);
  }) 
  .catch((error) => {
    console.log(`It didnt' workk:`, error)
  })
