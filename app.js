const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');

const prefix = '/';
const giphyKey = 'BAClUF2ErOH7Fs9Vkt9rk8jnz5GiqT5w';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

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

  switch(command){
    case 'bierhalen':
      bierHalen(msg);
    break;
    case 'gif':
      randomGif(msg,args);
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

client.login(process.env.BOT_TOKEN);//discord Dutch Collective
//client.login("NTcwMTcwODU2NTU1NDEzNTE1.XOp7XQ.gQPNjEVWMqGvI_akML2TKACt99Q");//lokaal testen

function bierHalen(msg){
  // Get members & remove bots
  let members = Array.from(msg.member.guild.members);
  members = members.filter(function(user) {
    return !user[1].user.bot;
  });

  // Send dm to the lucky one.
  const chosenUser = members[Math.floor(Math.random() * members.length)];
  client.users
    .get(chosenUser[0])
    .send('BIER HALEN!')
    .then(function() {
      console.log('Send!');
    });

  // Reply to msg
  msg.reply(chosenUser[1].user.username + ' is de lul!');
}

function randomGif(msg, searchParams){
   // Set search query if we have a argument.
   let searchQuery = '';
   if (searchParams[2]) {
     searchQuery = '&tag=' + args[2];
   }
   axios
     .get(
       'http://api.giphy.com/v1/gifs/random?api_key=' +
         giphyKey +
         '&limit=1' +
         searchQuery
     )
     .then(resp => {
       msg.reply(resp.data.data.embed_url);
     })
     // Catch error
     .catch(error => {
       console.log(error);
     });
}