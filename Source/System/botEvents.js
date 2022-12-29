module.exports.registerEvent = (client) => {
    client.on('ready', () => { 
        console.log(`PaperBot ready. Logged in as ${client.user?.tag}`); 
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
        console.log(interaction);

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "명령어를 실행하는 도중 오류가 발생했습니다.", ephemeral: true });
        }
    });
}