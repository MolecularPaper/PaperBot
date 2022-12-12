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
        const queue = this.player.createQueue(interaction.guild);

        if(interaction.options.getSubcommand() == "play"){
            this.playLink(interaction, queue, embed)
        } else if (interaction.options.getSubcommand() == "playlist"){
            this.showQueue(interaction, queue);
        } else if (interaction.options.getSubcommand() == "quit"){
            this.quit(interaction, queue);
        } else if (interaction.options.getSubcommand() == "skip"){
            this.skip(interaction, queue);
        } else if(interaction.options.getSubcommand() == "pause"){
            this.pasue(interaction, queue);
        } else if(interaction.options.getSubcommand() == "replay"){
            this.replay(interaction, queue);
        } else if(interaction.options.getSubcommand() == "shuffle"){
            this.shuffle(interaction, queue);
        }
    }

    // 링크의 노래를 현재 재생목록에 추가
    async addTrack(embed, queue, result){
        const song = result.tracks[0];
        await queue.addTrack(song);
        embed
            .setDescription(format("[{0}]({1}) 가 재생목록에 추가되었습니다.", song.title, song.url))
            .setThumbnail(song.thumbnail)
            .setFooter({ text : format("길이: {0}", song.duration) });
        return embed
    }

    // 링크의 재생 목록 전체를 현재 재생목록에 추가
    async addPlaylist(embed, queue, result, url){
        const tracks = result.tracks;
        await queue.addTracks(tracks);
        embed
            .setDescription(format("{0} 개의 곡이 재생목록에 추가되었습니다. {1}", tracks.length, url))
            .setThumbnail(tracks[0].thumbnail)
            .setFooter({ text : format("길이: {0}", tracks.duration) });
        return embed
    }

    // 노래 재생
    async playLink(interaction, queue, embed){
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

    async quit(interaction, queue){
        if(!queue){
            await interaction.reply("재생목록이 존재하지 않습니다.");
            return;
        }

        await interaction.reply("노래를 멈추고 재생목록을 삭제한뒤 음성채널을 나갑니다.")
        queue.destroy(true);
    }
    
    // 재생목록 출력
    async showQueue(interaction, queue){
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
            return format("[{0}] {1} - {2}", page * 10 + i + 1, song.title, song.duration)
        });

        const currentSong = queue.current;

        const embed = new EmbedBuilder().setTitle("재생목록").setDescription("**현재 재생중**\n" + 
        (currentSong ? format("{0} - {1}", currentSong.title, currentSong.duration) : "재생중인 곡 없음") +
        '\n\n**재생목록**\n' + queueString
        )
        .setFooter({
            text: format("페이지 {0} / {1}", page + 1, totalPages)
        })
        .setThumbnail(currentSong.thumbnail);

        await interaction.reply({embeds:[embed]});
    }
    
    // 노래 스킵
    async skip(interaction, queue){
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

    // 재생목록 셔플
    async shuffle(interaction, queue){
        if(!queue){
            await interaction.reply("재생목록이 존재하지 않습니다.");
            return;
        }

        queue.shuffle();
        await interaction.reply("재생목록을 섞었습니다.");
    }

    // 노래 일시정지
    async pasue(interaction, queue){
        if(!queue){
            await interaction.reply("재생목록이 존재하지 않습니다.");
            return;
        }

        if(queue.paused){
            await interaction.reply("이미 재생이 중지되어 있습니다.");
            return;
        }

        queue.setPaused(true);
        await interaction.reply("노래 재생을 일시정지 했습니다.");
    }

    // 노래 일시정지 해제
    async replay(interaction, queue){
        if(!queue){
            await interaction.reply("재생목록이 존재하지 않습니다.");
            return;
        }

        if(!queue.paused){
            await interaction.reply("이미 재생중입니다.");
            return;
        }

        queue.setPaused(false);
        await interaction.reply("노래를 다시 재생합니다.");
    }
}