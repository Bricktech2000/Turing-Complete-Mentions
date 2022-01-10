const { exit } = require('process');
const { Client, Intents } = require('discord.js');

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
  // const isMentioned = msg.mentions.members.first()?.id == client.user.id;
  // if (isMentioned) return 'message registered.';
  // else return undefined;

  // https://stackoverflow.com/questions/432493/how-do-you-access-the-matched-groups-in-a-javascript-regular-expression
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  const mentions = msg.content.matchAll(/@\`(.*?)\`/g);
  for (const mention of mentions) {
    const source = mention[1];
    // https://javascript.info/new-function
    const func = new Function(['parameter'], 'return ' + source);
    console.log(source);
    console.log(func('parameterValue'));
    if (func('parameterValue')) {
      return `message registered. early return: ${func('parameterValue')}`;
    }
  }
};
