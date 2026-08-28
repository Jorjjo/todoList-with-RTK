import { CreateItemForm, EditableSpan } from '@/common/components';
import { todolistsApi } from '@/features/todolists/api/todolistsApi';
import type { Todolist } from '@/features/todolists/api/todolistsApi.types';
import {
    type ChangeEvent,
    type CSSProperties,
    useEffect,
    useState,
} from 'react';
import Checkbox from '@mui/material/Checkbox';
import { tasksApi } from '@/features/todolists/api/tasksApi';
import {
    DomainTask,
    UpdateTaskModel,
} from '@/features/todolists/api/tasksApi.types';
import { TaskStatus } from '@/common/enums/enums';

export const AppHttpRequests = () => {
    const [todolists, setTodolists] = useState<Todolist[]>([]);
    const [tasks, setTasks] = useState<Record<string, DomainTask[]>>({});

    useEffect(() => {
        todolistsApi.getTodolists().then((res) => {
            const newTodolists = res.data;
            setTodolists(newTodolists);

            console.log('1, useEffect, setTodolists', {
                newTodolists,
                todolists,
                tasks,
            });

            newTodolists.forEach((list) => {
                tasksApi.getTasks(list.id).then((res) => {
                    setTasks((prevTasks) => ({
                        ...prevTasks,
                        [list.id]: res.data.items,
                    }));
                    console.log('2, useEffect, setTasks', {
                        newTasks: { ...tasks, [list.id]: res.data.items },
                        todolists,
                        tasks,
                    });
                });
            });
        });
    }, []);

    const createTodolist = (title: string) => {
        todolistsApi.createTodolist(title).then((res) => {
            const newTodolist = res.data.data.item;
            setTodolists([newTodolist, ...todolists]);
            setTasks({ ...tasks, [res.data.data.item.id]: [] });
            console.log('AHTUNG!!!! 3, createTodolist');
        });
    };

    const deleteTodolist = (id: string) => {
        todolistsApi.deleteTodolist(id).then(() => {
            console.log('AHTUNG!!!! 4, deleteTodolist');
            setTodolists(todolists.filter((todolist) => todolist.id !== id));
        });
    };

    const changeTodolistTitle = (id: string, title: string) => {
        todolistsApi.changeTodolistTitle({ id, title }).then(() => {
            console.log('AHTUNG!!!! 5, changeTodolistTitle');

            setTodolists(
                todolists.map((todolist) =>
                    todolist.id === id ? { ...todolist, title } : todolist,
                ),
            );
        });
    };

    const createTask = (todolistId: string, title: string) => {
        tasksApi.createTask({ todolistId, title }).then((res) => {
            console.log('AHTUNG!!!! 6, createTask');
            setTasks({
                ...tasks,
                [todolistId]: [res.data.data.item, ...tasks[todolistId]],
            });
        });
    };

    const deleteTask = (todolistId: string, taskId: string) => {
        tasksApi.deleteTask({ todolistId, taskId }).then(() => {
            const filteredTasks = tasks[todolistId].filter(
                (task) => task.id !== taskId,
            );
            console.log('AHTUNG!!!! 7, deleteTask');
            setTasks({ ...tasks, [todolistId]: filteredTasks });
        });
    };

    const changeTaskStatus = (
        e: ChangeEvent<HTMLInputElement>,
        task: DomainTask,
    ) => {
        const model: UpdateTaskModel = {
            title: task.title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status: e.target.checked ? TaskStatus.Completed : TaskStatus.New,
        };

        tasksApi
            .updateTask({ todolistId: task.todoListId, taskId: task.id, model })
            .then((res) => {
                console.log('AHTUNG!!!! 7, updateTask');
                setTasks({
                    ...tasks,
                    [task.todoListId]: tasks[task.todoListId].map((el) =>
                        el.id === task.id ? res.data.data.item : el,
                    ),
                });
            });
    };

    const changeTaskTitle = (task: DomainTask, title: string) => {
        const model: UpdateTaskModel = {
            title: title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status: task.status,
        };

        tasksApi
            .updateTask({
                todolistId: task.todoListId,
                taskId: task.id,
                model,
            })
            .then((res) => {
                setTasks({
                    ...tasks,
                    [task.todoListId]: tasks[task.todoListId].map((el) =>
                        el.id === task.id ? res.data.data.item : el,
                    ),
                });
            });
    };

    return (
        <div style={{ margin: '20px' }}>
            <CreateItemForm onCreateItem={createTodolist} />
            {todolists.map((todolist) => (
                <div key={todolist.id} style={container}>
                    <div>
                        <EditableSpan
                            value={todolist.title}
                            onChange={(title) =>
                                changeTodolistTitle(todolist.id, title)
                            }
                        />
                        <button onClick={() => deleteTodolist(todolist.id)}>
                            x
                        </button>
                    </div>
                    <CreateItemForm
                        onCreateItem={(title) => createTask(todolist.id, title)}
                    />
                    {tasks[todolist.id]?.map((task: any) => (
                        <div key={task.id}>
                            <Checkbox
                                checked={task.status === TaskStatus.Completed}
                                onChange={(e) => changeTaskStatus(e, task)}
                            />
                            <EditableSpan
                                value={task.title}
                                onChange={(title) =>
                                    changeTaskTitle(task, title)
                                }
                            />
                            <button
                                onClick={() => deleteTask(todolist.id, task.id)}
                            >
                                x
                            </button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const container: CSSProperties = {
    border: '1px solid black',
    margin: '20px 0',
    padding: '10px',
    width: '330px',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
};
