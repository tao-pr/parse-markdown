const fs = require('fs');
var Promise = require('bluebird');

var io = {
  read : function(filename){
    return new Promise((done,error) => {
      fs.readFile(filename, function(err, data) {
        if (err) return error(err);
        done(data.toString());
      });
    })
  },

  writeToFile : function(filename){
    return function(md){
      return new Promise((done,error) => {
        if (typeof md === 'string'){
          fs.writeFile(filename, md, (err) => {
            if (err) return error(err);
            if (process.env.isDebug) console.log(`File saved as : ${filename}`);
            return done(filename)
          })
        }
        else {
          return error(`Expect filename to be string, but got ${typeof md} instead`)
        }
      })
    }
  }
}
module.exports = io;