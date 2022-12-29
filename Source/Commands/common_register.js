const { SlashCommandBuilder } = require("discord.js");
const { json } = require("express");
const { readFileSync, writeFileSync, existsSync } = require("fs")
const path = require("path");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("register")
		.setDescription("register")
		.setNameLocalization("ko", "등록")
		.setDescriptionLocalization("ko", "유저등록"),
	async execute(client, interaction) {
        //Directory 존재 여부 체크
        const dataPath = path.join(__dirname, "../../Data/userData.json")

        if(!existsSync(dataPath)){
            writeFileSync(dataPath, "{\n}");      
        }

        const dataFile = readFileSync(dataPath, 'utf-8')
        const userData = JSON.parse(dataFile);
        const userTag = interaction.member.user.tag;

        if(userTag in userData) return await interaction.reply("이미 등록된 유저입니다.");
        userData[userTag] = {};

        writeFileSync(dataPath, JSON.stringify(userData), 'utf-8')

        await interaction.reply("유저등록이 완료되었습니다.");
	},
}