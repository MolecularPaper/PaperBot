const { SelectMenuBuilder, SelectMenuOptionBuilder, ActionRowBuilder } = require("@discordjs/builders")
const { onSelectMenuCallbacks } = require("../../System/botEvents.js")
const { format } = require("../../System/utility.js")

let interactionData = {};

async function onSelectMenu(client, interaction, id){
    let embeds = []
    if (interaction.values.includes("userinfo")) embeds.push(interactionData[id].userInfoEmbed);
    if (interaction.values.includes("stat")) embeds.push(interactionData[id].statEmbed);
    if (interaction.values.includes("equipment")) embeds.push(interactionData[id].equipmentEmbed)
    if (interaction.values.includes("gem")) embeds.push(interactionData[id].gemEmbed)
    if (interaction.values.includes("card")) embeds.push(interactionData[id].cardEmbed);

    interaction.editReply({
        embeds:embeds,
        components:interactionData[id].components
    })
}

module.exports = {
    async searchCharacter(client, interaction, data){
        let statFields=[], equipmentFields=[], cardFields=[], gems="";

        data.ArmoryProfile.Stats.forEach(stat => {
            if(stat.Type == "최대 생명력" || stat.Type == "공격력"){
                const index = stat.Type == "최대 생명력" ? 0 : 1
                statFields.splice(index, 0, {
                    "name": stat.Type,
                    "value": "``` " + stat.Value + " ```",
                    "inline": false
                })
                return
            }

            statFields.push({
                "name": stat.Type,
                "value": "``` " + stat.Value + " ```",
                "inline": true
            })
        });

        if(data.ArmoryEquipment.length != 0){
            data.ArmoryEquipment.forEach(equipment => {
                equipmentFields.push({
                    "name": equipment.Type,
                    "value": "``` [" + equipment.Grade + "] " + equipment.Name + " ```",
                    "inline": false
                })
            })
        }

        if(data.ArmoryGem != null){
            data.ArmoryGem.Gems.forEach(gem => {
                gems += "``` " + gem.Name.replace(/<[^>]*>?/g, '') + " ```"
            });
        }
        else{
            gems = "장착된 보석이 없습니다."
        }

        if(data.ArmoryCard != null){
            // 장착 카드
            data.ArmoryCard.Cards.forEach(card => {
                cardFields.push({
                    "name": "슬롯 " + card.Slot,
                    "value": format("``` [{0}] {1}```", card.Grade, card.Name),
                    "inline": false
                })
            });

            // 카드 효과
            let effects = ""
            data.ArmoryCard.Effects.forEach(effect => {
                effect.Items.forEach(item => {
                    effects += format("```{0}\n{1}```", item.Name, item.Description);
                });
            });

            cardFields.push({
                "name": "카드 효과",
                "value": effects,
                "inline": false
            })
        }
        else{
            cardFields.push({
                "name": "",
                "value": "장착된 카드가 없습니다.",
                "inline": false
            })
        }

        const selectMenu = new SelectMenuBuilder()
			.setCustomId(interaction.id)
			.setPlaceholder('표시할 정보를 선택하세요')
			.addOptions(
                new SelectMenuOptionBuilder()
                    .setValue('userinfo')
					.setLabel('기본정보')
					.setDescription('유저의 기본 정보를 표시합니다.'),
                new SelectMenuOptionBuilder()
                    .setValue('stat')
					.setLabel('스테이터스')
					.setDescription('스테이터스를 표시합니다.'),
				new SelectMenuOptionBuilder()
                    .setValue('equipment')
					.setLabel('장비')
					.setDescription('장착되있는 장비를 표시합니다.'),
                new SelectMenuOptionBuilder()
                    .setValue('gem')
					.setLabel('보석')
					.setDescription('장착되있는 보석을 표시해줍니다.'),
                new SelectMenuOptionBuilder()
                    .setValue('card')
					.setLabel('카드')
					.setDescription('장착되있는 카드를 표시해줍니다.'),
		);

        onSelectMenuCallbacks[interaction.id] = onSelectMenu
        const selectMenuComponent = new ActionRowBuilder().addComponents(selectMenu);
        
        interactionData[interaction.id] = {
            userInfoEmbed: {
                "title": "캐릭터 정보",
                "description": data.ArmoryProfile.CharacterName + "님의 캐릭터 정보입니다.\n\n",
                "color": 2326507,
                "fields": [
                {
                    "name": "서버",
                    "value": "``` " + data.ArmoryProfile.ServerName + " ```",
                    "inline": true
                },
                {
                    "name": "직업",
                    "value": "``` " + data.ArmoryProfile.CharacterClassName + " ```",
                    "inline": true
                },
                {
                    "name": "아이템레벨",
                    "value": "``` " + data.ArmoryProfile.ItemAvgLevel + " ```",
                    "inline": true
                }]
            },
            statEmbed: {
                "description": data.ArmoryProfile.CharacterName + "님의 전투 특성 정보입니다.\n\n",
                "fields": statFields,
                "title": "전투 특성",
                "color": 15409955
            },
            equipmentEmbed: {
                "description": data.ArmoryProfile.CharacterName + "님의 착용 장비 정보입니다.\n\n",
                "fields": equipmentFields,
                "title": "장비",
                "color": 16765184
            },
            gemEmbed: {
                "description": data.ArmoryProfile.CharacterName + "님의 보석 정보입니다.\n\n" + gems,
                "title": "보석",
                "color": 16711930
            },
            cardEmbed: {
                "description": data.ArmoryProfile.CharacterName + "님의 카드 정보입니다.\n\n",
                "title": "카드",
                "fields":cardFields,
                "color": 65331
            },
            components:[selectMenuComponent]
        }
        
        interaction.editReply({
            embeds:[interactionData[interaction.id].userInfoEmbed],
            components: [selectMenuComponent],
        })
    }
}