import { TaskStatus } from '@/common/enums/enums';
import { createAppSlice } from '@/common/utils';
import {
    createTodolistTC,
    deleteTodolistTC,
} from '@/features/todolists/model/todolists-slice.ts';
import { tasksApi } from '../api/tasksApi';
import { DomainTask, UpdateTaskModel } from '../api/tasksApi.types';
import { setStatusAC } from '@/app/app-slice';

export type TasksState = Record<string, DomainTask[]>;
type UpdateTaskChanges = Partial<UpdateTaskModel>;

export const tasksSlice = createAppSlice({
    name: 'tasks',
    initialState: {} as TasksState,
    reducers: (create) => ({
        fetchTasksTC: create.asyncThunk(
            async (todolistId: string, { rejectWithValue, dispatch }) => {
                try {
                    dispatch(setStatusAC({ status: 'loading' }));
                    const res = await tasksApi.getTasks(todolistId);
                    dispatch(setStatusAC({ status: 'succeeded' }));
                    return { todolistId, tasks: res.data.items };
                } catch (error) {
                    dispatch(setStatusAC({ status: 'failed' }));
                    return rejectWithValue(null);
                }
            },
            {
                fulfilled: (state, action) => {
                    state[action.payload.todolistId] = action.payload.tasks;
                },
            },
        ),
        createTaskTC: create.asyncThunk(
            async (
                args: { todolistId: string; title: string },
                { rejectWithValue, dispatch },
            ) => {
                try {
                    dispatch(setStatusAC({ status: 'loading' }));
                    const response = await tasksApi.createTask(args);
                    const task = response.data.data.item;
                    dispatch(setStatusAC({ status: 'succeeded' }));
                    return task;
                } catch (error) {
                    dispatch(setStatusAC({ status: 'failed' }));
                    return rejectWithValue(null);
                }
            },
            {
                fulfilled: (state, action) => {
                    state[action.payload.todoListId].unshift(action.payload);
                },
            },
        ),
        deleteTaskTC: create.asyncThunk(
            async (
                args: { todolistId: string; taskId: string },
                { rejectWithValue },
            ) => {
                try {
                    await tasksApi.deleteTask(args);
                    return args;
                } catch (error) {
                    return rejectWithValue(null);
                }
            },
            {
                fulfilled: (state, action) => {
                    const tasks = state[action.payload.todolistId];
                    const index = tasks.findIndex(
                        (task) => task.id === action.payload.taskId,
                    );
                    if (index !== -1) {
                        tasks.splice(index, 1);
                    }
                },
            },
        ),
        // changeTaskStatusTC: create.asyncThunk(
        //     async (
        //         args: { task: DomainTask; status: TaskStatus },
        //         { rejectWithValue },
        //     ) => {
        //         try {
        //             const res = await tasksApi.updateTask({
        //                 taskId: args.task.id,
        //                 todolistId: args.task.todoListId,
        //                 model: { ...args.task, status: args.status },
        //             });
        //             return res.data.data.item;
        //         } catch (error) {
        //             return rejectWithValue(null);
        //         }
        //     },
        //     {
        //         fulfilled: (state, action) => {
        //             const task = state[action.payload.todoListId].find(
        //                 (task) => task.id === action.payload.id,
        //             );
        //             if (task) {
        //                 task.status = action.payload.status;
        //             }
        //         },
        //     },
        // ),
        // changeTaskTitleTC: create.asyncThunk(
        //     async (
        //         args: { task: DomainTask; title: string },
        //         { rejectWithValue },
        //     ) => {
        //         try {
        //             const res = await tasksApi.updateTask({
        //                 taskId: args.task.id,
        //                 todolistId: args.task.todoListId,
        //                 model: { ...args.task, title: args.title },
        //             });
        //             return res.data.data.item;
        //         } catch (error) {
        //             return rejectWithValue(null);
        //         }
        //     },
        //     {
        //         fulfilled: (state, action) => {
        //             const task = state[action.payload.todoListId].find(
        //                 (task) => task.id === action.payload.id,
        //             );
        //             if (task) {
        //                 task.title = action.payload.title;
        //             }
        //         },
        //     },
        // ),
        updateTaskTC: create.asyncThunk(
            async (
                args: {
                    task: DomainTask;
                    changes: Partial<UpdateTaskModel>;
                },
                { rejectWithValue, dispatch },
            ) => {
                try {
                    dispatch(setStatusAC({ status: 'loading' }));
                    const res = await tasksApi.updateTask({
                        taskId: args.task.id,
                        todolistId: args.task.todoListId,
                        model: {
                            title: args.task.title,
                            description: args.task.description,
                            status: args.task.status,
                            priority: args.task.priority,
                            startDate: args.task.startDate,
                            deadline: args.task.deadline,

                            ...args.changes,
                        },
                    });
                    dispatch(setStatusAC({ status: 'succeeded' }));
                    return res.data.data.item;
                } catch (error) {
                    dispatch(setStatusAC({ status: 'failed' }));
                    return rejectWithValue(null);
                }
            },
            {
                fulfilled: (state, action) => {
                    const updatedTask = action.payload;

                    const task = state[updatedTask.todoListId].find(
                        (task) => task.id === updatedTask.id,
                    );

                    if (task) {
                        Object.assign(task, updatedTask);
                    }
                },
            },
        ),
    }),
    extraReducers: (builder) => {
        builder
            .addCase(createTodolistTC.fulfilled, (state, action) => {
                state[action.payload.id] = [];
            })
            .addCase(deleteTodolistTC.fulfilled, (state, action) => {
                delete state[action.payload.id];
            });
    },

    selectors: {
        selectTasks: (state) => state,
    },
});

