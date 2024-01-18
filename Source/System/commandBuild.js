const { REST, Routes, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { onMessageCallbacks } = require('./botEvents');

function getCommandFiles(directory){
    const files = fs.readdirSync(directory, {withFileTypes:true});
    const commandFiles = []

    files.forEach(file => {
        if(file.isDirectory()){
            commandFiles.push.apply(commandFiles, getCommandFiles(path.join(directory, file.name)))
        }
        else {
            commandFiles.push(path.join(directory, file.name))
        }
    });

    return commandFiles
}

// and deploy your commands!
module.exports = {
    registerCommand: async function(client){
        client.commands = new Collection();
        
        const commandsPath = path.join(__dirname, '../Commands');
        const commandFiles = getCommandFiles(commandsPath);
        const commands = [];
        
        for (const file of commandFiles) {
            const command = require(file);

            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
                continue
            }

            if('onMessage' in command){
                onMessageCallbacks.push(command.onMessage);
            }

            commands.push(command.data.toJSON());
        }

        // Construct and prepare an instance of the REST module
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(process.env.DISCORD_BOT_CLIENT_ID),
                { body: commands },
            );
    
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    }
}