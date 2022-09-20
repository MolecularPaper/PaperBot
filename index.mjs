import { Client, GatewayIntentBits } from 'discord.js';
import { registerCommands } from './Source/System/deployCommands.mjs';
import { moudels } from './Source/System/moudleGenerator.mjs';
import { config } from 'dotenv';

config({path: './config.env'});
const client = new Client({intents: [GatewayIntentBits.Guilds]});

registerCommands(process.env.DISCORD_BOT_TOKEN, process.env.DISCORD_BOT_CLIENT_ID);

client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`); });
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    moudels.forEach(async moudle => {
        try{
            await moudle.excute(interaction, client);
        }
        catch (error){
            console.log(error);
        }
    });
});

client.login(process.env.DISCORD_BOT_TOKEN);