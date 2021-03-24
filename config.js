const fs = require('fs');

exports.get = function(setting) {
  let data = fs.readFileSync('./config.json', {encoding: 'utf8', flag:'r'});

  let obj = JSON.parse(data);
  let res = obj[setting];

  if (res === undefined){
    console.error(`Could not find ${setting} in config file.`);
    return "";
  }
  return res;
};

console.log(this.get('token'))
