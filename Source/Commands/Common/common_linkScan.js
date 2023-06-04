const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { get, set } = require('../../System/localVariable.js');
const { collect } = require("../../System/clevisUrl.js");

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
        const active = interaction.options.getBoolean("active")
        set(`${interaction.guild.id}/link-scan-active`, active)

        const embed = new EmbedBuilder().setTitle(`링크 스캔이 ${active ? "활성화" : "비활성화"}됨`);
        
        if (active){
            embed.setDescription("메세지를 스캔후 메세지 안에 있는 링크가 안전할경우 ✅ 표시가 메세지에 추가되며, 링크가 안전하지 않을경우 경고 메세지가 전송됩니다.");
        }
        
        await interaction.editReply({ embeds: [embed] });
    },
    async onMessage(client, message){
        if(!get(`${message.guild.id}/link-scan-active`)) return;

        const urls = collect(message.content);
        
        console.log(urls);
    }
}