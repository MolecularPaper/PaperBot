const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { version } = require('discord.js');
const { post } = require('request');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("play song")
        .setNameLocalization("ko", "재생")
        .setDescriptionLocalization("ko", "노래를 재생합니다.")
		.addStringOption((option) => 
            option.setName("text")
            .setDescription("Text to translate")
            .setDescriptionLocalization("ko", "번역할 텍스트")
            .setRequired(true))
        .addStringOption((option) =>
            option.setName("language")
            .setDescription("Languages to translate (output)")
            .setDescriptionLocalization("ko", "번역할 언어 (결과물)")
            .setRequired(true)
            .addChoices(
                { name: '한국어', value: "kr"},
                { name: 'English', value: "en"},
                { name: '日本語', value: "jp"},
                { name: 'Русский', value: "ru"},
                { name: 'Deutsch', value: "de"},
            )
        ),
	async execute(client, interaction) {
        const apiURL = "https://api-free.deepl.com/"
        const language = interaction.options.getString("language");
        const text = interaction.options.getString("text");
        const options = {
            "uri": apiURL,
            "method": 'POST',
            "body": {
                "Authorization" : `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
                "User-Agent" : `PaperBot/${version}`,
                "Content-Length" : text.length,
                "Content-Type": "application/x-www-form-urlencoded",
                "text" : `${text}&${text.toUpperCase()}`,
            }
        }
        post(apiURL, options, async (err, responese, body) => {
            const translations = responese["translations"];
            const sourceLanguage = translations["detected_source_language"];
            const resultText = translations["text"];
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`번역됨(${sourceLanguage} -> ${language})`)
                    .setDescription(resultText)
                ]
            });
        })
    }
}