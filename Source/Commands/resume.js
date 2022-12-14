const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription("Resumes the music")
		.setNameLocalization("ko", "재개")
		.setDescriptionLocalization("ko", "일시중지된 노래를 다시 재생합니다."),
	async execute(client, interaction){
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.reply("재생목록에 추가된 노래가 없습니다.")

		queue.setPaused(false)
        await interaction.reply("노래를 다시 재생합니다.")
	}
}
