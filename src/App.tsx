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
import useLongPress from './useLongPress';


let timer: any = null;

initLocalStorage();

export default function Foo() {

    let days = getDays();

    const [running, setRunning] = React.useState(['', '']);

    function handleClickOnDays(event: any, isLongPress = false) {
        const el = event.target.closest('.action');
        if(el == null) {
            return;
        }
        const classList = el.classList;
        const projectIndex = Number(el.getAttribute('data-project-index'));
        const taskIndex = Number(el.getAttribute('data-task-index'));
        const dayIndex = Number(el.getAttribute('data-day-index'));
        const days = getDays();
        const day = days[dayIndex];
        const project = days[dayIndex].projects[projectIndex];
        const areTaskNotEmpty = project.tasks && project.tasks.length > 0;
        const tasks = project.tasks || [];
        const task = tasks[taskIndex];
        const projectTime = project ? calculateTime(project.time, project.startTime) : 0;
        const taskTime = task ? calculateTime(task.time, task.startTime) : 0;

            if(classList.contains('delete')) {
                if (confirm("Are you sure!") == false) {
                    event.preventDefault();
                    return;
                }
                if(classList.contains('project-button')) {
                    day.projects = day.projects.filter(p => p.name !== project.name);
                } else if(classList.contains('task-button')) {
                    project.tasks = project ?.tasks ?.filter(t => t.name !== task.name);
                }
                render(days);
            }
            else if(classList.contains('task-button') && classList.contains('start-stop')) {
                if(task.startTime) {
                    console.log('task button -> stop')
                    project.startTime = null;
                    project.time = projectTime;
                    task.startTime = null;
                    task.time = taskTime;
                    setRunning(['', '']);
                } else {
                    console.log('task button -> start')
                    day.projects.forEach((project, projectIndex) => {
                        project.time = calculateRunningTime(project.time, project.startTime);
                        project.startTime = null;
                        project.tasks ?.forEach(t => {
                            t.time = calculateRunningTime(t.time, t.startTime);
                            t.startTime = null;
                        });
                    });
                    project.startTime = new Date();
                    task.startTime = new Date();
                    setRunning([project.name, task.name]);
                }
                render(days);
            } else if(classList.contains('project-button') && classList.contains('start-stop')) {
                if(!areTaskNotEmpty) {
                    if(project.startTime) {
                        console.log('project button -> stop');
                        project.startTime = null;
                        project.time = projectTime;
                        project.tasks ?.forEach(t => {
                            t.time = calculateRunningTime(t.time, t.startTime);
                            t.startTime = null;
                        });
                        setRunning(['', '']);
                    } else {
                        console.log('project button -> start')
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
                        setRunning([project.name, '']);
                    }
                    render(days);
                }
            } else if(classList.contains('edit-time') && (classList.contains('project-button') || classList.contains('task-button'))) {
                const minutes = isLongPress ? 10 : 1;
                console.log(isLongPress ? 'is long press': 'is click');

                let canUpdateProject = true;
                if(classList.contains('task-button')){
                    if(classList.contains('plus')) {
                        task.time = roundSecondsToMinutes(task.time) + (minutes * 60);
                    } else {
                        const v = roundSecondsToMinutes(task.time);
                        if(v === 0) {
                            canUpdateProject = false;
                            task.time = v;
                        } else {
                            task.time = v - (minutes * 60);
                        }
                    }
                }
                if(canUpdateProject) {
                    if(classList.contains('plus')) {
                        project.time = roundSecondsToMinutes(project.time) + (minutes * 60);
                    } else {
                        project.time = roundSecondsToMinutes(project.time) - (minutes * 60);
                    }
                }
                render(days);
            }

    }

    const handleClickAndLongPress = useLongPress({
        onLongPress: (event) => {
            handleClickOnDays(event, true);
        },
        onClick: (event) => {
            handleClickOnDays(event, false);
        }
    });

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



    return <div
        className={'app'}
    >
        <div className={'app-name'}>/ᐠ｡ꞈ｡ᐟ\ CATS Timer</div>
        <div className={'days'}>

            {days.filter(d => d.date === toDate(new Date())).map((day, dayIndex) => {
                return <div
                    className={'day'}
                    key={day.date}
                >

                    <div className={'today-header'}>
                        <h3>Today {day.date}</h3>
                    </div>
                    <div
                        className={'projects'}
                        {...handleClickAndLongPress}
                    >
                        {day.projects.map((project, projectIndex) => {
                            const areTaskNotEmpty = project.tasks && project.tasks.length > 0;
                            const projectTime = calculateTime(project.time, project.startTime);
                            return <div
                                key={project.name}
                                className={project.startTime ? 'action start-stop project-button project running' : 'action start-stop project-button project'}
                                data-project-name={project.name}
                                data-project-index={projectIndex}
                                data-day-index={0}
                                style={{
                                    borderLeftColor: getColor(projectIndex),
                                    borderRightColor: project.startTime ? getColor(projectIndex) : undefined,
                                    borderTopColor: project.startTime ? getColor(projectIndex) : undefined,
                                    borderBottomColor: project.startTime ? getColor(projectIndex) : undefined,

                                    background: getColor(projectIndex) + '10',
                                }}
                            >
                                <div
                                    className={'description'}
                                >

                                    <span className={'name'}>{project.name}</span>

                                    <div className={'time-container'}>
                                        {!areTaskNotEmpty && <button
                                            className={`action edit-time project-button icon-button minus`}
                                            data-project-name={project.name}
                                            data-project-index={projectIndex}
                                            data-day-index={0}
                                        >-</button>}
                                        <span
                                            className={'time'}
                                        >
                                            {toHHMMSS(projectTime)}
                                            {project.startTime && (project.tasks == null || project.tasks.length === 0) && <div className={'runner'}></div>}
                                        </span>
                                        {!areTaskNotEmpty && <button
                                            className={`action edit-time project-button icon-button plus`}
                                            data-project-name={project.name}
                                            data-project-index={projectIndex}
                                            data-day-index={dayIndex}
                                        >+</button>}
                                    </div>


                                    {!areTaskNotEmpty && <button
                                        className={'action project-button delete'}
                                        data-project-name={project.name}
                                        data-project-index={projectIndex}
                                        data-day-index={dayIndex}
                                    >
                                        <DeleteIcon/>
                                </button>}
                                </div>
                                {areTaskNotEmpty && <div className={'tasks'}>
                                    {project.tasks ?.map((task, taskIndex) => {
                                        const taskTime = calculateTime(task.time, task.startTime);
                                        return <div
                                            key={task.name}
                                            className={task.startTime ? 'action start-stop task-button task running' : 'action start-stop task-button task'}
                                            data-project-name={project.name}
                                            data-project-index={projectIndex}
                                            data-task-index={taskIndex}
                                            data-day-index={dayIndex}
                                        >
                                            <span className={'name'}>{task.name}</span>
                                            <div className={'time-container'}>
                                                <button
                                                    className={`action edit-time task-button icon-button minus`}
                                                    data-project-name={project.name}
                                                    data-project-index={projectIndex}
                                                    data-task-index={taskIndex}
                                                    data-day-index={dayIndex}
                                                >-</button>

                                                <span
                                                    className={'time'}
                                                >
                                                    {toHHMMSS(taskTime)}
                                                    {task.startTime && <div className={'runner'} />}
                                                </span>
                                                <button
                                                    className={'action edit-time task-button icon-button plus'}
                                                    data-project-name={project.name}
                                                    data-project-index={projectIndex}
                                                    data-task-index={taskIndex}
                                                    data-day-index={dayIndex}
                                                >+</button>
                                            </div>

                                            <button
                                                className={'action task-button delete'}
                                                data-project-name={project.name}
                                                data-project-index={projectIndex}
                                                data-task-index={taskIndex}
                                                data-day-index={dayIndex}
                                            >
                                                <DeleteIcon/>
                                        </button>
                                        </div>
                                    })}
                                </div>}
                            </div>;
                        })}
                        <div className={'new'}>
                                <div>
                                    Name*
                                </div>
                                <input
                                    id={'add-new'}
                                    className={'name'}
                                />
                                <br />
                                <div>
                                    Group (optional)
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
                                }}>+ Add new</button>
                            </div>
                    </div>
                </div>;
            })}
            <h3>HISTORY</h3>
            <div className={'days history'}>
                {days.filter(d => d.date !== toDate(new Date())).map(day => {
                    return <div className={'day history'} key={day.date}>
                        <h3>{day.date}</h3>
                        <div>
                            {day.projects.map(project => {
                                const time = round(toHours(project.time), 0.5);
                                if(time === 0) {
                                    return null;
                                }
                                return <div className={'project history'} key={project.name}>
                                    <span>{project.name}</span>
                                    <span>{time === 0 ? '' : time + 'h'}</span>
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
                            <DeleteIcon/>
                    </button>
                    </div>;
                })}
            </div>
        </div>
    </div>;
}


function DeleteIcon() {
    return <img src={'delete-48.png'} />;
}