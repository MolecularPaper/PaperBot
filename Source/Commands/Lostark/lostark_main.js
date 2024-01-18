const { SlashCommandBuilder } = require("@discordjs/builders")
const { searchCharacter } = require("./lostark_search_character")

const XMLHttpRequest = require("xhr2");

function requestAPI(client, interaction, callback, endpoint){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", encodeURI("https://developer-lostark.game.onstove.com/" + endpoint), true);
    xhr.setRequestHeader('accept', 'application/json');
    xhr.setRequestHeader('authorization', 'bearer ' + process.env.LOSTARK_API_KEY);
    xhr.onreadystatechange = () => { };
    xhr.send();

    xhr.onload = () => {
        try{``
            if(xhr.status === 200) { 
                console.log(xhr.response)
                callback(client, interaction, JSON.parse(xhr.response.body))
            } else {
                interaction.editReply("API 호출중 오류가 발생하였습니다.")
                console.error(xhr.status, xhr.statusText);
            }
        }
        catch (e) { console.log(e) }
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lostark")
        .setDescription("lostark api commands")
        .setNameLocalization("ko", "로스트아크")
        .setDescriptionLocalization("ko","로스트아크 API 명령어")
        .addSubcommand((subcommand) => 
            subcommand.setName("user-info")
            .setDescription("Search user info")
            .setNameLocalization("ko", "유저정보")
            .setDescriptionLocalization("ko", "유저 정보를 검색합니다")
            .addStringOption((option) =>
                option.setName("name")
                .setDescription("User name")
                .setNameLocalization("ko", "이름")
                .setDescriptionLocalization("ko", "유저 이름")
                .setRequired(true))
    ),
    async execute(client, interaction){
        if (interaction.options.getSubcommand() === "user-info") {
            const name = interaction.options.getString("name")
            requestAPI(client, interaction, searchCharacter, "armories/characters/" + name + "/profiles+equipment+cards+gems")
            return
        }
    }
}