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

const sendError = (msg, e) => msg.reply(`**${e.name}**: ${e.message}`);
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
process.on('unhandledRejection', () => {}); // ignore all promise rejections

client.on('messageCreate', async (msg) => {
  runBot(msg);
});

client.on('messageUpdate', (oldMsg, newMsg) => {
  runBot(newMsg);
});

const runBot = async (msg) => {
  if (msg.author.id === client.user.id) return;
  const guild = msg.guild;
  const mentions = msg.content.matchAll(/([@?])`(.*?)`/g);

  for (let mention of mentions) {
    const doMention = mention[1] == '@'; // @mention or ?search
    const source = mention[2];

    console.log(`command: ${source}`);
    console.log(`result:`);

    let func;
    try {
      func = new AsyncFunction(
        ['guild', 'member', 'user', 'status', 'activities', 'roles'],
        'return ' + source
      );
    } catch (e) {
      sendError(msg, e);
      console.log(e.name, e.message);
      return;
    }

    const users = [];
    await guild.members.fetch(); // GitHub Copilot magic
    await guild.roles.fetch();

    for (let item of guild.members.cache) {
      const member = item[1];
      const presence = member.presence || {};

      let roles = { length: member._roles.length };
      for (let role of member.roles.cache)
        if (role[1].name !== '@everyone')
          roles[role[1].name] = member._roles.includes(role[1].id);

      try {
        const includeUser = await func(
          guild,
          member,
          member.user,
          {
            online: presence.status === 'online',
            desktop: presence.clientStatus?.desktop === 'online',
            mobile: presence.clientStatus?.mobile === 'online',
            idle: presence.status === 'idle',
            dnd: presence.status === 'dnd',
            offline: presence.status === 'offline' || !presence.status, // set to offline if no status is set
          },
          presence.activities,
          roles
        );
        if (includeUser) users.push(member.user);
      } catch (e) {
        sendError(msg, e);
        console.log(e.name, e.message);
        return;
      }
    }

    const characterLimit = 2000;
    let messageContent = '';

    const member = await guild.members.fetch(msg.author.id);
    if (doMention && !member.permissions.has('MENTION_EVERYONE')) {
      const nonEmptySource = source || '\u200b'; // zero-width space
      sendError(msg, {
        name: 'PermissionError',
        message: `You do not have permission to mention members through \`\`@\`${nonEmptySource}\` \`\`. You can still search through members using \`\`?\`${nonEmptySource}\` \`\`.`,
      });
      continue;
    }
    if (users.length == 0) {
      sendError(msg, {
        name: 'NoResultsError',
        message: `No results found`,
      });
      continue;
    }

    for (let user of users) {
      let currMessageContent = '';
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
