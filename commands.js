const mic = require('mic6');

var CommandHandler = function(client){
  this.client = client;
}

CommandHandler.prototype.doDJStuff = function(msg){
  let vc = getAuthorConnection(msg);

  if (vc === undefined){
    msg.reply('You aren\'t in a voice channel.');
    return;
  }

  // setup mic recording
  let micInstance = mic({
      rate: '44000',
      channels: '1',
      debug: false,
      exitOnSilence: 1000
  });

  // set up mic input stream
  let micInputStream = micInstance.getAudioStream();

  // join channel, play music
  vc.join().then(connection => {
      micInstance.start();
      const dispatcher = connection.play(micInputStream);


      micInputStream.on('silence', function() {
        console.log('Silent for too long. Leaving channel.');
        micInstance.stop();
        leaveChannel(msg);
      });

      micInputStream.on('error', function(error) {
        msg.reply('Error capturing audio.');
        micInstance.stop();
      })

  }).catch(err => {
    console.error(err);
    msg.reply('Error while trying to join voice channel.');
    throw err;
  });
}

CommandHandler.prototype.leaveChannel = function(msg){
  // get any connections that the bot is in
  // get the connection the author is in
  let authorvc = getAuthorConnection(msg);
  let connections = this.client.voice.connections;

  if (connections.length === 0){
    msg.reply('I am not in any voice channels.');
    return;
  }

  if (authorvc === undefined){
    msg.reply('You aren\'t in a voice channel');
    return;
  }
  // if there's no connections dont do anything
  let vcs = connections.values();
  let botvc;

  for(let vc of vcs){
    if (vc.channel.id === authorvc.id) botvc = vc;
  }



  // if there is a connection, then we wanna try to leave it
  if (botvc === undefined){
    msg.reply('You must be in the same voice channel as me to use this command.');
    return;
  }

  // if it works, we're good
  try {
    msg.reply('Leaving voice channel.');
    botvc.disconnect();
  } catch (error){
    console.error(error);
  }
  // otherwise error

}

// storing tips for the current session
var tips = 0;

CommandHandler.prototype.addTip = function(msg, args){

  let usage = function(){
    msg.reply('Please specify an amount (0 - 100)');
  }
  if (args.length === 0 || args.length > 1){
    usage();
    return;
  } else if (isNaN(args[0])) {
    usage();
    return;
  }

  let amt = args[0];
  if (amt < 0 || amt > 100){
    usage();
    return;
  }
  tips += parseFloat(amt).toFixed(2);
  msg.reply(`Tipped $${amt}!`)
}

CommandHandler.prototype.viewTips = function(msg){
  msg.reply(`Tips for current session: $${tips}`);
}

function getAuthorConnection(msg){

  let authorID = msg.author.id;
  let guild = msg.guild;
  let cache = guild.channels.cache

  // get voice channels of server
  let getVoiceChannels = function(channels){
      return channels.partition(channel => channel.type === 'voice')[0];
  }

  // get members in voice channels of server
  // kinda inefficient, how to improve?
  let getVoiceMembers = function(channels){
      let membersInChannel = new Map();
      channels.each(channel => {
          if (channel.members.keyArray().length > 0){
              channel.members.each((member) => {
                  membersInChannel.set(member.id, channel.id);
              });
          }
      });
      return membersInChannel;
  }

  // find if author is in a voice channel
  let authorVoiceChannelID = getVoiceMembers(
      getVoiceChannels(cache))
      .get(authorID);

  // get voice channel of author
  return cache.get(authorVoiceChannelID);
}

module.exports = CommandHandler;
