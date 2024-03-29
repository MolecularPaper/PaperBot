const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")

function getSongInfoEmbed(queue, song){
	let bar = queue.createProgressBar({
		queue: false,
		length: 19,
	})

	return new EmbedBuilder()
		.setThumbnail(song.thumbnail)
		.setDescription(`**현재 재생중**\n [${song.title}](${song.url})\n\n` + bar)
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("player-info")
		.setDescription("Displays info about the currently playing song")
		.setNameLocalization("ko", "노래정보")
		.setDescriptionLocalization("ko", "현재 재생중인 노래의 정보를 보여줍니다."),	
	async execute(client, interaction){
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("재생목록에 추가된 노래가 없습니다.");

		embed = getSongInfoEmbed(queue, queue.current)
		await interaction.editReply({embeds:[embed]})
	},
	getSongInfoEmbed,
}
