const { SlashCommandBuilder } = require("discord.js");
const { get, set } = require('../../System/localVariable.js');

module.exports ={
    data: new SlashCommandBuilder()
        .setName("link-scan")
        .setDescription("Link virus scan on/off")
        .setNameLocalization("ko", "링크스캔")
        .setDescriptionLocalization("ko", "링크 검사를 활성화/비활성화 합니다.")
        .addBooleanOption((option) => 
            option.setName("active")
            .setDescription("Enable scanning or not")
            .setNameLocalization("ko", "활성화")
            .setDescriptionLocalization("ko", "활성화 여부")
            .setRequired(true)),
    async execute(client, interaction) {
        set(`${interaction.guild}/link-scan-active`, interaction.options.getBoolean("active"))
    },
    async onMessage(client, message){
        
    }
}