export const { createTaskTC, deleteTaskTC, fetchTasksTC, updateTaskTC } =
    tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
export const { selectTasks } = tasksSlice.selectors;

// export const tasksSlice = createAppSlice({
//     name: 'tasks',
//     initialState: {} as TasksState,
//     reducers: (create) => ({
//         deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>(
//             (state, action) => {
//                 const tasks = state[action.payload.todolistId];
//                 const index = tasks.findIndex(
//                     (task) => task.id === action.payload.taskId,
//                 );
//                 if (index !== -1) {
//                     tasks.splice(index, 1);
//                 }
//             },
//         ),
//         createTaskAC: create.reducer<{ todolistId: string; title: string }>(
//             (state, action) => {
//                 const newTask: Task = {
//                     title: action.payload.title,
//                     isDone: false,
//                     id: nanoid(),
//                 };
//                 state[action.payload.todolistId].unshift(newTask);
//             },
//         ),
//         changeTaskStatusAC: create.reducer<{
//             todolistId: string;
//             taskId: string;
//             isDone: boolean;
//         }>((state, action) => {
//             const task = state[action.payload.todolistId].find(
//                 (task) => task.id === action.payload.taskId,
//             );
//             if (task) {
//                 task.isDone = action.payload.isDone;
//             }
//         }),
//         changeTaskTitleAC: create.reducer<{
//             todolistId: string;
//             taskId: string;
//             title: string;
//         }>((state, action) => {
//             const task = state[action.payload.todolistId].find(
//                 (task) => task.id === action.payload.taskId,
//             );
//             if (task) {
//                 task.title = action.payload.title;
//             }
//         }),
//     }),
//     extraReducers: (builder) => {
//         builder
//             .addCase(createTodolistTC.fulfilled, (state, action) => {
//                 state[action.payload.id] = [];
//             })
//             .addCase(deleteTodolistTC.fulfilled, (state, action) => {
//                 delete state[action.payload.id];
//             });
//     },

//     selectors: {
//         selectTasks: (state) => state,
//     },
// });
