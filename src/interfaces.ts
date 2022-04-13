export interface ITask {
    name: string,
    time: number,
    startTime: null | Date,
}

export interface IProject {
    name: string,
    time: number,
    startTime: null | Date,
    tasks?: ITask[],
}


export interface IDay {
    date: string,
    start: string;
    end: string;
    projects: IProject[];
    isHoliday?: boolean;
}

export type IDays = IDay[];