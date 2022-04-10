import React from 'react';
import './App.css';

interface ITask {
    name: string,
    time: number,
    startTime: null | Date,
}

interface IProject {
    name: string,
    time: number,
    startTime: null | Date,
    tasks?: ITask[],
}

let timer: any = null;
interface IDay {
    date: string,
    start: string;
    end: string;
    projects: IProject[];
    isHoliday?:boolean;
}

type IDays = IDay[];
let initDays: IDays = [
    {
        date: toDate(new Date()),
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
                time:0,
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
                        time:200,
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
                time:0,
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
                        time:200,
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
                time:0,
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

if(localStorage.getItem('days') === null) {
    setDays(initDays);
} else {
    const today = toDate(new Date());
    const days = getDays();
    if(days.length === 0 || days[0].date !== today) {
        days.unshift(JSON.parse(JSON.stringify(days[0])));
        setDays(days);
    }
}

function setDays(days: IDays) {
    localStorage.setItem('days', JSON.stringify(days));
}

function getDays(): IDays {
    const _d = localStorage.getItem('days') + '';
    return JSON.parse(_d);
}

function toDate(date: Date) {
    return date.toLocaleDateString("en-US");
}

export default function Foo() {

    let days = getDays();

    const [running, setRunning] = React.useState(['','']);

    React.useEffect(() => {
        const today = days[0];
        let projectRunning = '';
        let taskRunning = '';
        today.projects.forEach(p => {
            if(p.startTime != null) {
                projectRunning = p.name;
                p.tasks?.forEach(t => {
                    if(t.startTime != null) {
                        taskRunning = t.name;
                    }
                })
            }
        });
        setRunning([projectRunning, taskRunning]);

    },[]);

    const [random, setRandom]= React.useState(Math.random());

    function render(days: IDays) {
        setDays(days);
        console.log(days);
        setRandom(Math.random()); // will trigger rerender(days)!
    }

    React.useEffect(() => {
        clearInterval(timer);
        if(running[0] !== '') {
            setRandom(Math.random());
            timer = setInterval(() => {
                render(getDays());
            },500);
        }
    },[running]);



    return <div className={'days'}>
        <h2>CATS Timer</h2>
        {days.filter(d => d.date === toDate(new Date())).map(day => {
            return <div className={'day'} key={day.date}>
                <h3>Today {day.date}</h3>
                <div className={'start-field'}>
                    <div>Start of the work day</div>
                    <input
                        className={day.start !== '' && day.end === '' ? 'running' : ''}
                        onChange={event =>  {
                            const value = event.target.value;
                            if(value !== '') {
                                try {
                                    const start = new Date();
                                    const timeArray = (value+'').split(':');
                                    start.setHours(Number(timeArray[0]));
                                    start.setMinutes(Number(timeArray[1]));
                                    start.setSeconds(Number(timeArray[2]));
                                    const startISOString = start.toISOString();
                                    day.start = startISOString;
                                } catch(e) {
                                    day.start = value;
                                }
                            } else {
                                day.start = value;
                            }

                            day.end = '';
                            render(days);
                        }}
                        value={toTime(day.start)}
                    />
                    <div className={'hint'}>If empty, time will be set automatically when clicking on a project or a task</div>
                </div>
                <div className={'end-field'}>
                    <div>End of the work day</div>
                    <input
                        className={day.end !== '' ? 'stop' : ''}
                        onChange={event =>  {
                            const value = event.target.value;
                            if(value !== '') {
                                try {
                                    const end = new Date();
                                    const timeArray = (value+'').split(':');
                                    end.setHours(Number(timeArray[0]));
                                    end.setMinutes(Number(timeArray[1]));
                                    end.setSeconds(Number(timeArray[2]));
                                    const startISOString = end.toISOString();
                                    day.end = startISOString;
                                } catch(e) {
                                    day.end = value;
                                }
                            } else {
                                day.end = value;
                            }
                            render(days);
                        }}
                        value={toTime(day.end)}
                    />
                    <button
                        className={day.end !== '' ? 'stop' : ''}
                        onClick={() =>  {
                            day.end = new Date().toISOString();

                            day.projects.forEach(project => {
                                project.time = calculateRunningTime(project.time, project.startTime);
                                project.startTime = null;
                                project.tasks?.forEach(t => {
                                    t.time = calculateRunningTime(t.time, t.startTime);
                                    t.startTime = null;
                                });
                            });
                            setRunning(['', '']);
                            render(days);
                        }}
                    >
                        end
                    </button>
                    <div className={'hint'}>Value will always be removed when project or task will be started</div>
                </div>
                <div className={'projects'}>
                    {day.projects.map(project => {
                        const areTaskNotEmpty = project.tasks && project.tasks.length > 0;
                        const projectTime = calculateTime(project.time, project.startTime);
                        return <div key={project.name} className={project.startTime ? 'project running':'project'}>
                            <div
                                className={'description'}
                                onClick={project.startTime ? event => {
                                    // stop project


                                    project.startTime = null;
                                    project.time = projectTime;
                                    project.tasks?.forEach(t => {
                                        t.time = calculateRunningTime(t.time, t.startTime);
                                        t.startTime = null;
                                    });
                                    day.end = '';

                                    setRunning(['', '']);
                                    render(days);
                                    event.preventDefault();
                                } : event => {
                                    // start project


                                    day.projects.forEach(p => {
                                        p.time = calculateRunningTime(p.time, p.startTime);
                                        p.startTime = null;
                                        p.tasks?.forEach(t => {
                                            t.time = calculateRunningTime(t.time, t.startTime);
                                            t.startTime = null;
                                        });
                                    });

                                    project.startTime = new Date();
                                    project.time = projectTime;

                                    if(day.start === ''){
                                        day.start = new Date().toISOString();
                                    }

                                    day.end = '';

                                    setRunning([project.name, '']);
                                    render(days);
                                    event.preventDefault();
                                }}
                            >
                                <span className={'name'}>{project.name}</span>
                                <span className={'time'}>{toHHMMSS(projectTime)}</span>
                                {!areTaskNotEmpty && <button
                                    className={'delete'}
                                    onClick={event => {
                                        if (confirm("Are you sure!") == false) {
                                            event.preventDefault();
                                            return;
                                        }
                                        day.projects = day.projects.filter(p => p.name !== project.name);
                                        render(days);
                                    }}
                                >
                                    +
                                </button>}
                            </div>
                            {areTaskNotEmpty && <div className={'tasks'}>
                                {project.tasks?.map(task => {
                                    const taskTime = calculateTime(task.time, task.startTime);
                                    return <div
                                        key={task.name}
                                        className={task.startTime ? 'task running':'task'}
                                        onClick = {task.startTime ? event => {
                                            // stop task

                                            project.startTime = null;
                                            project.time = projectTime;
                                            task.startTime = null;
                                            task.time = taskTime;
                                            day.end = '';

                                            setRunning(['', '']);
                                            render(days);

                                            event.preventDefault();


                                        } : event => {
                                            // start task


                                            day.projects.forEach(p => {
                                                p.time = calculateRunningTime(p.time, p.startTime);
                                                p.startTime = null;

                                                p.tasks?.forEach(t => {
                                                    t.time = calculateRunningTime(t.time, t.startTime);
                                                    t.startTime = null;
                                                });
                                            });

                                            project.startTime = new Date();
                                            task.startTime = new Date();

                                            if(day.start === ''){
                                                day.start = new Date().toISOString();
                                            }

                                            day.end = '';

                                            setRunning([project.name, task.name]);
                                            render(days);

                                            event.preventDefault();
                                        }
                                        }
                                    >
                                        <span className={'name'}>{task.name}</span>
                                        <span className={'time'}>{toHHMMSS(taskTime)}</span>
                                        <button
                                            className={'delete'}
                                            onClick={event => {
                                                if (confirm("Are you sure!") == false) {
                                                    event.preventDefault();
                                                    return;
                                                }
                                                project.tasks = project?.tasks?.filter(t => t.name !== task.name);
                                                render(days);
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                })}
                            </div>}
                        </div>;
                    })}
                    <div className={'new'}>
                        <h4>Add new</h4>
                        <div>Project or task name*</div>
                        <input
                            id={'add-new'}
                            className={'name'}
                        />
                        <br />
                        <div>
                            Select project (optional)
                        </div>
                        <select
                            id={'projects-selection'}
                            className={'projects-selection'}
                            placeholder={'Project name (optional)'}
                        >
                            <option value={''}></option>
                            {day.projects.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </select>
                        <div className={'hint'}>If empty, a project will be added, otherwise a task of a selected project will be created</div>
                        <br/>
                        <button onClick={()=>{
                            const inputEl:any = document.getElementById('add-new');
                            const name = inputEl.value;
                            const selectEl:any = document.getElementById('projects-selection');
                            const projectName = selectEl.value;
                            if(name === '') {
                                return;
                            }
                            if(projectName === '') {
                                day.projects.push({
                                    startTime: null,
                                    time: 0,
                                    name: name,
                                });
                                inputEl.value = '';
                            } else {
                                const currentProject = day.projects.filter(p => p.name === projectName)[0];
                                if(currentProject?.tasks == null) {
                                    currentProject.tasks = [];
                                }

                                currentProject.tasks.push({
                                    startTime: null,
                                    time: 0,
                                    name: name,
                                });
                                inputEl.value = '';
                                selectEl.value = '';
                            }

                            render(days);
                        }}>+</button>
                    </div>
                </div>
            </div>;
        })}
        <h3>HISTORY</h3>
        <div className={'days history'}>
            {days.filter(d => d.date !== toDate(new Date())).map(day => {
                return <div className={'day history'} key={day.date}>
                    <h3>{day.date} {toTime(day.start)} - {toTime(day.end)}</h3>
                    <div>
                        {day.projects.filter(p => p.time !== 0).map(project => {
                            return <div className={'project history'} key={project.name}>
                                <span>{project.name}</span>
                                <span>{round(toHours(project.time), 0.01)}</span>
                                <span>≅ {round(toHours(project.time), 0.5)}</span>
                            </div>
                        })}
                    </div>
                    <button
                        className={'delete'}
                        onClick={event => {
                            if (confirm("Are you sure!") == false) {
                                event.preventDefault();
                                return;
                            }

                            render(days.filter(d => d.date !== day.date));
                        }}
                    >
                        +
                    </button>
                </div>;
            })}
        </div>
    </div>;
}

function toHours(seconds: number) {
    return Number((seconds / (60*60)).toFixed(2));
}

function calculateRunningTime(savedTimeSeconds: number, startTime: null | Date) {
    const now = new Date();
    if(startTime === null) {
        return savedTimeSeconds;
    }
    return (
        Math.floor(Number(savedTimeSeconds) + (
            (
                now.getTime() - new Date(startTime).getTime()
            )/1000
        ))
    )
}
function calculateTime(savedTimeSeconds: number, startTime: null | Date) {
    return startTime === null
        ?
        Number(savedTimeSeconds)
        :
        calculateRunningTime(savedTimeSeconds, startTime)

}

function toHHMMSS(secs: number) {
    var sec_num = parseInt(secs+'', 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}


function toTime(date: string) {
    if(date === '') {
        return '';
    }
    let _date = new Date(date);
    if(_date.toString() === 'Invalid Date') {
        return date;
    }
    return _date.toLocaleString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Vienna'
    });
}

function round(value: number, step: number = 0.1) {
    step || (step = 1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
}