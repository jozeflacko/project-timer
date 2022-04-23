import React from 'react';
import './App.css';
import {IDay, IDays} from "./interfaces";
import {
    getDays,
    initLocalStorage,
    setDays,
    stopPropagation,
    toDate,
    roundSecondsToMinutes,
    round,
    toHours, calculateRunningTime, toTime, toHHMMSS, calculateTime, getColor, formatStringData
} from "./helpers";
import useLongPress from './useLongPress';


let timer: any = null;

initLocalStorage();

export default function Foo() {

    let days = getDays();

    const appName = 'CATS Timer';
    const removeIntroAfter = (appName.length * 100) + 3500;

    const [running, setRunning] = React.useState(['', '']);
    const [showInto, setShowIntro] = React.useState(false);
    const [editHistory, setEditHistory] = React.useState(false);

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

                let numberOfEditedSeconds = minutes * 60;
                let canUpdateProject = true;
                if(classList.contains('task-button')){
                    if(classList.contains('plus')) {
                        task.time = roundSecondsToMinutes(task.time) + numberOfEditedSeconds;
                    } else {
                        const roundedMinutes = roundSecondsToMinutes(task.time);
                        if(roundedMinutes === 0) {
                            canUpdateProject = false;
                            task.time = roundedMinutes;
                        } else {
                            if(roundedMinutes === 0) {
                                numberOfEditedSeconds = 0;
                                task.time = 0;
                            } else if(roundedMinutes < numberOfEditedSeconds) {
                                numberOfEditedSeconds = task.time;
                            }
                            task.time = roundedMinutes - numberOfEditedSeconds;
                        }
                    }
                }
                if(canUpdateProject) {
                    if(classList.contains('plus')) {
                        project.time = roundSecondsToMinutes(project.time) + numberOfEditedSeconds;
                    } else {
                        const roundedMinutes = roundSecondsToMinutes(project.time);
                        if(roundedMinutes === 0) {
                            numberOfEditedSeconds = 0;
                            project.time = 0;
                        } else if(roundedMinutes < numberOfEditedSeconds) {
                            numberOfEditedSeconds = project.time;
                        }
                        project.time = roundedMinutes - numberOfEditedSeconds;
                    }
                }
                render(days);
            }

    }

    /*(const handleClickAndLongPress = useLongPress({
        onLongPress: (event) => {
            handleClickOnDays(event, true);
        },
        onClick: (event) => {
            handleClickOnDays(event, false);
        }
    });*/
    const handleClickAndLongPress = {
        onClick: (event: any) => {
            handleClickOnDays(event, true);
        }
    }

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
        const showIntro = projectRunning === '' && taskRunning === '';
        if(showIntro) {
            setShowIntro(showIntro);
            setTimeout(()=>{
                setShowIntro(false);
            }, removeIntroAfter);
        }


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

    let introDelay = 1300;

    const todayInArray = days.filter(d => d.date === toDate(new Date()));
    const historyDays = days.filter(d => d.date !== toDate(new Date()));

    function renderEditableDays(days: IDay[], dayIndexOffset: number = 0, isToday:boolean) {
        return days.map((day, dayIndex) => {
                return <div
                    className={'day'}
                    key={day.date}
                >

                    <div className={'today-header'}>
                        <h3>{isToday ? 'Today ' : ''}{day.date}</h3>
                    </div>
                    <div
                        className={'projects'}
                        {...handleClickAndLongPress}
                    >
                        {day.projects.map((project, projectIndex) => {
                            const areTaskNotEmpty = project.tasks && project.tasks.length > 0;
                            const projectTime = calculateTime(project.time, project.startTime);
                            let className = project.startTime ? 'project running' : 'project';
                            if(isToday) {
                                className += ' action start-stop project-button';
                            }
                            return <div
                                key={project.name}
                                className={className}
                                data-project-name={project.name}
                                data-project-index={projectIndex}
                                data-day-index={dayIndex + dayIndexOffset}
                                style={{
                                    borderLeftColor: isToday ? getColor(projectIndex) : 'white',
                                    borderRightColor: project.startTime ? getColor(projectIndex) : undefined,
                                    borderTopColor: project.startTime ? getColor(projectIndex) : undefined,
                                    borderBottomColor: project.startTime ? getColor(projectIndex) : undefined,
                                    background: isToday ? (getColor(projectIndex) + '10') : 'white',
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
                                            data-day-index={dayIndex + dayIndexOffset}
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
                                            data-day-index={dayIndex + dayIndexOffset}
                                        >+</button>}
                                    </div>


                                    {!areTaskNotEmpty && isToday && <button
                                        className={'action project-button delete'}
                                        data-project-name={project.name}
                                        data-project-index={projectIndex}
                                        data-day-index={dayIndex + dayIndexOffset}
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
                                            data-day-index={dayIndex + dayIndexOffset}
                                        >
                                            <span className={'name'}>{task.name}</span>
                                            <div className={'time-container'}>
                                                <button
                                                    className={`action edit-time task-button icon-button minus`}
                                                    data-project-name={project.name}
                                                    data-project-index={projectIndex}
                                                    data-task-index={taskIndex}
                                                    data-day-index={dayIndex + dayIndexOffset}
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
                                                    data-day-index={dayIndex + dayIndexOffset}
                                                >+</button>
                                            </div>

                                            <button
                                                className={'action task-button delete'}
                                                data-project-name={project.name}
                                                data-project-index={projectIndex}
                                                data-task-index={taskIndex}
                                                data-day-index={dayIndex + dayIndexOffset}
                                            >
                                                <DeleteIcon/>
                                            </button>
                                        </div>
                                    })}
                                </div>}
                            </div>;
                        })}
                        {isToday && <div className={'new'}>
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
                            <br />
                            <div className={'buttons'}>
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
                                }}>Add new</button>
                            </div>
                        </div>}
                    </div>
                </div>;
            });
    }

    const historyTableData = transformHistoryToTableData(historyDays);

    return <>
        {showInto && <div
            className={'intro'}
            style={{
                animation: `moveLetterDown 1s ease-in-out ${removeIntroAfter}ms forwards`,
            }}
        >
            {appName.split('').map((ch, index) => {
                if(ch !== '') {
                    introDelay += 80;
                }
                return <span
                    key={ch + index}
                    style={{
                        animation: `moveLetterDown 1s ease-in-out ${introDelay}ms forwards`,
                    }}
                >{ch}</span>
            })}
        </div>}
        <div
            className={showInto ? 'app' : 'app show'}
        >
        <div className={'app-name'}>/ᐠ｡ ｡ᐟ\ {appName}</div>
        <div className={'days'}>

            {renderEditableDays(todayInArray, 0, true)}
            {historyDays.length > 0 && <><h3 className={'history'}>HISTORY</h3>

                <div className={'days history'}>
                    {editHistory ? renderEditableDays(historyDays, 1, false) : <table>
                        {historyTableData.map((row, index) => {
                            if(index === 0) {
                                return <thead key={'header'+index}>
                                    <tr>
                                        {row.map(item => <th
                                            key={'head_'+item+'_'+index}
                                        >{item}</th>)}
                                    </tr>
                                </thead>
                            }
                            return <tbody key={'body'+index}>
                                <tr>
                                    {row.map((item, rowIndex) => <td key={item+'_'+index+rowIndex}>{item}</td>)}
                                </tr>
                            </tbody>

                        })}
                        {historyTableData[0] && <tfoot>
                        <tr>
                            {historyTableData[0].map((item, index) => <td
                                className={index === 0 ? '' : 'delete'}
                                key={'foot_'+item+'_'+index}
                                onClick={()=>{
                                    if(!confirm('Are you sure to delete this '+item+'?')) {
                                        return;
                                    }
                                    days.filter(d => d.date !== item);
                                    render(days);
                                }}
                            >{index === 0 ? '' : <><DeleteIcon/></>}</td>)}
                        </tr>
                        </tfoot>}
                    </table>}
                </div>
            </>}
        </div>
            <div className={editHistory ? 'save-button' : 'edit-button'}>
                {historyDays.length > 0 && <button onClick={()=>{
                    setEditHistory(!editHistory);
                }}>{editHistory ? 'SAVE HISTORY' : 'EDIT HISTORY'}</button>}
            </div>

    </div>
        </>;
}


function DeleteIcon() {
    return <img className="delete-icon" src={'delete-48.png'} />;
}

function transformHistoryToTableData(days: IDays) {

    let daysNames: string[] = [];
    let projectsNamesAsObject: Record<string, null> = {};

    days.forEach(day => {
        daysNames.push(formatStringData(day.date));
        day.projects.forEach(project => {
            projectsNamesAsObject[project.name] = null;
        });
    });
    const projectsNames = Object.keys(projectsNamesAsObject);

    const tableData: string[][] = [['', ...daysNames]];

    projectsNames.forEach((projectName, index)=>{
        const row = [
            projectName,
            ...daysNames
            .map(
                dayName => {
                    const projects = days.filter(d => formatStringData(d.date) === dayName)[0].projects.filter(p => p.name === projectName);
                    if(projects.length === 1) {
                        const project = projects[0];
                        return (round(toHours(project.time), 0.5)+'').split('.').join(',')+'h';
                    }
                    return '';
                }
            )
        ];

        tableData.push(row);
    });
    return tableData;
}