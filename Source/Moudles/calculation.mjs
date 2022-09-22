import { MoudleBase } from "./moudleBase.mjs";
import { spawn } from 'child_process'
import { format } from "../System/utility.mjs";

export class Calculation extends MoudleBase{
    async entry(interaction){
        const expression = interaction.options.getString("expression");        
        const result = spawn('python', ['./Source/Python/calculation.py', expression]);

        result.stdout.on('data', function(data){
            let result = data.toString();
            interaction.reply(result);
        });

        result.stderr.on('data', function(data) {
            console.log(data.toString());
        });
    }
}