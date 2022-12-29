const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { format } = require("../System/utility")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("play song")
        .setNameLocalization("ko", "재생")
        .setDescriptionLocalization("ko", "노래를 재생합니다.")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("link")
				.setDescription("Add song from link")
                .setNameLocalization("ko", "링크")
                .setDescriptionLocalization("ko", "링크에서 노래를 추가합니다.")
				.addStringOption((option) => 
                    option.setName("url")
                    .setDescription("the song's url")
                    .setDescriptionLocalization("ko", "재생할 노래 또는 목록의 URL")
                    .setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Searches for sogn based on provided keywords")
                .setNameLocalization("ko", "검색")
                .setDescriptionLocalization("ko", "키워드를 기반으로 노래를 검색합니다.")
				.addStringOption((option) =>
					option.setName("searchterms")
                    .setDescription("the search keywords")
                    .setNameLocalization("ko", "검색어")
                    .setDescriptionLocalization("ko", "검색할 키워드")
                    .setRequired(true)
				)
		),
	async execute(client, interaction) {
        if (!interaction.member.voice.channel) return await interaction.reply("먼저 음성채널에 접속해주세요.");

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder();

		if (interaction.options.getSubcommand() === "link") {
            let url = interaction.options.getString("url");
            const result = await client.player.search(url, {
                requestBy: interaction.user
            });

            if (result.tracks.length === 1){
                embed = await addTrack(embed, queue, result);
            } else if (result.tracks.length > 1){
                embed = await addPlaylist(embed, queue, result, url);
            } else{
                return await interaction.reply("⚠️ | 결과없음, 링크를 확인해주세요.");
            }
		} else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0) return await interaction.reply("⚠️ | 검색 결과가 없습니다.")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** 이 재생목록에 추가되었습니다.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
		}
        if (!queue.playing) await queue.play()
        await interaction.reply({
            embeds: [embed]
        })
    }
}

// 링크의 노래를 현재 재생목록에 추가
async function addTrack(embed, queue, result){
    const song = result.tracks[0];
    await queue.addTrack(song);
    embed
        .setDescription(format("[{0}]({1}) 가 재생목록에 추가되었습니다.", song.title, song.url))
        .setThumbnail(song.thumbnail)
        .setFooter({ text : format("길이: {0}", song.duration) });
    return embed
}

// 링크의 재생 목록 전체를 현재 재생목록에 추가
async function addPlaylist(embed, queue, result, url){
    const tracks = result.tracks;
    await queue.addTracks(tracks);
    embed
        .setDescription(format("{0} 개의 곡이 재생목록에 추가되었습니다. {1}", tracks.length, url))
        .setThumbnail(tracks[0].thumbnail)
        .setFooter({ text : format("길이: {0}", tracks.duration) });
    return embed
}