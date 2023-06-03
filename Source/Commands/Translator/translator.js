const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { sendPostJson } = require("../../System/utility");

async function getTextLanguage(text, callback){
    const url = "https://openapi.naver.com/v1/papago/detectLangs"
    sendPostJson(url, {
        "query":text
    },
    {
        "X-Naver-Client-Id": process.env.DETECTION_API_ID,
        "X-Naver-Client-Secret": process.env.DETECTION_API_KEY
    },
    (err, responese, body)=> callback(body['langCode']))
}

async function translationText(text, language, callback){
    const url = "https://openapi.naver.com/v1/papago/n2mt"
    getTextLanguage(text, (source) => {
        sendPostJson(url, {
            "source": source,
            "target": language,
            "text": text
        },
        {
            "X-Naver-Client-Id": process.env.TRANSLATOR_API_ID,
            "X-Naver-Client-Secret": process.env.TRANSLATOR_API_KEY
        },
        (err, responese, body) => {
            const result = body["message"]["result"]
            callback(result["srcLangType"], result["tarLangType"], result["translatedText"])
        })
    });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("translator")
		.setDescription("Language translation")
        .setNameLocalization("ko", "번역기")
        .setDescriptionLocalization("ko", "문장을 번역해줍니다.")
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
        const language = interaction.options.getString("language");
        const text = interaction.options.getString("text");
        translationText(text, language, async (scrLangType, tarLangType, translatedText) => {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`번역됨(${scrLangType} -> ${tarLangType})`)
                    .setDescription(translatedText)
                ]
            });
        })
    }
}