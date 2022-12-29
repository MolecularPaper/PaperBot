const { EmbedBuilder } = require("@discordjs/builders")
const { getSongInfoEmbed } = require("../Commands/music_playerinfo")

module.exports.registerPlayerEvent = (player) => {
    player.on("trackStart", (queue, track) => {
        const embeds = getSongInfoEmbed(queue, track);
        queue.metadata.send({embeds:embeds});
    });
}