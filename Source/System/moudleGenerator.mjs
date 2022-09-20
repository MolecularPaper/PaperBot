import { Meal } from '../Moudles/todaysMeal.mjs';
import { PaperInfo } from '../Moudles/paperInfo.mjs';
import { Chatting } from '../Moudles/chatting.mjs';

export var moudels = [
    new Chatting("대화생성"),
    new Meal("식사추천"),
    new PaperInfo("정보")
];