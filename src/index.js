const { exit } = require('process');
const {
  Client,
  Intents,
  MessageEmbed,
  CommandInteractionOptionResolver,
} = require('discord.js');

if (process.argv.length != 3) {
  console.log('Usage: node . DISCORD_BOT_TOKEN');
  exit(1);
}

const discordBotToken = process.argv[2];
console.log('Using Discord bot token: ' + discordBotToken);

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
  console.log('Ready.');
});

client.on('messageCreate', async (msg) => {
  const reply = await getReplyFromMessage(msg);
  if (reply !== undefined) msg.channel.send(reply);
});

client.login(discordBotToken);

const getReplyFromMessage = async (msg) => {
  const isMentioned = msg.mentions.members.first()?.id == client.user.id;
  if (isMentioned) return 'message registered.';
  else return undefined;
  // const code = msg.content.match(/.*?\b@\`.*?\`.*?/);
  // console.log(code);
};
