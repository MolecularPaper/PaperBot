import { MoudleBase } from "./moudleBase.mjs";
import { Configuration, OpenAIApi } from "openai";
import { config } from 'dotenv';
import { readFileSync } from 'fs'

export class ChatBot extends MoudleBase{
    constructor(client, interaction){
        super(client, interaction);
        this.setOpenAI();
        this.readConfig();
    }

    async setOpenAI(){
        config({path: './Data/config.env'});
        const configuration = new Configuration({
            organization: process.env.OPENAI_ORGANIZATION,
            apiKey: process.env.OPENAI_API_KEY
        });

        this.openai = new OpenAIApi(configuration);
    }

    async readConfig(){
        const jsonFile = readFileSync('./Data/openai-gpt-config.json', 'utf8');
        this.openaiConfig = JSON.parse(jsonFile);
    }

    async entry(interaction){
        const prompt = interaction.options.getString("text");
        
        this.openaiConfig.prompt = prompt;
        const response = await this.openai.createCompletion(this.openaiConfig, {timeout: 1000});

        interaction.reply(response.data.choices[0].text);
    }
}