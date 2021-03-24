// docs for mic library: https://www.npmjs.com/package/mic6
// TODO: rewrite this whole damn file lmaoo
const mic = require('mic6');

let tips = 0;

exports.doDJStuff = function(msg){
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
        exports.leaveChannel(msg);
      });

      micInputStream.on('error', function(error) {
        msg.reply('Error capturing audio.');
        micInstance.stop();
        exports.leaveChannel(msg);
      })

  }).catch(err => {
    msg.reply('Error while trying to join voice channel.');
    exports.leaveChannel(msg);
  });
}

exports.leaveChannel = function(msg){

  // get voice channel of author
  let authorvc = getAuthorConnection(msg);

  if (authorvc === undefined){
    msg.reply('You aren\'t in a voice channel');
    return;
  }

  // find if bot is in the same voice channel as author
  let botvc = getMatchingBotConnection(authorvc, msg);

  if (botvc === undefined) return;

  if (botvc === ''){
    msg.reply('You must be in the same voice channel as me to use this command.');
    return;
  }

  // leave channel
  try {
    msg.reply('Leaving voice channel.');
    botvc.disconnect();
  } catch (error){
    console.error(error);
  }
}

exports.addTip = function(msg, args){

  let usage = function(){
    msg.reply('Please specify an amount (0 - 100)');
  }
  if (args.length === 0 || args.length > 1){
    usage();
    return;
  } else if (args[0].startsWith('$')){
      args[0] = args[0].slice(1);
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

exports.viewTips = function(msg){
  msg.reply(`Tips for current session: $${this.tips}`);
}

exports.makeError = function(){
  return asdf(1234);
}

let getMatchingBotConnection = function(author, msg){
  // get voice channel of bot
  let connections = client.voice.connections;

  if (connections.length === 0){
    msg.reply('I am not in any voice channels.');
    return;
  }
  // if there's no connections dont do anything
  let vcs = connections.values();
  let botvc = '';

  for(let vc of vcs){
    if (vc.channel.id === authorvc.id) botvc = vc;
  }
}
let getAuthorConnection = function(msg){

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
