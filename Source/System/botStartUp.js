const { Player } = require('discord-player');
const { Client, GatewayIntentBits } = require('discord.js');
const { registerCommand } = require("./commandBuild.js")
const { registerEvent } = require("./events.js")

module.exports = {
    startUp(){
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates
            ]
        });
        
        client.player = new Player(client, {
            ytdlOptions: {
                filter: 'audioonly',
                highWaterMark: 1 << 30,
                dlChunkSize: 0,
            }    
        });

        registerCommand(client);
        registerEvent(client);

        client.login(process.env.DISCORD_BOT_TOKEN);
    }
}