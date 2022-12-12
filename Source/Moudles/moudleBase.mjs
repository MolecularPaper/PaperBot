import { format } from "../System/utility.mjs";

export class MoudleBase{
    constructor(client, commandName){
        this.commandName = commandName
        this.client = client
    }

    async excute (interaction) {
        if (interaction.commandName === this.commandName) {
            try{
                await this.entry(interaction);
            }
            catch (error){
                console.log(error);
                await interaction.reply("❗ | 오류가 발생했습니다. 다시한번 시도해주세요.")
            }
        }
    }

    async entry(interaction) { }
}