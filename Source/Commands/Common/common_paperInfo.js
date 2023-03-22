const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { readFileSync } = require('fs');

module.exports ={
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Show papaer bot info")
        .setNameLocalization("ko", "정보")
        .setDescriptionLocalization("ko", "페이퍼봇의 정보를 보여줍니다."),
    async execute(client, interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("페이퍼 정보")
            .setDescription(readFileSync("./Data/paperInfo.txt", "utf-8"));
        
        interaction.editReply({embeds:[embed]});
    }
}