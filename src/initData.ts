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
                tasks: [
                    {
                        name: 'daily',
                        time: 0,
                        startTime: null,
                    },
                    {
                        name: 'retro',
                        time: 0,
                        startTime: null,
                    },
                    {
                        name: 'sprint planing',
                        time: 0,
                        startTime: null,
                    },
                ]
            },
            {
                name: 'jam',
                time: 0,
                startTime: null,
            },
            {
                name: 'pause & coffee',
                time: 0,
                startTime: null,
            },
            {
                name: 'Lot-Academy',
                time: 0,
                startTime: null,
            },
            {
                name: 'socializing',
                time: 0,
                startTime: null,
            }
        ],
    },
    {
        date: '4/9/2022',
        start: '2022-04-09T07:00:58.377Z',
        end: '2022-04-09T14:00:58.377Z',
        isHoliday: false,
        projects: [
            {
                name: 'scrum-teams',
                time: 450,
                startTime: null,
                tasks: [
                    {
                        name: 'daily',
                        time: 150,
                        startTime: null,
                    },
                    {
                        name: 'retro',
                        time: 0,
                        startTime: null,
                    },
                    {
                        name: 'C&D Overview',
                        time: 300,
                        startTime: null,
                    },
                    {
                        name: 'sprint planing',
                        time: 0,
                        startTime: null,
                    },
                    {
                        name: 'architects coffee',
                        time: 0,
                        startTime: null,
                    },
                    {
                        name: 'Talk with Emmi',
                        time: 0,
                        startTime: null,
                    }
                ]
            },
            {
                name: 'jam',
                time: 1000,
                startTime: null,
                tasks: [
                    {
                        name: 'refactoring',
                        time: 200,
                        startTime: null,
                    },
                    {
                        name: 'LOT-12345',
                        time: 800,
                        startTime: null,
                    }
                ]
            },
            {
                name: 'OGRelease',
                time: 0,
                startTime: null,
            },
            {
                name: 'refreshing',
                time: 0,
                startTime: null,
            },
            {
                name: 'Lot-Academy',
                time: 0,
                startTime: null,
            },
            {
                name: 'socializing',
                time: 0,
                startTime: null,
            }
        ],
    },
    {
        date: '4/8/2022',
        start: '2022-04-08T07:30:58.377Z',
        end: '2022-04-08T14:00:58.377Z',
        isHoliday: false,
        projects: [
            {
                name: 'scrum-teams',
                time: 1450,
                startTime: null,
                tasks: [
                    {
                        name: 'daily',
                        time: 150,
                        startTime: null,
                    },
                    {
                        name: 'retro',
                        time: 1000,
                        startTime: null,
                    },
                    {
                        name: 'C&D Overview',
                        time: 300,
                        startTime: null,
                    },
                    {
                        name: 'sprint planing',
                        time: 0,
                        startTime: null,
                    },
                    {
                        name: 'architects coffee',
                        time: 0,
                        startTime: null,
                    },
                    {
                        name: 'Talk with Emmi',
                        time: 0,
                        startTime: null,
                    }
                ]
            },
            {
                name: 'jam',
                time: 1000,
                startTime: null,
                tasks: [
                    {
                        name: 'refactoring',
                        time: 200,
                        startTime: null,
                    },
                    {
                        name: 'LOT-12345',
                        time: 800,
                        startTime: null,
                    }
                ]
            },
            {
                name: 'OGRelease',
                time: 0,
                startTime: null,
            },
            {
                name: 'refreshing',
                time: 0,
                startTime: null,
            },
            {
                name: 'Lot-Academy',
                time: 0,
                startTime: null,
            },
            {
                name: 'socializing',
                time: 0,
                startTime: null,
            }
        ],
    }
];