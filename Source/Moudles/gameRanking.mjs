import { EmbedBuilder } from "discord.js";
import { MoudleBase } from "./moudleBase.mjs";
import { spawn } from 'child_process'

export class GameRanking extends MoudleBase{
    async entry(interaction){
        const result = spawn('python', ['./Source/Python/game_ranking.py']);
        const embed = new EmbedBuilder().setColor(0x00ff00).setTitle("게임 랭킹")

        result.stdout.on('data', function(data){
            let description = data.toString();
            interaction.reply({embeds: [embed.setDescription(description)]});
        });

        result.stderr.on('data', function(data) {
            console.log(data.toString());
        });
    }
}