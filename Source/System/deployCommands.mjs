import { REST, Routes } from 'discord.js';
import fs  from 'fs';

export async function registerCommands(token, clientId) {
    const rest = new REST({ version: '10' }).setToken(token);
    const jsonFile = fs.readFileSync('./Data/commands.json', 'utf8');
    const jsonData = JSON.parse(jsonFile);
    
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(clientId), { body: jsonData.commands });
    
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}