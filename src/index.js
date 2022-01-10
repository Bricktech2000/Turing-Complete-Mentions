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
        ['server', 'member', 'user', 'status', 'activity', 'roles'],
        'return ' + source
      );
    } catch (e) {
      sendError(msg, e);
      return;
    }
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // https://stackoverflow.com/questions/50319939/how-to-list-all-members-from-a-specific-server
    // https://stackoverflow.com/questions/48273185/discord-js-guild-id-is-undefined-even-though-definition-is-there
    // https://stackoverflow.com/questions/53241954/client-guilds-get-not-working-as-intended
    const server = msg.guild;
    // console.log('server', server);
    // https://stackoverflow.com/questions/58325771/how-to-generate-random-hex-string-in-javascript
    // const genRanHex = (size) =>
    //   [...Array(size)]
    //     .map(() => Math.floor(Math.random() * 16).toString(16))
    //     .join('');

    // const roleName = genRanHex(32);
    // console.log('roleName', roleName);

    // https://stackoverflow.com/questions/53329343/how-to-create-a-role-with-discord-js
    // https://discord.js.org/#/docs/main/stable/class/RoleManager?scrollTo=create
    // await server.roles.create({
    //   name: roleName,
    //   color: 'DEFAULT',
    //   reason: 'Turing Complete Mentions',
    // });

    // https://stackoverflow.com/questions/57335046/discord-js-how-to-add-role-to-a-specific-user-id
    // https://www.codegrepper.com/code-examples/javascript/discord.js+find+role+by+name
    // https://stackoverflow.com/questions/50730747/discord-js-checking-bot-permissions
    // if (!msg.guild.me.permissions.has('MANAGE_ROLES'))
    //   throw 'Error - bot does not have permission to manage roles.';

    // console.log('server mem', Object.keys(server.members.cache));
    // console.log('server mem', server.members.cache);
    // members = [];
    // server.members.cache.forEach((member) => {
    //   members.push(member.user.username);
    // });
    // console.log('members', members.length);

    // msg.channel.send(`Debug: Evaluating Mentions`);
    // https://github.com/discordjs/discord.js/issues/4930
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

      if (includeUser) {
        // if (!member.roles.cache.has(MENTION.id)) {
        // console.log('ADD', member.user.username);
        users.push(member.user);
        // }
      } else {
        // if (member.roles.cache.has(MENTION.id)) {
        // console.log('REMOVE', member.user.username);
        // users.push(member.user);
        // }
      }
      // await sleep(rateLimitDelay); // prevent rate limit
      // await sleep(100); // prevent rate limit
      // users.push(JSON.stringify(member.user));
      // if (func(user)) users.push(user);
    }
    // msg.channel.send('Debug: Waiting for Promises');
    // await sleep(5000);
    // await Promise.all(promises);
    const batchSize = 50;
    for (var batch = 0; batch < users.length; batch += batchSize) {
      var messageContent = '';
      for (var offset = 0; offset < batchSize; offset++) {
        const index = batch + offset;
        if (index < users.length) messageContent += `<@${users[index].id}>`;
      }
      // https://stackoverflow.com/questions/58749366/how-do-i-mention-a-role-with-discord-js
      // https://stackoverflow.com/questions/45395255/discord-js-delete-single-message
      // const message = await msg.channel.send('Debug: Simulating Mention');
      // const message = await msg.channel.send(`<@&${MENTION.id}>`);
      console.log(messageContent);
      msg.reply(messageContent);
      // const message = await msg.channel.send(messageContent);
      // @`presence.online && user.username.startsWith('A')`
      // await sleep(100);
      // message.delete();
    }

    break; // ignore all other mentions
  }
});

client.login(discordBotToken);
