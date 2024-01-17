const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, SlashCommandStringOption } = require("discord.js");
const { get, set } = require('../../System/localVariable.js');
const { sendPostAsync } = require("../../System/utility.js");

async function scanUrl(urls){
    let unsafeUrls = []
    for (var i = 0; i < urls.length; i++){
        const body = await sendPostAsync('https://api.lrl.kr/v4/url/check', { url: urls[i]})
        if(body.message !== "SUCCESS") return null;
        if(body.result.safe == 0) unsafeUrls.push(`${urls[i]} - ${body.result.threat}`);
    }

    return unsafeUrls;
}

module.exports ={
    data: new SlashCommandBuilder()
        .setName("link-scan")
        .setDescription("Link virus scan on/off")
        .setNameLocalization("ko", "링크스캔")
        .setDescriptionLocalization("ko", "링크 검사를 활성화/비활성화 합니다.")
        .addSubcommand((subcommand) => 
            subcommand.setName("active")
            .setDescription("Enable link scan")
            .setNameLocalization("ko", "활성화")
            .setDescriptionLocalization("ko", "링크 스캔 기능 활성화")
        )
        .addSubcommand((subcommand) => 
            subcommand.setName("deactive")
            .setDescription("Disable link scan")
            .setNameLocalization("ko", "비활성화")
            .setDescriptionLocalization("ko", "링크 스캔 기능 비활성화")
        )
        .addSubcommand((subcommand) => 
            subcommand.setName("check")
            .setDescription("Check if link scanning is enabled.")
            .setNameLocalization("ko", "확인")
            .setDescriptionLocalization("ko", "링크 스캔 기능이 활성화 되있는지 확인")
        )
        .addSubcommand((subcommand) => 
            subcommand.setName("info")
            .setDescription("Link scan api info")
            .setNameLocalization("ko", "정보")
            .setDescriptionLocalization("ko", "링크 스캔 기능 API 정보")
        ),
    async execute(client, interaction) {
        const option = interaction.options.getSubcommand()

        if (option == "info"){
            interaction.editReply("링크 스캔 기능은 https://lrl.kr 의 API를 사용하고 있습니다.")
            return
        }
        
        if (option == "check") {
            const active = get(`${interaction.guild.id}/link-scan-active`);
            interaction.editReply(`현재 링크 스캔이 ${active ? "활성화" : "비활성화"} 되어 있습니다.`);
            return;
        }

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
            await interaction.editReply("설정을 변경할 권한이 없습니다.");
            return;
        }

        set(`${interaction.guild.id}/link-scan-active`, option == 0);
        const embed = new EmbedBuilder().setTitle(`링크 스캔이 ${option == 0 ? "활성화" : "비활성화"}됨`);
        
        if (option == "active"){
            embed.setDescription("메세지를 스캔후 메세지 안에 있는 링크가 안전할경우 ✅ 표시가 메세지에 추가되며, 링크가 안전하지 않을경우 경고 메세지가 전송됩니다.");
        }

        if (option == "deactive"){
            embed.setDescription("페이퍼가 더 이상 링크를 스캔하지 않습니다.");
        }
        
        await interaction.editReply({ embeds: [embed] });
    },
    async onMessage(client, message){
        if(!get(`${message.guild.id}/link-scan-active`)) return;
        
        const regex = new RegExp("\\b(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]");
        const urls = message.content.match(regex);

        if(urls == null || urls.length == 0) return;
        let unsafeUrls = await scanUrl(urls);

        if(unsafeUrls == null) return;

        if(unsafeUrls.length == 0){
            await message.react('✅');
            return;
        }

        let description = ""
        unsafeUrls.forEach(url => { description += url + "\n"});
        description += "\n 다음 링크에는 접속하지 않는것을 권장드립니다."

        await message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle(`안전하지 않은 링크가 감지되었습니다.`)
                .setDescription(description)
            ]
        });
    }
}