const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const handler = require('./commands');
const config = require('./config');
// bad, put this in a file doofus
const token = config.get('token');

const prefix = '$'

// initial setup
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// message listener for commands
client.on('message', msg => {
    if (msg.content.startsWith(prefix)) {
        handle(msg, msg.content.slice(1, msg.content.length));
    }
});

client.on('error', err => {
  fs.appendFile("errorlog.txt", err, function(er) {
    if (er) throw er;
    console.log('Error written to file.');
  });
  fs.close();
})

// handling commands
// New commands should go here
function handle(msg, command){
  // parse arguments
  let tokens = command.split(' ');
  let args = [];
  if (tokens.length > 1){
    args = tokens.slice(1);
  }
    switch(tokens[0]){
        case 'ping':
            msg.reply('Pong!');
            break;
        case 'marco':
            msg.reply('Polo!');
            break;
        case 'dj':
            handler.doDJStuff(msg);
            break;
        case 'leave':
            handler.leaveChannel(msg);
            break;
        case 'tip':
            handler.addTip(msg, args);
            break;
        case 'tipped':
            handler.viewTips(msg);
            break;
        case 'testError':
            handler.makeError();
            msg.reply("Making error");
            break;
    }
}

// log in to discord
client.login(token).catch((error) => {
  console.log('Error logging in. Shutting down.');
});
