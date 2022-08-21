import 'dotenv/config'

import tmi from 'tmi.js'
import { request, gql } from 'graphql-request'


// Define configuration options
const opts = {
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [
    'primo_danno'
  ],
  connection: {
    reconnect: true
  }
};

// Create a client with our options
const client = new tmi.client(opts);

var arrayInfo;



// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {

  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName.includes("!boss")) {
    var nameBoss = commandName.split(' ')[1];
    const num = checkBoss(nameBoss);
    client.say(target, num);
  } else {

  }
}

// Function called when the "dice" command is issued
function checkBoss (name) {

    for (let index = 0; index < arrayInfo.maps.length; index++) {
        const element = arrayInfo.maps[index];
       

        for (let index = 0; index < element.bosses.length; index++) {
            const bosses = element.bosses[index];
            var bossLower = bosses.name.toLowerCase();
            name = name.toLowerCase();

            if (bossLower.includes(name)) {
                var nameMaps = element.name;
                const spawnLoc = [];
                for (let index = 0; index < bosses.spawnLocations.length; index++) {
                    spawnLoc.push(bosses.spawnLocations[index].name);
                    
                }
                return bosses.name + ' spawn maps: ' + nameMaps + ', spawnChance: '+ bosses.spawnChance + ' spawnLocations: '+ spawnLoc.join();
            }
            
        }
        
    }

    return ''
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  

    const query = gql`
    {
        maps(lang:en){name,bosses{name,spawnTime,spawnChance,escorts{name},spawnTrigger,spawnTimeRandom,spawnLocations{name,chance}}}
    }
    `

    request('https://api.tarkov.dev/graphql', query)
        .then((data) => arrayInfo = data)
}