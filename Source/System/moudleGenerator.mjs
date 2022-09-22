import { Meal } from '../Moudles/todaysMeal.mjs';
import { PaperInfo } from '../Moudles/paperInfo.mjs';
import { Music } from '../Moudles/music.mjs';
import { GameRanking } from '../Moudles/gameRanking.mjs';
import { Calculation } from '../Moudles/calculation.mjs';

export var moudels = [
    new Meal("식사추천"),
    new PaperInfo("정보"),
    new Music("노래"),
    new GameRanking("게임순위"),
    new Calculation("계산")
];