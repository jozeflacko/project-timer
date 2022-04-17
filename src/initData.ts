import {IDays} from "./interfaces";
import {getTodayString, toDate} from "./helpers";

export const initDays: IDays = [
    {
        date: getTodayString(),
        start: '',
        end: '',
        isHoliday: false,
        projects: [
            {
                name: 'scrum-teams',
                time: 0,
                startTime: null,
            },
            {
                name: 'jam',
                time: 0,
                startTime: null,
            },
            {
                name: 'education',
                time: 0,
                startTime: null,
            },
            {
                name: 'general',
                time: 0,
                startTime: null,
            },
            {
                name: 'stretch & coffee',
                time: 0,
                startTime: null,
            },
        ],
    }
];