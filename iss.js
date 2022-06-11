const request = require("request");

const fetchMyIP = function(callback) {
  request("https://api.ipify.org/?format=json", (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode != 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  const geoAPI = `https://api.ipbase.com/json/${ip}?apikey=Od9ODUI0EXbCsfoi9ybxMSyeGielCAPirGAwtSc2`;

  request(geoAPI, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode != 200) {
      const msg = `Status Code ${response.statusCode} when fetching Geo Coordinates for IP: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body);
    const coords = { latitude, longitude };
    callback(null, coords);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const issApi = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(issApi, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode != 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS Flyover Times`;
      callback(Error(msg), null);
      return;
    }

    const issFlyoverTimes = JSON.parse(body).response;
    callback(null, issFlyoverTimes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, issFlyoverTimes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, issFlyoverTimes);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
