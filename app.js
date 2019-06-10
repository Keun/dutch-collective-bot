const Discord = require('discord.js');
const client = new Discord.Client({ 
  messageCacheMaxSize:50000,
  autofetch: [
  'MESSAGE_CREATE',
  'MESSAGE_UPDATE',
  'MESSAGE_REACTION_ADD',
  'MESSAGE_REACTION_REMOVE',
] });
const axios = require('axios');

const prefix = '/';
const giphyKey = 'BAClUF2ErOH7Fs9Vkt9rk8jnz5GiqT5w';
const emoji_plus = '➕';
const emoji_maybe = '❓';
const emoji_min = '➖';
const botName = 'GameGhost';

client.login(process.env.BOT_TOKEN);//discord Dutch Collective

client.on('ready', () => {
  var serverID;
  client.guilds.forEach(server => { 
    serverID = server.id;
  })

  var guildx = client.guilds.find( guilds => guilds.id == serverID);

  guildx.channels.forEach(channel => { 
    if(channel.type == "text"){
      channel.fetchMessages({limit: 100});
    }
  });
  console.log(`Logged in as ${client.user.tag}!`);

});

client.on('messageReactionAdd', (reaction, user) => {
	
	if(user.bot) return;
	// if (reaction.message.author.bot) return;
  //console.log(reaction);
	const userId = user.id;
	const userName = user.username;
  var textMessage = reaction.message.content.split('----');

	if(userName != botName){
    var newMessage = textMessage[0] + '----';
    var countActive = (textMessage[1].match(/<@/g) || []).length;
    //var countBackup = (textMessage[2].match(/<@/g) || []).length;

    if(textMessage[3]){
      var tmpMaxN = textMessage[3].match(/\[(.*?)\]/g);
      if(typeof tmpMaxN == 'object'){
        var maxNumberPlayers = parseInt(tmpMaxN[0].replace(' spelers', '').replace('[', '').replace(']', ''));
      }
    }
    //console.log(reaction.message);
    //client.users.get(userId).send("someMessage");
		switch(reaction._emoji.name){
			case emoji_min:
				tempMessage2 = textMessage[2];
				if (textMessage[2].includes('<@'+userId+'>')) {//if in users BACKUP, then remove
					tempMessage2 = textMessage[2].replace('<@'+userId+'>\n', '');
				}

				tempMessage = textMessage[1];
				if (textMessage[1].includes('<@'+userId+'>')) { //if in users TEAM, then remove
					tempMessage = textMessage[1].replace('<@'+userId+'>\n', '');
				}

				newMessage += tempMessage + '----' + tempMessage2 + '----' + textMessage[3];
				reaction.message.edit(newMessage);
				reaction.remove(user);

			break;
			case emoji_plus:
        if(maxNumberPlayers == countActive && !textMessage[1].includes('<@'+userId+'>')){
          var activityName = textMessage[0].replace('**','').replace(':**',':').split('\n');
          reaction.message.channel.send('<@'+userId+'> --- '+activityName[0]+' *Zit vol!*')
            .then(msg => {
              msg.delete(15000);
            });
          reaction.remove(user);
          return;
        }
				tempMessage = textMessage[2];
				if (textMessage[2].includes('<@'+userId+'>')) { //if user in BACKUP, then remove
					tempMessage = textMessage[2].replace('<@'+userId+'>\n', '');
				}

				if (!textMessage[1].includes('<@'+userId+'>')) {//if user NOT already in TEAM, then add.
					newMessage += textMessage[1] + '<@'+userId+'>\n' + '----' + tempMessage;
				}else{
					newMessage += textMessage[1] + '----' + tempMessage;
				}
        newMessage += '----' + textMessage[3];
				reaction.message.edit(newMessage);
				reaction.remove(user);
			break;
			case emoji_maybe:
				tempMessage = textMessage[1];
				if (textMessage[1].includes('<@'+userId+'>')) {//if user in TEAM, then remove
					tempMessage = textMessage[1].replace('<@'+userId+'>\n', '');
				}

				if (!textMessage[2].includes('<@'+userId+'>')) {//if user NOT already in BACKUP, then add.
					newMessage += tempMessage + '----' + textMessage[2] + '<@'+userId+'>\n';
				}else{
					newMessage += tempMessage + '----' + textMessage[2];
        }
        
        newMessage += '----' + textMessage[3];
				reaction.message.edit(newMessage);
				reaction.remove(user);
			break;
		}
	}
});


