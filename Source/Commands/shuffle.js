const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles the queue"),
	async execute(client, interaction){
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

		queue.shuffle()
        await interaction.editReply(`The queue of ${queue.tracks.length} songs have been shuffled!`)
	}
}
