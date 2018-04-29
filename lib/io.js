const fs = require('fs');
var Promise = require('bluebird');

var io = {
  read : function(filename){
    return new Promise((done,error) => {
      fs.readFile(filename, function(err, data) {
        if (err) return error(err);
        var lines = data.toString().split("\n");
        done(lines);
      });
    })
  }
}
module.exports = io;