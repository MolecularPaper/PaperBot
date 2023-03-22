const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("shuffle")
		.setDescription("Shuffles the queue")
		.setNameLocalization("ko", "셔플")
		.setDescriptionLocalization("ko", "재생목록의 곡들을 셔플합니다."),
	async execute(client, interaction){
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("재생목록에 추가된 노래가 없습니다.")

		queue.shuffle()
        await interaction.editReply(`재생목록에 있는 ${queue.tracks.length} 개의 곡들이 셔플되었습니다.!`)
	}
}
