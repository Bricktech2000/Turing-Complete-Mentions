const { exit } = require('process');
const { Client, Intents } = require('discord.js');

if (process.argv.length != 3) {
  console.log('Usage: node . DISCORD_BOT_TOKEN');
  exit(1);
}

const discordBotToken = process.argv[2];
console.log('Using Discord bot token: ' + discordBotToken);

// https://stackoverflow.com/questions/64559390/none-of-my-discord-js-guildmember-events-are-emitting-my-user-caches-are-basica
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

// https://github.com/Rapptz/discord.py/issues/2336
// https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
// client.setMaxListeners(0);

client.on('ready', () => {
  console.log('Ready.');
});

client.on('rateLimit', (info) => {
  console.log(
    `Rate limit hit ${
      info.timeDifference
        ? info.timeDifference
        : info.timeout
        ? info.timeout
        : 'Unknown timeout '
    }`
  );
});

client.on('messageCreate', async (msg) => {
  // https://stackoverflow.com/questions/49663283/how-to-detect-if-the-author-of-a-message-was-a-discord-bot/49667223#:~:text=If%20you%20want%20to%20check%20if%20the%20message%20author%20is,going%20if%20its%20another%20bot.
  if (msg.author.id === client.user.id) return;

  // https://stackoverflow.com/questions/432493/how-do-you-access-the-matched-groups-in-a-javascript-regular-expression
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  const mentions = msg.content.matchAll(/@\`(.*?)\`/g);

  for (const mention of mentions) {
    const source = mention[1];
    // https://javascript.info/new-function
    const sendError = (msg, e) =>
      msg.channel.send(`**${e.name}**: ${e.message}`);
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

    // https://stackoverflow.com/questions/50319939/how-to-list-all-members-from-a-specific-server
    // https://stackoverflow.com/questions/48273185/discord-js-guild-id-is-undefined-even-though-definition-is-there
    // https://stackoverflow.com/questions/53241954/client-guilds-get-not-working-as-intended
    const server = msg.guild;

    const users = [];
    for (item of server.members.cache) {
      const member = item[1];
      const presence = member.presence || {};
      // console.log('server', server);
      // console.log('member', member);
      // console.log('user', member.user);

      // https://stackoverflow.com/questions/61914382/how-can-i-check-if-a-person-has-went-online-offline-etc-in-discord-js
      var includeUser;
      try {
        includeUser = func(
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
      } catch (e) {
        sendError(msg, e);
        return;
      }

      if (includeUser) users.push(member.user);
    }
    const batchSize = 50;
    for (var batch = 0; batch < users.length; batch += batchSize) {
      var messageContent = '';
      for (var offset = 0; offset < batchSize; offset++) {
        const index = batch + offset;
        if (index < users.length) messageContent += `<@${users[index].id}>`;
      }
      // https://stackoverflow.com/questions/58749366/how-do-i-mention-a-role-with-discord-js
      console.log(messageContent);
      msg.reply(messageContent);
    }

    break; // ignore all other mentions
  }
});

client.login(discordBotToken);
