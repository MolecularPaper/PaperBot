const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("quit")
		.setDescription("Stops the bot and clears the queue")
		.setNameLocalization("ko", "노래종료")
		.setDescriptionLocalization("ko", "노래 재생을 종료합니다. (재생목록 삭제됨)"),
	async execute(client, interaction){
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("재생목록에 추가된 노래가 없습니다.")

		queue.destroy()
        await interaction.editReply("노래를 재생을 종료합니다.")
	},
}
