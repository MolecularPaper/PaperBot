import { MoudleBase } from "./moudleBase.mjs";
import { EmbedBuilder } from "discord.js";
import { readFileSync } from 'fs'

export class PaperInfo extends MoudleBase{
    constructor(commandName){
        super(commandName);
        this.infoEmbed = new EmbedBuilder().setColor(0x00ff00).setTitle("페이퍼 정보")
        this.info = readFileSync("./Data/paperInfo.txt", "utf-8");
        this.infoEmbed.setDescription(this.info)
    }

    async entry(interaction, client){
        await interaction.reply({embeds: [this.infoEmbed]});
    }
}