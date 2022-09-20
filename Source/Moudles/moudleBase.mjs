export class MoudleBase{
    constructor(commandName){
        this.commandName = commandName
    }

    async excute (interaction, client) {
        if (interaction.commandName === this.commandName) {
            await this.entry(interaction, client);
        }
    }

    async entry(interaction) { }
}