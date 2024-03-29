const { Player } = require('discord-player');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { registerCommand } = require("./commandBuild.js")
const { registerEvent } = require("./botEvents.js")
const { registerPlayerEvent } = require('./botPlayerEvent.js');

module.exports = {
    startUp(){
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
            ],
            partials:[
                Partials.Channel
            ]
        });
        
        client.player = new Player(client, {
            leaveOnEnd: false,
            ytdlOptions: {
                filter: 'audioonly',
                highWaterMark: 1 << 30,
                dlChunkSize: 0,
            }    
        });

        registerCommand(client);
        registerEvent(client);
        registerPlayerEvent(client.player);

        client.login(process.env.DISCORD_BOT_TOKEN);
    }
}