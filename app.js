const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');

const prefix = '/';
const giphyKey = 'BAClUF2ErOH7Fs9Vkt9rk8jnz5GiqT5w';
const emoji_plus = '➕';
const emoji_maybe = '❓';
const emoji_min = '➖';

//client.login(process.env.BOT_TOKEN);//discord Dutch Collective
client.login("NTgyMjU3NTI4NzM4NTQ1NjY0.XOrLoA.Z_4BegP3CVUPEFUa7EGzWfxxTcY");//lokaal testen

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

});

client.on('messageReactionAdd', (reaction, user) => {
	console.log(reaction);
	//console.log(user);
	console.log(reaction._emoji.name);
	//reaction.message.edit('asdfasdfasdf');

    console.log('a reaction has been added');
});
 
client.on('messageReactionRemove', (reaction, user) => {
    console.log('a reaction has been removed');
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
      bierHalen(msg);
      break;
    case 'gif':
      randomGif(msg, args);
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
	
	msg.channel.send("Created by: "+user)
		.then((message) => {
			message.react(emoji_plus);
			message.react(emoji_maybe);
			message.react(emoji_min)
		});

}