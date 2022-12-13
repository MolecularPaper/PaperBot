import { Client, GatewayIntentBits } from 'discord.js';
import { registerCommands } from './deployCommands.mjs';
import { GenerateMoudle } from './moudleGenerator.mjs';

export function startUp(){
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
            await moudle.excute(interaction, client);
        });
    });
    
    client.login(process.env.DISCORD_BOT_TOKEN);
}