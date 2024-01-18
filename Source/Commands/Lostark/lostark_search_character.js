module.exports = {
    async searchCharacter(client, interaction, data){
        let cri, spc, sub, dex, endu, skill, hp, atk;
        
        data.ArmoryProfile.Stats.forEach(stat => {
            if (stat.Type == "치명") cri = stat.Value
            else if (stat.Type == "특화") spc = stat.Value
            else if (stat.Type == "제압") sub = stat.Value
            else if (stat.Type == "신속") dex = stat.Value
            else if (stat.Type == "인내") endu = stat.Value
            else if (stat.Type == "숙련") skill = stat.Value
            else if (stat.Type == "최대 생명력") hp = stat.Value
            else if (stat.Type == "공격력") atk = stat.Value
        });

        const embeds = [
            {
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
                }
                ]
            },
            {
                "description": "\n",
                "fields": [
                {
                    "name": "최대 생명령",
                    "value": hp,
                    "inline": false
                },
                {
                    "name": "공격력",
                    "value": atk,
                    "inline": false
                },
                {
                    "name": "치명",
                    "value": cri,
                    "inline": true
                },
                {
                    "name": "특화",
                    "value": spc,
                    "inline": true
                },
                {
                    "name": "제압",
                    "value": sub,
                    "inline": true
                },
                {
                    "name": "신속",
                    "value": dex,
                    "inline": true
                },
                {
                    "name": "인내",
                    "value": endu,
                    "inline": true
                    },
                    
                {
                    "name": "숙련",
                    "value": skill,
                    "inline": true
                }
                ],
                "title": "전투 특성",
                "color": 2326507
            }
        ]

        interaction.editReply(embeds=embeds)
    }
}