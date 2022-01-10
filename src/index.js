const { exit } = require('process');
const { Client, Intents } = require('discord.js');

if (process.argv.length != 3) {
  console.log('Usage: node . DISCORD_BOT_TOKEN');
  exit(1);
}

const discordBotToken = process.argv[2];
console.log('Using Discord bot token: ' + discordBotToken);

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.on('ready', () => {
  console.log('Ready.');
});

const sendError = (msg, e) => msg.channel.send(`**${e.name}**: ${e.message}`);

client.on('messageCreate', async (msg) => {
  if (msg.author.id === client.user.id) return;
  const server = msg.guild;
  const mentions = msg.content.matchAll(/@\`(.*?)\`/g);

  for (const mention of mentions) {
    const source = mention[1];

    var func;
    try {
      func = new Function(
        ['server', 'member', 'user', 'status', 'activities', 'roles'],
        'return ' + source
      );
    } catch (e) {
      sendError(msg, e);
      return;
    }

    const users = [];
    for (item of server.members.cache) {
      const member = item[1];
      const presence = member.presence || {};

      try {
        const includeUser = func(
          server,
          member,
          member.user,
          {
            online: presence.status == 'online',
            idle: presence.status == 'idle',
            dnd: presence.status == 'dnd',
            offline: presence.status == 'offline',
          },
          presence.activities,
          member._roles
        );
        if (includeUser) users.push(member.user);
      } catch (e) {
        sendError(msg, e);
        return;
      }
    }
    const batchSize = 50;
    for (var batch = 0; batch < users.length; batch += batchSize) {
      var messageContent = '';
      for (var offset = 0; offset < batchSize; offset++) {
        const index = batch + offset;
        if (index < users.length) messageContent += `<@${users[index].id}> `;
      }
      console.log(messageContent);
      msg.reply(messageContent);
    }

    break; // ignore all other mentions
  }
});

client.login(discordBotToken);
