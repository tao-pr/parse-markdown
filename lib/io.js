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
  }
}
module.exports = io;