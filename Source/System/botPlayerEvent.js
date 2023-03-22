const { getSongInfoEmbed } = require("../Commands/Music/music_playerinfo.js")

module.exports.registerPlayerEvent = (player) => {
    player.on("error", (queue, error) => {
        console.log(`[${queue.guild.name}] 재생목록에서 오류가 발생하였습니다: ${error.message}`);
    });

    player.on("connectionError", (queue, error) => {
        console.log(`[${queue.guild.name}] 연결 도중 오류가 발생하였습니다: ${error.message}`);
    });

    player.on("trackStart", (queue, track) => {
        const embed = getSongInfoEmbed(queue, track);
        queue.metadata.channel.send({embeds:[embed]});
    });

    player.on("channelEmpty", (queue) => {
        queue.metadata.channel.send("❌ | 채널에 아무도 존재하지 않습니다.\n 채널에서 나가겠습니다.");
    });

    player.on("queueEnd", (queue) => {
        queue.metadata.channel.send("✅ | 재생목록의 노래가 모두 재생되었습니다!");
    });
}