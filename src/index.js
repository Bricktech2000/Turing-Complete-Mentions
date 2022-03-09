import { exit } from 'process';
import { Client, Intents } from 'discord.js';

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
  runBot(msg);
});

client.on('messageUpdate', (oldMsg, newMsg) => {
  runBot(newMsg);
});

const runBot = async (msg) => {
  if (msg.author.id === client.user.id) return;
  const server = msg.guild;
  const mentions = msg.content.matchAll(/([@?])\`(.*?)\`/g);

  for (var mention of mentions) {
    const doMention = mention[1] == '@'; // @mention or ?search
    const source = mention[2];

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
    await server.members.fetch(); // Github Copilot magic
    await server.roles.fetch();

    for (var item of server.members.cache) {
      const member = item[1];
      const presence = member.presence || {};

      var roles = { length: member._roles.length };
      for (var role of member.roles.cache)
        roles[role[1].name] = member._roles.includes(role[1].id);

      try {
        const includeUser = func(
          server,
          member,
          member.user,
          {
            online: presence.status == 'online',
            idle: presence.status == 'idle',
            dnd: presence.status == 'dnd',
            offline: presence.status == 'offline' || !presence.status, // set to offline if no status is set
          },
          presence.activities,
          roles
        );
        if (includeUser) users.push(member.user);
      } catch (e) {
        sendError(msg, e);
        return;
      }
    }

    console.log(`command: ${source}`);
    console.log(`result:`);

    const characterLimit = 2000;
    var messageContent = '';
    if (users.length == 0) messageContent = 'No users found.';

    for (var user of users) {
      var currMessageContent = '';
      if (doMention) currMessageContent = `<@${user.id}> `;
      else currMessageContent = `@${user.username} `;

      if (messageContent.length + currMessageContent.length > characterLimit) {
        console.log(messageContent);
        msg.reply(messageContent);
        messageContent = '';
      }

      messageContent += currMessageContent;
    }

    console.log(messageContent);
    msg.reply(messageContent);

    break; // ignore all other mentions
  }
};

client.login(discordBotToken);
