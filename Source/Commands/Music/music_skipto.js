const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skips to a certain track #")
        .setNameLocalization("ko", "건너뛰기")
        .setDescriptionLocalization("ko", "재생목록에 있는 곡을 건너뜁니다.")
        .addNumberOption((option) => 
            option.setName("tracknumber")
            .setDescription("The track to skip to")
            .setNameLocalization("ko", "곡번호")
            .setDescriptionLocalization("ko", "건너뛸 곡의 번호입니다.")
            .setMinValue(1)
            .setRequired(true)),
    async execute(client, interaction){
        const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("재생목록에 추가된 노래가 없습니다.")

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length)
            return await interaction.editReply("유효하지 않는 곡 번호입니다.")
		queue.skipTo(trackNum - 1)

        await interaction.editReply(`재생목록의 ${trackNum}번 곡을 건너뜁니다.`)
	}
}
