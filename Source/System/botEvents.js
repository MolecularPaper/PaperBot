module.exports.onMessageCallbacks = []
module.exports.registerEvent = (client) => {
    client.on('ready', () => { 
        console.log(`PaperBot ready. Logged in as ${client.user?.tag}`); 
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand() && !interaction.isStringSelectMenu()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await interaction.deferReply();
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: "명령어를 실행하는 도중 오류가 발생했습니다.", ephemeral: true });
        }
    });

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return false; 
        
        onMessageCallbacks.forEach(function(onMessage){
            onMessage(client, message);
        });

        console.log(`Message from ${message.author.username}: ${message.content}`);
      });
}