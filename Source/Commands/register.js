const { SlashCommandBuilder } = require("discord.js");
const { json } = require("express");
const { readFileSync, writeFileSync } = require("fs")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("register")
		.setDescription("register")
		.setNameLocalization("ko", "등록")
		.setDescriptionLocalization("ko", "유저등록"),
	async execute(client, interaction) {
        const dataFile = readFileSync("../../Data/userData.json", 'utf-8')
        const userData = JSON.parse(dataFile);
        const userTag = interaction.member.user.tag;

        if(userTag in userData) return await interaction.reply("이미 등록된 유저입니다.");
        userData[userTag] = {};

        writeFileSync("../../Data/userData.json", JSON.stringify(userData), 'utf-8')

        await interaction.reply("유저등록이 완료되었습니다.");
	},
}