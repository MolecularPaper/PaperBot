import { Meal } from '../Moudles/todaysMeal.mjs';
import { PaperInfo } from '../Moudles/paperInfo.mjs';
import { Music } from '../Moudles/music.mjs';
import { GameRanking } from '../Moudles/gameRanking.mjs';
import { Calculation } from '../Moudles/calculation.mjs';
import { ChatBot } from '../Moudles/chatbot.mjs';

export function GenerateMoudle(client){
    var moudels = [
        new Meal(client, "meal-recommend"),
        new PaperInfo(client, "info"),
        new Music(client, "song"),
        new GameRanking(client, "game-ranking"),
        new Calculation(client, "calculation"),
        new ChatBot(client, "chat")
    ];
    return moudels
}