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
    'primo_danno',
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

  const commandSplit = commandName.split(' ')[0];

  // If the command is known, let's execute it
  if (commandSplit == '!boss') {
    var nameBoss = commandName.split(' ')[1];
    const num = checkBoss(nameBoss);
    client.say(target, num);
  } else if(commandSplit == "!command") {
    client.say(target, '!boss <name-boss> or <name-map>');
  }
}

// Function called when the "dice" command is issued
function checkBoss (name) {
  var returnString = "";
  var arrayCreated = [];
    for (let index = 0; index < arrayInfo.maps.length; index++) {
        const elements = arrayInfo.maps[index];
        const maplower = elements.name.toLowerCase();

        if (!maplower.includes(name)) {
          
          

          for (let index = 0; index < elements.bosses.length; index++) {
            const bosses = elements.bosses[index];
            var bossLower = bosses.name.toLowerCase();
            name = name.toLowerCase();

            if (bossLower.includes(name)) {
                
                var mapsArray = [];
                const spawnLoc = [];
                const spawnPercent = (bosses.spawnChance * 100) + '%';

                //console.log(elements)

                mapsArray.push(elements.name)

                for (let index = 0; index < bosses.spawnLocations.length; index++) {
                    spawnLoc.push(bosses.spawnLocations[index].name);
                    
                }
                arrayCreated.push('map: ' + elements.name + ', chance to spawn: '+ spawnPercent + ', spawn locations: '+ spawnLoc.join()+', ');

                returnString = bosses.name +' - '+ arrayCreated.join()
            }
          }
        } else {
          var infoPush = [];
          for (let index = 0; index < elements.bosses.length; index++) {
            const bosses = elements.bosses[index];

            const spawnPercent = (bosses.spawnChance * 100) + '%'

            const spawnLoc = [];
            for (let index = 0; index < bosses.spawnLocations.length; index++) {
                spawnLoc.push(bosses.spawnLocations[index].name);
                
            }

            infoPush.push(bosses.name+ ' spawnChance: '+ spawnPercent + ',  spawnLocations: '+ spawnLoc.join())
            
          }
          returnString = infoPush.join();
        }
    }

    return returnString;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {  

    const query = gql`
    {
        maps(lang:en){name,bosses{name,spawnTime,spawnChance,escorts{name},spawnTrigger,spawnTimeRandom,spawnLocations{name,chance}}}
    }
    `

    request('https://api.tarkov.dev/graphql', query)
        .then((data) => arrayInfo = data)
}