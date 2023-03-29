const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { readFileSync } = require('fs');
const { options } = require('../../../Data/common_unitConversionType')

module.exports ={
    data: new SlashCommandBuilder()
        .setName("unit-conversion")
        .setDescription("Unity conversion")
        .setNameLocalization("ko", "단위변환")
        .setDescriptionLocalization("ko", "단위를 변환해줍니다.")
        .addNumberOption((option) => 
            option.setName("input")
            .setDescription("Input number")
            .setNameLocalization("ko", "입력")
            .setDescriptionLocalization("ko", "입력 숫자")
            .setRequired(true)
        ),
    async execute(client, interaction) {
        if(interaction.isStringSelectMenu()){
            Conversion(interaction);
            return;
        }

        SendSelectBox(interaction);
    }
}

async function SendSelectBox(interaction){
    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('conversion-type')
                .setPlaceholder('Nothing selected')
                .addOptions(options),
        );

    await interaction.editReply({ content: '변환 방식을 선택해주세요', components: [row] });
}

async function Conversion(interaction){
    const selected = interaction.values[0];
    const input = interaction.options.getString("input")

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("변환값")
    
    if(selected == "lb-kg"){
        embed.setDescription(input * 0.45359237 + "kg")
    } else if (selected == "kg-lb"){
        embed.setDescription(input / 0.45359237 + "lb")
    }

    interaction.update({embed:embed})
}