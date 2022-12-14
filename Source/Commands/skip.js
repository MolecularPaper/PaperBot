const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song")
        .setNameLocalization("ko", "다음곡")
        .setDescriptionLocalization("ko", "재생중인 노래를 건너뜁니다."),
    async execute(client, interaction){
        const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.reply("재생목록에 추가된 노래가 없습니다.")

        const currentSong = queue.current

		queue.skip()
        await interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription(`${currentSong.title} 를 건너뛰었습니다.`).setThumbnail(currentSong.thumbnail)
            ]
        })
	}
}
