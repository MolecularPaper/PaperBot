const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("displays the current song queue")
    .setNameLocalization("ko", "재생목록")
    .setDescriptionLocalization("ko","현재 재생목록을 보여줍니다.")
    .addNumberOption((option) => 
        option.setName("page")
        .setDescription("Page number of the queue")
        .setNameLocalization("ko", "페이지")
        .setDescriptionLocalization("ko", "재생목록의 페이지 번호")
        .setMinValue(1)),
    
    async execute(client, interaction){
        {
            const queue = client.player.getQueue(interaction.guildId)
            if (!queue || !queue.playing) return await interaction.editReply("재생목록에 추가된 노래가 없습니다.")
    
            const totalPages = Math.ceil(queue.tracks.length / 10) || 1
            const page = (interaction.options.getNumber("page") || 1) - 1
    
            if (page > totalPages) {
                return await interaction.editReply(`존재하지 않는 페이지입니다. ${totalPages} 가 마지막 페이지입니다.`)
            }
            
            const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
                return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title}>`
            }).join("\n")
    
            const currentSong = queue.current
    
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**현재 재생중**\n` + 
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title}` : "None") +
                        `\n\n**재생목록**\n${queueString}`
                        )
                        .setFooter({
                            text: `페이지 ${page + 1} of ${totalPages}`
                        })
                        .setThumbnail(currentSong.setThumbnail)
                ]
            })
        }
    }
}