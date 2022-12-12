import { QueueRepeatMode , Player } from "discord-player";
import { MoudleBase } from "./moudleBase.mjs";
import { EmbedBuilder } from "discord.js";
import { format } from "../System/utility.mjs";

export class Music extends MoudleBase{
    constructor(client, interaction){
        super(client, interaction);
        this.player = new Player(client);
        this.isPaused = false;
        this.queue = null;
    }

    async entry(interaction){
        if(!interaction.member.voice.channel){
            await interaction.reply("⚠️ | 먼저 음성 채널에 연결해주신뒤, 명령어를 입력해주세요.");
            return
        }

        let embed = new EmbedBuilder().setTitle("노래");
        const queue = await this.player.createQueue(interaction.guild, {
            ytdlOptions: {
                filter: 'audioonly',
                highWaterMark: 1 << 30,
                dlChunkSize: 0,
            },
            metadata: interaction.channel
        });

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
        } else if(interaction.options.getSubcommand() == "resume"){
            this.resume(interaction, queue);
        } else if(interaction.options.getSubcommand() == "shuffle"){
            this.shuffle(interaction, queue);
        } else if(interaction.options.getSubcommand() == "loop"){
            this.loop(interaction, queue);
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
            await interaction.reply("⚠️ | 결과없음, 링크를 확인해주세요.");
            return;
        }
        
        if(!queue.playing) await queue.play();
        await interaction.reply({embeds:[embed]});
    }

    async quit(interaction, queue){
        if(!queue){
            await interaction.reply("❌ | 재생되고 있는 노래가 없습니다.");
            return;
        }

        await interaction.reply("노래 재생을 종료합니다.")
        queue.destroy(true);
    }
    
    // 재생목록 출력
    async showQueue(interaction, queue){
        if(!queue || !queue.playing){
            await interaction.reply("❌ | 재생되고 있는 노래가 없습니다.");
            return;
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
        const page = (interaction.options.getInteger("page") || 1) - 1;

        if(page > totalPages){
            await interaction.reply("❌ | 없는 페이지 번호입니다.");
            return;
        }

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            const title = song.title.length > 30 ? format("{0}...", song.title.substr(0, 25)) : song.title;
            return format("[{0}] {1} - {2}", page * 10 + i + 1, title, song.duration)
        });

        const currentSong = queue.current;

        const embed = new EmbedBuilder().setTitle("재생목록").setDescription("**현재 재생중**\n" + 
        (currentSong ? format("{0} - {1}", currentSong.title, currentSong.duration) : "재생중인 곡 없음") +
        '\n\n**재생목록**\n' + queueString.join("\n")
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
            await interaction.reply("❌ | 재생되고 있는 노래가 없습니다.");
            return;
        }

        let index = interaction.options.getInteger("index");
        if(index != null){
            await queue.skipTo(index);
        }
        else{
            await queue.skip();
            index = 0;
        }

        const song = queue.tracks[index];
        const embed = new EmbedBuilder().setTitle("노래 건너뜀").setDescription(format("{0} - {1}", song.title, song.duration))
        await interaction.reply({embeds:[embed]})
    }

    // 재생목록 셔플
    async shuffle(interaction, queue){
        if(!queue){
            await interaction.reply("❌ | 재생되고 있는 노래가 없습니다.");
            return;
        }

        queue.shuffle();
        await interaction.reply("♻️ | 재생목록을 섞었습니다.");
    }

    // 노래 일시정지
    async pasue(interaction, queue){
        if(!queue){
            await interaction.reply("❌ | 재생되고 있는 노래가 없습니다.");
            return;
        }

        if(this.isPaused){
            await interaction.reply("⚠️ | 이미 재생이 중지되어 있습니다.");
            return;
        }

        this.isPaused = queue.setPaused(true);
        await interaction.reply("ℹ️ | 노래 재생을 일시정지 했습니다.");
    }

    // 노래 일시정지 해제
    async resume(interaction, queue){
        if(!queue){
            await interaction.reply("❌ | 재생되고 있는 노래가 없습니다.");
            return;
        }

        if(!this.isPaused){
            await interaction.reply("⚠️ | 이미 재생중입니다.");
            return;
        }

        this.isPaused = queue.setPaused(false);
        await interaction.reply("ℹ️ | 노래를 다시 재생합니다.");
    }

    async loop(interaction, queue){
        if(!queue){
            await interaction.reply("❌ | 재생되고 있는 노래가 없습니다.");
            return;
        }

        const loopMode = interaction.options.getInteger("mode");
        const success = queue.setRepeatMode(loopMode);
        const mode = QueueRepeatMode[loopMode] === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';
        interaction.reply(success ? `${mode} | 반복 상태가 변경되었습니다.` : '❌ | 반복 상태를 변경하지 못했습니다.')
    }
}