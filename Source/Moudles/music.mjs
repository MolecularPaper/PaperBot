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

        let embed = new EmbedBuilder().setTitle("노래");
        if(interaction.options.getSubcommand() == "play"){
            this.playLink(interaction, embed)
        } else if (interaction.options.getSubcommand() == "playlist"){
            this.showQueue(interaction);
        } else if (interaction.options.getSubcommand() == "skip"){
            this.skip(interaction);
        }
        else if(interaction.options.getSubcommand() == "pause"){
            this.pasue(interaction);
        }
        else if(interaction.options.getSubcommand() == "replay"){
            this.replay(interaction);
        }
        else if(interaction.options.getSubcommand() == "shuffle"){
            this.shuffle(interaction);
        }
        
    }

    async addTrack(embed, queue, result){
        const song = result.tracks[0];
        await queue.addTrack(song);
        embed
            .setDescription(format("[{0}]({1}) 가 재생목록에 추가되었습니다.", song.title, song.url))
            .setThumbnail(song.thumbnail)
            .setFooter({ text : format("길이: {0}", song.duration) });
        return embed
    }

    async addPlaylist(embed, queue, result, url){
        const tracks = result.tracks;
        await queue.addTracks(tracks);
        embed
            .setDescription(format("{0} 개의 곡이 재생목록에 추가되었습니다. {1}", tracks.length, url))
            .setThumbnail(tracks[0].thumbnail)
            .setFooter({ text : format("길이: {0}", tracks.duration) });
        return embed
    }

    async playLink(interaction, embed){
        const queue = this.player.createQueue(interaction.guild);
        if(!queue.connection) await queue.connect(interaction.member.voice.channel);

        let url = interaction.options.getString("link");
        const result = await this.player.search(url, {
            requestBy: interaction.user
        });

        if (result.tracks.length === 1){
            embed = await this.addTrack(embed, queue, result);
        } else if (result.tracks.length > 1){
            embed = await this.addPlaylist(embed, queue, result, url);
        } else{
            await interaction.reply("결과없음, 링크를 확인해주세요.");
            return;
        }
        
        if(!queue.playing) await queue.play();
        await interaction.reply({embeds:[embed]});
    }

    async showQueue(interaction){
        const queue = this.player.getQueue(interaction.guild);
        if(!queue || !queue.playing){
            await interaction.reply("재생목록이 존재하지 않습니다.");
            return;
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
        const page = (interaction.options.getNumber("page") || 1) - 1;

        if(page > totalPages){
            await interaction.reply("없는 페이지 번호입니다.");
            return;
        }

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return format("[{0}] {1} - {2} <{3}>", page * 10 + i + 1, song.title, song.duration, song.requestedBy.id)
        });

        const currentSong = queue.current;

        const embed = new EmbedBuilder().setTitle("재생목록").setDescription("**현재 재생중**\n" + 
        (currentSong ? format("{0} - {1} <{2}>", page * 10 + i + 1, currentSong.title, currentSong.duration, currentSong.requestedBy.id) : "재생중인 곡 없음") +
        '\n\n**재생목록**\n' + queueString
        )
        .setFooter({
            text: format("페이지 {0} / {1}", page + 1, totalPages)
        })
        .setThumbnail(currentSong.thumbnail);

        await interaction.reply({embeds:[embed]});
    }

    async skip(interaction){
        const queue = this.player.getQueue(interaction.guild);

        if(!queue){
            await interaction.reply("재생목록이 존재하지 않습니다.");
            return;
        }

        index = interaction.options.getNumber("index");
        if(index == !null){
            queue.skipTo(index);
        }
        else{
            queue.skip();
            index = 0;
        }

        const song = queue.tracks[index];
        await interaction.reply(format("다음 곡을 넘김 - {0} - {1} <{2}>", song.title, song.duration, song.requestedBy.id))
    }

    async shuffle(interaction){
        this.player.createQueue(interaction.guild).shuffle();
        await interaction.reply("재생목록을 셔플했습니다.");
    }

    async pasue(interaction){
        const queue = this.player.getQueue(interaction.guild);

        if(queue.paused){
            await interaction.replay("이미 재생이 중지되어 있습니다.");
            return;
        }

        queue.pasue();
    }

    async replay(interaction){
        const queue = this.player.getQueue(interaction.guild);

        if(!queue.paused){
            await interaction.replay("이미 재생중입니다.");
            return;
        }

        queue.resume();
    }
}