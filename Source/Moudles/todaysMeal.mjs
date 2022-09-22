import { EmbedBuilder } from "discord.js";
import { MoudleBase } from "./moudleBase.mjs"
import { readFileSync } from 'fs'
import { randomRange, format } from "../System/utility.mjs";

export class Meal extends MoudleBase{
    constructor(client, commandName){
        super(client, commandName);
        this.mealList = readFileSync("./Data/menuList.txt", "utf-8").split(/\r?\n/);
    }

    async entry(interaction, client){
        const count = interaction.options.getInteger("count");
        const randomMealList = this.getRandomMealList(count);

        let description = "";
        for(var i = 0; i < randomMealList.length; i++){
            description += format("{0}. {1}\n", i + 1, randomMealList[i]);
        }

        const embed = new EmbedBuilder().setColor(0x00ff00).setTitle("추천메뉴")
        await interaction.reply({embeds: [embed.setDescription(description)]});
    }

    getRandomMealList(count){
        let ramdomMealList = [];
        for(var i = 0; i < count; i++){
            let meal = this.selectRandomMeal(this.mealList);
            ramdomMealList.push(meal);
        }
        return ramdomMealList;
    }

    selectRandomMeal(mealList){
        let index = randomRange(0, mealList.length);
        return mealList[index];
    }
}