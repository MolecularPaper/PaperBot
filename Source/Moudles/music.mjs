import { QueryType, Player } from "discord-player";
import { MoudleBase } from "./moudleBase.mjs";
import { EmbedBuilder } from "discord.js";
import { format } from "../System/utility.mjs";

export class Music extends MoudleBase{
    constructor(client, interaction){
        super(client, interaction);
        this.player = new Player(client);
    }

    async entry(interaction){
        if(!interaction.member.voice.channel){
            await interaction.reply("먼저 음성 채널에 연결해주신뒤, 명령어를 입력해주세요.");
            return
        }

        let embed = new EmbedBuilder().setTitle("재생목록")
        if(interaction.options.getSubcommand() == "play"){
            this.playLink(interaction, embed)
        } else if (interaction.options.getSubcommand() == "playlist"){
            
        } else if (interaction.options.getSubcommand() == "playlist"){

        }
    }

    async addTrack(queue, embed, result){
        const song = result.tracks[0]
        await queue.addTrack(song);
        embed
            .setDescription(format("[{0}]({1}) 가 재생목록에 추가되었습니다.", song.title, song.url))
            .setThumbnail(song.thumbnail)
            .setFooter({ text : format("길이: {0}", song.duration) });
        return embed
    }

    async addPlaylist(embed, queue, result){
        const playList = result.playList
        await queue.addTracks(result.tracks);
        embed
            .setDescription(format("{0} 개의 곡이 재생목록에 추가되었습니다. {1}", song.tracks, song.url))
            .setThumbnail(song.thumbnail)
            .setFooter({ text : format("길이: {0}", song.duration) });
        return embed
    }

    async playLink(interaction, embed){
        const queue = this.player.createQueue(interaction.guild);
        if(!queue.connection) await queue.connect(interaction.member.voice.channel)

        let url = interaction.options.getString("link");
        const result = await this.player.search(url, {
            requestBy: interaction.user
        });

        if (result.tracks.length === 1){
            embed = this.addTrack(embed, queue, result);
        } else if (result.tracks.length > 1){
            embed = this.addPlaylist(embed, queue, result);
        } else{
            await interaction.reply("결과없음, 링크를 확인해주세요.");
            return;
        }
        this.play(queue)
    }

    async play(queue){
        if(!queue.playing) await queue.play();
        await interaction.reply({embeds:[embed]});
    }

    async showQueue(){

    }
}