# Turing Complete Mentions

A Discord bot that allows for Turing-Complete mentions

## Overview

This Discord bot allows for mentioning users based on criteria through JavaScript code. Here are some examples:

![](ksnip_20220111-113736.png)
![](ksnip_20220111-113811.png)

## Adding This Bot to Your Server

Adding this bot to your server allows you to get the functionality of this assistant without having to host it yourself.

### Setup

1. Click on the following link: <https://discord.com/api/oauth2/authorize?client_id=930143352370921532&permissions=274877908992&scope=bot>
2. Select the server you would like to add the bot to
3. Click on _Authorize_

## Hosting This Bot Yourself

Hosting this bot yourself is more involving, but allows you to customize it entirely.

### Requirements

- NodeJS 16.6+

### Setup

#### Create a Discord Bot

1.  Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2.  Click on _New Application_
3.  Create an application called _Turing Complete Mentions_
4.  Go to the _Bot_ tab
5.  Click on _Add a Bot_
6.  Change the bot profile picture
7.  Turn on both `PRESENCE INTENT` and `GUILD_MESSAGE_REACTIONS` permissions
8.  Copy the `Bot Token`, this will be used later

#### Host the bot

1.  Clone this repository
2.  Install the necessary packages: `npm install`
3.  Run the program by passing the Discord Bot Token through command line parameters: `cd src/` `node . DISCORD_BOT_TOKEN`

### Sharing

Below are the steps to get an invite link for your bot.

1. Navigate to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Head to the _OAuth2_ tab
3. Select _bot_ under _OAuth2 URL Generator_
4. Check following permissions:
   - Send Messages
   - Send Messages in Threads
5. Copy the generated invite link.

## Usage

### Syntax

To mention users, use the following syntax anywhere within a message:

```JavaScript
@`JAVASCRIPT_CODE`
```

To look for users without mentioning them, use the following syntax anywhere within a message:

```JavaScript
?`JAVASCRIPT_CODE`
```

### Argument Structure

`JAVASCRIPT_CODE` is a string of JavaScript code that will be evaluated once for every user. if `JAVASCRIPT_CODE` returns `true`, the user is included in the mention list. The code is wrapped in the following function internally:

```JavaScript
function(guild, member, user, status, activities, roles) {
   return JAVASCRIPT_CODE;
}
```

Below is an example set of arguments that are passed to the function. They are a close mirror of the data from the Discord API.

```JavaScript
guild: {
  id: '929037595046969395',
  name: 'ITI1100 A/B',
  icon: '85cdc3e61d24f0b3e1ddded5e05870ac',
  features: [ 'NEWS', 'COMMUNITY' ],
  ownerId: '362627068430909450',

  available: true,
  shardId: 0,
  splash: null,
  banner: null,
  description: null,
  verificationLevel: 'MEDIUM',
  vanityURLCode: null,
  nsfwLevel: 'DEFAULT',
  discoverySplash: null,
  memberCount: 330,
  large: true,
  premiumProgressBarEnabled: false,
  applicationId: null,
  afkTimeout: 300,
  afkChannelId: null,
  systemChannelId: '929039974643400724',
  premiumTier: 'NONE',
  premiumSubscriptionCount: 0,
  explicitContentFilter: 'ALL_MEMBERS',
  mfaLevel: 'NONE',
  joinedTimestamp: 1641833939864,
  defaultMessageNotifications: 'ALL_MESSAGES',
  systemChannelFlags: /* ... */,
  maximumMembers: 500000,
  maximumPresences: null,
  approximateMemberCount: null,
  approximatePresenceCount: null,
  vanityURLUses: null,
  rulesChannelId: '929039801657733120',
  publicUpdatesChannelId: '929039759890858114',
  preferredLocale: 'en-US',
  members: /* ... */,
  channels: /* ... */,
  bans: /* ... */,
  roles: /* ... */,
  presences: /* ... */,
  voiceStates: /* ... */,
  stageInstances: /* ... */,
  invites: /* ... */,
  scheduledEvents: /* ... */,
},

member: {
  joinedTimestamp: 1641595165880,
  premiumSinceTimestamp: null,
  nickname: null,
  pending: false,
  communicationDisabledUntilTimestamp: null,
  // _roles: [ '929039239746846731' ],
},
user: {
  id: '792482454228566016',
  bot: false,
  system: false,
  flags: null,
  username: 'kiSt09JqLD',
  discriminator: '1753',
  avatar: null,
  banner: undefined,
  accentColor: undefined
},
status: {
  online: true,
  desktop: true,
  mobile: false
  idle: false,
  dnd: false,
  offline: false
},
activities: [
  {
    id: 'custom',
    name: 'Custom Status',
    type: 'CUSTOM',
    url: null,
    details: null,
    state: 'ℂx  ≡  x = a ⋅ b ⌊∘1⌋ ∧ ℝa ∧ ℝb',
    applicationId: null,
    timestamps: null,
    syncId: null,
    platform: null,
    party: null,
    assets: null,
    flags: /* ... */,
    emoji: null,
    sessionId: null,
    buttons: [],
    createdTimestamp: 1655207890380
  },
  {
    id: '6a4cfe053e472af3',
    name: 'Visual Studio Code',
    type: 'PLAYING',
    url: null,
    details: 'Working on Turing Complete Mentions',
    state: '✏️ src/index.js',
    applicationId: '383226320970055681',
    timestamps: null,
    syncId: null,
    platform: null,
    party: null,
    assets: /* ... */,
    flags: /* ... */,
    emoji: null,
    sessionId: null,
    buttons: [],
    createdTimestamp: 1655208208492
  }
],
roles: {
   'mod': true,
   // ...
   length: 2,
},
```
