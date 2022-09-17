export class MoudleBase{
    constructor(commandName){
        this.commandName = commandName
    }

    async excute (interaction) {
        if (interaction.commandName === this.commandName) {
            await this.entry(interaction);
        }
    }

    async entry(interaction) { }
}