const { SlashCommandBuilder } = require("discord.js");
const { readFileSync } = require("fs");
const path = require("path");

module.exports ={
    data: new SlashCommandBuilder()
        .setName("credit")
        .setDescription("Check my credit")
        .setNameLocalization("ko", "크레딧")
        .setDescriptionLocalization("ko", "현재 소유하고 있는 크레딧을 보여줍니다."),
    async execute(client, interaction){
        const dataPath = path.join(__dirname, "../../Data/userData.json")
        const dataFile = readFileSync(dataPath,  'utf-8')
        const userData = JSON.parse(dataFile);
        const userTag = interaction.member.user.tag;

        if(userTag in userData) {
            if(!('credit' in userData[userTag])) userData[userTag].credit = 0;
            await interaction.reply(`${userTag} 님의 소지 크레딧은 ${userData[userTag].credit}c 입니다.`);
        }
        else await interaction.reply(`먼저 /등록 명령어를 통해 유저등록을 해주세요.`);
    }
}