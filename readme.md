### Discord DJ Bot ###
This DJ Bot will stream audio from your local microphone input to your voice channel in Discord! Only supported on Windows.
### Setup ###
## 1. First, you'll need to install node.js. The download link can be found here:
https://nodejs.org/en/
## 2. Next, you'll need sox, a sound processing utility. This will allow the application to record your audio input.
https://sourceforge.net/projects/sox/files/latest/download 
(This link will start the download automatically, click only when you're ready to download)
## 3. Clone / download the repo.
You can either download the .zip or use git clone
## 4. Install dependencies
When you download the code, run install-dependencies.bat. This will install the modules needed to run the bot.
## 5. Set up the Bot.
Go to https://discord.com/developers/applications and log in if you aren't already.
Click on 'New Application', enter the name of your bot and click Create.
On the sidebar, click 'Bot', then click Add Bot.
Scroll down to permissions, and add:
  Send Messages
  Connect
  Speak
## 6. Add the Bot's token to the config.
On the Bot page in the developer portal, click Copy under Token. DO NOT SHARE OR PUBLISH THIS, IT'S A PRIVATE IDENTIFIER.
Go into config.json, and insert the token where it says 'my_token'.

After following these steps you should be done with the setup!


WIP

### Running the Bot ###
Simply run bot.bat and the bot will be running.
