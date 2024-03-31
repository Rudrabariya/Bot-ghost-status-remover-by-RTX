const { Client, GatewayIntentBits, ActivityType, TextChannel } = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
const client1 = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});
const client2 = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('YaY Your Bot Status Changed✨');
});
app.listen(port, () => {
  console.log(`🔗 Listening to RTX: http://localhost:${port}`);
  console.log(`🔗 Powered By RTX`);
});

const statusMessages = [
  ["Watching Our Lovely Customers!", "Best and Cheap Products"], // Status messages for client1
  ["Taking Care of our Passengers", "Fly with FlyGlobal"]    // Status messages for client2
];

let currentIndex1 = 0;
let currentIndex2 = 0;
const channelId = ''; // Fill in the appropriate channel ID

async function login(tokens) {
  try {
    await client1.login(tokens[0]);
    await client2.login(tokens[1]);
    console.log(`\x1b[36m%s\x1b[0m`, `|    🐇 Logged in as ${client1.user.tag}`);
    console.log(`\x1b[36m%s\x1b[0m`, `|    🐇 Logged in as ${client2.user.tag}`);
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

function updateStatusAndSendMessages(client) {
  let currentIndex;
  let statusMessagesForClient;

  if (client === client1) {
    currentIndex = currentIndex1;
    statusMessagesForClient = statusMessages[0];
  } else if (client === client2) {
    currentIndex = currentIndex2;
    statusMessagesForClient = statusMessages[1];
  } else {
    // Handle unknown client
    return;
  }

  const currentStatus = statusMessagesForClient[currentIndex];
  client.user.setPresence({
    activities: [{ name: currentStatus, type: ActivityType.Custom}],
    status: 'dnd',
  });
  
  const textChannel = client.channels.cache.get(channelId);

  if (textChannel instanceof TextChannel) {
    textChannel.send(`Bot status is: ${currentStatus}`);
  }

  if (client === client1) {
    currentIndex1 = (currentIndex1 + 1) % statusMessagesForClient.length;
  } else if (client === client2) {
    currentIndex2 = (currentIndex2 + 1) % statusMessagesForClient.length;
  }
}

client1.once('ready', () => {
  console.log(`\x1b[36m%s\x1b[0m`, `|    ✅ Bot 1 is ready as ${client1.user.tag}`);
  updateStatusAndSendMessages(client1);

  setInterval(() => {
    updateStatusAndSendMessages(client1);
  }, 5000);
});

client2.once('ready', () => {
  console.log(`\x1b[36m%s\x1b[0m`, `|    ✅ Bot 2 is ready as ${client2.user.tag}`);
  updateStatusAndSendMessages(client2);

  setInterval(() => {
    updateStatusAndSendMessages(client2);
  }, 5000);
});

login(['MTIwODc5MDExNzQ5NDU1NDY0NA.GOnP0C.KV1l8_yZja2qagF8du1ZrjtTSki2QIKQktqpqs', 'MTE4NzkwMzM5ODA3MTI1MTA0NA.GNUwD0.xUqE1ziUFIfk6paPUz7P7FAFNo_NSWMdUdsR5g']);
