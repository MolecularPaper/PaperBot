let onMessageCallbacks = []

module.exports.onMessageCallbacks = onMessageCallbacks;
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
        } catch (e) {
            console.error(e);
            await interaction.editReply({ content: "명령어를 실행하는 도중 오류가 발생했습니다.", ephemeral: true });
        }
    });

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return false; 
    
        onMessageCallbacks.forEach(async function(onMessage){
            try{
                await onMessage(client, message);
            }
            catch (e) {
                console.error(e)
                await message.channel.send("명령어 실행 도중 오류가 발생하였습니다.")
            }
        });
    });
}