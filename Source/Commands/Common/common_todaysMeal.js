const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { readFileSync } = require('fs');
const { randomRange, format } = require("../../System/utility.js");

let mealList = readFileSync("./Data/menuList.txt", "utf-8").split(/\r?\n/);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("meal-recommend")
        .setDescription("Paper recommends meals.")
        .setNameLocalization("ko", "식사추천")
        .setDescriptionLocalization("ko", "식사를 추천해줍니다.")
        .addIntegerOption((option) => 
            option.setName("count")
            .setDescription("Meal recommend count")
            .setNameLocalization("ko", "개수")
            .setDescriptionLocalization("ko", "식사추천 개수")
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(true)
        ),
    async execute(client, interaction){
        const count = interaction.options.getInteger("count");
        const randomMealList = getRandomMealList(count);

        let description = "";
        for(var i = 0; i < randomMealList.length; i++){
            description += format("{0}. {1}\n", i + 1, randomMealList[i]);
        }

        const embed = new EmbedBuilder().setColor(0x00ff00).setTitle("추천메뉴")
        await interaction.editReply({embeds: [embed.setDescription(description)]});
    }
}

function getRandomMealList(count){
    let ramdomMealList = [];
    for(var i = 0; i < count; i++){
        let meal = selectRandomMeal(mealList);
        ramdomMealList.push(meal);
    }
    return ramdomMealList;
}

function selectRandomMeal(mealList){
    let index = randomRange(0, mealList.length);
    return mealList[index];
}