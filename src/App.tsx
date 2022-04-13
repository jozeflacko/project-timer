import React from 'react';
import './App.css';
import {IDays} from "./interfaces";
import {
    getDays,
    initLocalStorage,
    setDays,
    stopPropagation,
    toDate,
    roundSecondsToMinutes,
    round,
    toHours, calculateRunningTime, toTime, toHHMMSS, calculateTime, getColor
} from "./helpers";

let timer: any = null;

initLocalStorage();

export default function Foo() {

    let days = getDays();

    const [running, setRunning] = React.useState(['', '']);
    const [isAddNewOpen, setIsAddNewOpen] = React.useState(false);

    React.useEffect(() => {
        const today = days[0];
        let projectRunning = '';
        let taskRunning = '';
        today.projects.forEach(p => {
            if (p.startTime != null) {
                projectRunning = p.name;
                p.tasks ?.forEach(t => {
                    if (t.startTime != null) {
                        taskRunning = t.name;
                    }
                });
            }
        });
        setRunning([projectRunning, taskRunning]);

    }, []);

    const [random, setRandom] = React.useState(Math.random());

    function render(days: IDays) {
        setDays(days);
        console.log(days);
        setRandom(Math.random()); // will trigger rerender(days)!
    }

    React.useEffect(() => {
        clearInterval(timer);
        if (running[0] !== '') {
            setRandom(Math.random());
            timer = setInterval(() => {
                render(getDays());
            }, 1000);
        }
    }, [running]);



    return <div className={'app'}>
        <div className={'app-name'}>⧖ CATS Timer</div>
        <div className={'days'}>

            {days.filter(d => d.date === toDate(new Date())).map(day => {
                return <div className={'day'} key={day.date}>

                    <div className={'today-header'}>
                        <h3>Today {day.date}</h3>
                        <div className={'start-end'}>
                            <div className={'start-field'}>
                                <div>Start of the work day</div>
                                <div className={'stretch'}>
                                    <input
                                        className={day.start !== '' && day.end === '' ? 'running' : ''}
                                        onChange={event => {
                                            const value = event.target.value;
                                            if (value !== '') {
                                                try {
                                                    const start = new Date();
                                                    const timeArray = (value + '').split(':');
                                                    start.setHours(Number(timeArray[0]));
                                                    start.setMinutes(Number(timeArray[1]));
                                                    start.setSeconds(Number(timeArray[2]));
                                                    const startISOString = start.toISOString();
                                                    day.start = startISOString;
                                                } catch (e) {
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
                                </div>
                                <div className={'hint'}>If empty, time will be set automatically when clicking on a project or a task</div>
                            </div>

                        </div>
                    </div>
                    <div className={'projects'}>
                        {day.projects.map((project, index) => {
                            const areTaskNotEmpty = project.tasks && project.tasks.length > 0;
                            const projectTime = calculateTime(project.time, project.startTime);
                            return <div
                                key={project.name}
                                className={project.startTime ? 'project running' : 'project'}
                                style={{
                                    borderLeftColor: getColor(index),
                                    background: getColor(index) + '10',
                                }}
                            >
                                <div
                                    className={'description'}
                                    onClick={areTaskNotEmpty ? undefined : project.startTime ? event => {
                                        // stop project

                                        project.startTime = null;
                                        project.time = projectTime;
                                        project.tasks ?.forEach(t => {
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
                                            p.tasks ?.forEach(t => {
                                                t.time = calculateRunningTime(t.time, t.startTime);
                                                t.startTime = null;
                                            });
                                        });

                                        project.startTime = new Date();
                                        project.time = projectTime;

                                        if (day.start === '') {
                                            day.start = new Date().toISOString();
                                        }

                                        day.end = '';

                                        setRunning([project.name, '']);
                                        render(days);
                                        event.preventDefault();
                                    }}
                                >
                                    <span className={'name'}>{project.name}</span>

                                    <div>
                                        {!areTaskNotEmpty && <button className={'icon-button'} onClick={e => {
                                            stopPropagation(e);
                                            project.time = roundSecondsToMinutes(project.time) - (1 * 60);
                                            render(days);
                                        }}>-</button>}
                                        <span className={'time'}>{toHHMMSS(projectTime)}</span>
                                        {!areTaskNotEmpty && <button className={'icon-button'} onClick={e => {
                                            stopPropagation(e);
                                            project.time = roundSecondsToMinutes(project.time) + (1 * 60);
                                            render(days);
                                        }}>+</button>}
                                    </div>


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
                                    {project.tasks ?.map(task => {
                                        const taskTime = calculateTime(task.time, task.startTime);
                                        return <div
                                            key={task.name}
                                            className={task.startTime ? 'task running' : 'task'}
                                            onClick={task.startTime ? event => {
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

                                                    p.tasks ?.forEach(t => {
                                                        t.time = calculateRunningTime(t.time, t.startTime);
                                                        t.startTime = null;
                                                    });
                                                });

                                                project.startTime = new Date();
                                                task.startTime = new Date();

                                                if (day.start === '') {
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
                                            <div>
                                                <button className={'icon-button'} onClick={e => {
                                                    stopPropagation(e);
                                                    task.time = roundSecondsToMinutes(task.time) - (1 * 60);
                                                    project.time = roundSecondsToMinutes(project.time) - (1 * 60);
                                                    render(days);
                                                }}>-</button>
                                                <span className={'time'}>{toHHMMSS(taskTime)}</span>
                                                <button className={'icon-button'} onClick={e => {
                                                    stopPropagation(e);
                                                    task.time = roundSecondsToMinutes(task.time) + (1 * 60);
                                                    project.time = roundSecondsToMinutes(project.time) + (1 * 60);
                                                    render(days);
                                                }}>+</button>
                                            </div>

                                            <button
                                                className={'delete'}
                                                onClick={event => {
                                                    if (confirm("Are you sure!") == false) {
                                                        event.preventDefault();
                                                        return;
                                                    }
                                                    project.tasks = project ?.tasks ?.filter(t => t.name !== task.name);
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
                            <button className={'open-add-new'} onClick={()=>{
                                setIsAddNewOpen(!isAddNewOpen);
                            }}>+</button>
                            <div style={{display: isAddNewOpen ? 'block' : 'none'}}>
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
                                <br />
                                <button onClick={() => {
                                    const inputEl: any = document.getElementById('add-new');
                                    const name = inputEl.value;
                                    const selectEl: any = document.getElementById('projects-selection');
                                    const projectName = selectEl.value;
                                    if (name === '') {
                                        return;
                                    }
                                    if (projectName === '') {
                                        day.projects.push({
                                            startTime: null,
                                            time: 0,
                                            name: name,
                                        });
                                        inputEl.value = '';
                                    } else {
                                        const currentProject = day.projects.filter(p => p.name === projectName)[0];
                                        if (currentProject ?.tasks == null) {
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
                    </div>
                    <div className={'end-field'}>
                        <div>End of the work day</div>
                        <div className={'stretch'}>
                            <input
                                className={day.end !== '' ? 'stop' : ''}
                                onChange={event => {
                                    const value = event.target.value;
                                    if (value !== '') {
                                        try {
                                            const end = new Date();
                                            const timeArray = (value + '').split(':');
                                            end.setHours(Number(timeArray[0]));
                                            end.setMinutes(Number(timeArray[1]));
                                            end.setSeconds(Number(timeArray[2]));
                                            const startISOString = end.toISOString();
                                            day.end = startISOString;
                                        } catch (e) {
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
                                onClick={() => {
                                    day.end = new Date().toISOString();

                                    day.projects.forEach(project => {
                                        project.time = calculateRunningTime(project.time, project.startTime);
                                        project.startTime = null;
                                        project.tasks ?.forEach(t => {
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
                        </div>
                        <div className={'hint'}>Value will always be removed when project or task will be started</div>
                    </div>
                </div>;
            })}
            <h3>HISTORY</h3>
            <div className={'days history'}>
                {days.filter(d => d.date !== toDate(new Date())).map(day => {
                    return <div className={'day history'} key={day.date}>
                        <h3>{day.date}</h3>
                        <div>
                            {day.projects.filter(p => p.time !== 0).map(project => {
                                return <div className={'project history'} key={project.name}>
                                    <span>{project.name}</span>
                                    <span>{round(toHours(project.time), 0.5)}h</span>
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
        </div>
    </div>;
}

