import { MoudleBase } from "./moudleBase.mjs";

export class Chatting extends MoudleBase{
    constructor(commandName){
        super(commandName)
    }

    async entry(interaction, client){
        const user = client.users.cache.get(interaction.member.user.id);
        user.send("여기에서도 명령어를 사용할 수 있습니다.").catch(console.log);
        await interaction.reply("DM 메세지를 확인해주세요");
    }
}