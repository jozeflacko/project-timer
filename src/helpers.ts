import {IDay, IDays} from "./interfaces";
import {initDays} from "./initData";

export function toDate(date: Date) {
    return formatStringData(date.toLocaleDateString("de-AT"));
}

export function formatStringData(date: string) {
    if(date === '') {
        return date;
    }
    const separator = date.indexOf ('.') < 0 ? '/' : '.';
    const d = date.split(separator);
    return d[0] + '.' + d[1] + '.';
}

export function getTodayString() {
    return toDate(new Date());
}

export function setDays(days: IDays) {
    localStorage.setItem('days', JSON.stringify(days));
}

export function getDays(): IDays {
    const _d = localStorage.getItem('days') + '';
    return JSON.parse(_d);
}

export function initLocalStorage() {
    if (localStorage.getItem('days') == null) {
        setDays(initDays);
    } else {
        const today = getTodayString();
        const days = getDays();
        if (days.length > 0 && days[0].date !== today) {

            const lastSaved: IDay = JSON.parse(JSON.stringify(days[0]));

            lastSaved.end = lastSaved.end ? lastSaved.end : '';
            lastSaved.projects.forEach(p => {
                p.startTime = null;
                p.tasks?.forEach(t => {
                    t.startTime = null;
                });
            });

            const newDay: IDay = JSON.parse(JSON.stringify(lastSaved));

            newDay.date = today;
            newDay.start = '';
            newDay.end = '';
            newDay.projects.forEach(p => {
                p.startTime = null;
                p.time = 0;
                p.tasks?.forEach(t => {
                    t.startTime = null;
                    t.time = 0;
                });
            });

            days[0] = lastSaved;
            days.unshift(newDay);
            setDays(days);
        }
    }
}

export function roundSecondsToMinutes(n: number) {
    return ((Math.floor(n/60)) * 60);
}

export function stopPropagation(e: any) {
   try {
       e.preventDefault();
       e.stopPropagation();
       e.nativeEvent.stopImmediatePropagation();
   }
   catch(e) {
       console.log(e);
   }
}

export function toHours(seconds: number) {
    return Number((seconds / (60 * 60)).toFixed(2));
}

export function calculateRunningTime(savedTimeSeconds: number, startTime: null | Date) {
    const now = new Date();
    if (startTime === null) {
        return savedTimeSeconds;
    }
    return (
        Math.floor(Number(savedTimeSeconds) + (
            (
                now.getTime() - new Date(startTime).getTime()
            ) / 1000
        ))
    )
}
export function calculateTime(savedTimeSeconds: number, startTime: null | Date) {
    return startTime === null
        ?
        Number(savedTimeSeconds)
        :
        calculateRunningTime(savedTimeSeconds, startTime)

}

export function toHHMMSS(secs: number) {
    var sec_num = parseInt(secs + '', 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":")
}


export function toTime(date: string) {
    if (date === '') {
        return '';
    }
    let _date = new Date(date);
    if (_date.toString() === 'Invalid Date') {
        return date;
    }
    return _date.toLocaleString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Vienna'
    });
}

export function round(value: number, step: number = 0.1) {
    step || (step = 1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
}

export function getColor(index: number) {
    return ['#D74F33', '#7C0380', '#CC0099', '#FF6600', '#1E8C93', '#009900', '#D74F33',
        '#D31900', '#2F0093', '#CC3300', '#002254', '#9d0000', '#006B8F', '#3f0e0e', '#0066FF',
        '#338533', '#0066CC'
    ][index];
}