// Bier halen functie
client.on('message', msg => {
  // Return if message from another bot
  if (msg.author.bot) return;

  if (msg.content === 'ping') {
    msg.reply(`pong!`);
  }

  // Ignore everything what doesn't have our command prefix
  if (msg.content.indexOf(prefix) !== 0) return;

  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'create':
      createActivity(msg);
      break;
    case 'bierhalen':
        if(msg.member.roles.find(r => r.name === "Admin 2.0") || msg.member.roles.find(r => r.name === "Elites") || msg.member.roles.find(r => r.name === "Bazen")){
          bierHalen(msg);
        }
        break;
    case 'gif':
        if(msg.member.roles.find(r => r.name === "Admin 2.0") || msg.member.roles.find(r => r.name === "Elites") || msg.member.roles.find(r => r.name === "Bazen")){
          randomGif(msg, args);
        }
      break;
    default:
      msg.reply('Dit bestaat echt niet! wat denk je zelf.');
      break;
  }

});


// // Create an event listener for new guild members
// client.on('guildMemberAdd', member => {
//   // Send the message to a designated channel on a server:
//   const channel = member.guild.channels.find(ch => ch.name === 'chat');
//   // Do nothing if the channel wasn't found on this server
//   if (!channel) return;
//   // Send the message, mentioning the member
//   channel.send(`Ewa fakka ${member}?`);
// });

function bierHalen(msg) {
  // Get members & remove bots
  let members = Array.from(msg.member.guild.members);
  members = members.filter(function (user) {
    return !user[1].user.bot;
  });

  // Send dm to the lucky one.
  const chosenUser = members[Math.floor(Math.random() * members.length)];
  client.users
    .get(chosenUser[0])
    .send('BIER HALEN!')
    .then(function () {
      console.log('Send!');
    });
  // Reply to msg
  msg.channel.send('<@'+chosenUser[1].user.id + '> is de lul!');
}

function randomGif(msg, searchParams) {
  // Set search query if we have a argument.
  let searchQuery = '';
  if (searchParams[0]) {
    searchQuery = '&tag=' + searchParams[0];
  }
  var url = 'http://api.giphy.com/v1/gifs/random?api_key=' +
  giphyKey +
  '&limit=1' +
  searchQuery;

  axios
    .get(
      url
    )
    .then(resp => {
      msg.channel.send(resp.data.data.embed_url);
    })
    // Catch error
    .catch(error => {
      console.log(error);
    });
}

function createActivity(msg){

	user = msg.member;
  user = user.toString();
  var error = '';
  //console.log(msg.content);
  var title = msg.content.match(/\[(.*?)\]/g);
  var data = msg.content
  .replace(title, '')
  .trim()
  .split(/ +/g);

  if(data[3]){
    var type = parseInt(data[3].replace('spelers', ''));
    if(isNaN(type)){
      error = "\n `spelers` klopt niet. Dit moet een Getal zijn";
    }
  }
  var dayData = data[1];
  var timeData = data[2];
  

  if(typeof title != undefined && title != null && data.length == 4 && error == ''){
    var title = title[0].replace('[','').replace(']','');
    newMessage = "**Activiteit:** "+title+"\n**Tijd:** "+dayData+" - "+timeData+"\n----\n**Team**:\n"+user+"\n----\n**Back-up**:\n----\n";

    if(type != undefined){
      newMessage += "**Max spelers**:\n["+type+" spelers]";
    }
    msg.channel.send(newMessage)
      .then((message) => {
        message.react(emoji_plus)
          .then(() => {
            message.react(emoji_maybe)
            .then(() => {
              message.react(emoji_min);
            });
          });
      });
  }else{
    var messageError = 'Commando klopt niet, gebruik `/create [Activiteit] dag tijd 3spelers`';
    if(error != ''){
      messageError += error;
    }
    msg.reply(messageError);
  }

}
