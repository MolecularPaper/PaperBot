import { format } from "../System/utility.mjs";

export class MoudleBase{
    constructor(client, commandName){
        this.commandName = commandName
        this.client = client
    }

    async excute (interaction) {
        if (interaction.commandName === this.commandName) {
            await this.entry(interaction);
        }
    }

    async entry(interaction) { }
}