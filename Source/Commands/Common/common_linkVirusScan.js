const { SlashCommandBuilder } = require("discord.js");
const { readFileSync } = require('fs');

module.exports ={
    data: new SlashCommandBuilder()
        .setName("link-scan")
        .setDescription("Link virus scan on/off")
        .setNameLocalization("ko", "링크스캔")
        .setDescriptionLocalization("ko", "링크 검사를 활성화/비활성화 합니다."),
    async execute(client, interaction) {
        
    }
}