const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('discord-ytdl-core');
var mic = require('mic6');
var fs = require('fs');
// bad, put this in a file doofus
const token = 'token';

const prefix = '$'

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.startsWith(prefix)) {
        handle(msg, msg.content.slice(1, msg.content.length));
    }
});

function handle(msg, command){
    switch(command){
        case 'ping':
            msg.reply('Pong!');
            break;
        case 'marco':
            msg.reply('Polo!');
        case 'dj':
            doDJStuff(msg);
    }
}

function doDJStuff(msg){
    let authorID = msg.author.id;
    let guild = msg.guild;
    
    let getVoiceChannels = function(channels){
        return channels.partition(channel => channel.type === 'voice')[0];
    }
    
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

    let authorVoiceChannelID = getVoiceMembers(getVoiceChannels(guild.channels.cache)).get(authorID);
    
    let vc = guild.channels.cache.get(authorVoiceChannelID);
    
    let micInstance = mic({
        rate: '44000',
        channels: '1',
        debug: true,
        exitOnSilence: 10
    });
    
    let micInputStream = micInstance.getAudioStream();
  
    vc.join().then(connection => {
        micInstance.start();
        const dispatcher = connection.play(micInputStream);
        
    }).catch(err => console.log(err));
}




client.login(token);