import { Client, GatewayIntentBits } from 'discord.js';
import { registerCommands } from './Source/System/deployCommands.mjs';
import { GenerateMoudle } from './Source/System/moudleGenerator.mjs';
import { config } from 'dotenv';

config({path: './Data/config.env'});
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildVoiceStates
    ]
});
const moudles = GenerateMoudle(client);

registerCommands(process.env.DISCORD_BOT_TOKEN, process.env.DISCORD_BOT_CLIENT_ID);

client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`); });
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    moudles.forEach(async moudle => {
        try{
            await moudle.excute(interaction, client);
        }
        catch (error){
            console.log(error);
        }
    });
});

client.login(process.env.DISCORD_BOT_TOKEN);