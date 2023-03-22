const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pauses the music")
		.setNameLocalization("ko", "중지")
		.setDescriptionLocalization("ko", "노래를 일시중지 시킵니다."),
	async execute(client, interaction) {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) { 
			await interaction.editReply("재생목록에 추가된 노래가 없습니다.")
			return;
		}

		queue.setPaused(true)
        await interaction.editReply("노래가 일시중지 되었습니다. `/재개` 명령어를 사용하면 노래가 다시 재생됩니다.")
	},
}