import { createAppSlice } from '@/common/utils';
import { Todolist } from '../api/todolistsApi.types';
import { todolistsApi } from '../api/todolistsApi';
import { setStatusAC } from '@/app/app-slice';
import { RequestStatus } from '@/common/types';
import { handleServerError } from '@/common/utils/handleServerError';
import { handleResultCodeError } from '@/common/utils/handleResultCodeError';
import { ResultCode } from '@/common/enums/enums';
import { todolistSchema } from './todolist.schema';

export type DomainTodolist = Todolist & {
    filter: FilterValues;
    entityStatus: RequestStatus;
};
export type FilterValues = 'all' | 'active' | 'completed';

export const todoListsSlice = createAppSlice({
    name: 'todoLists',
    initialState: [] as DomainTodolist[],

    reducers: (create) => ({
        fetchTodolistsTC: create.asyncThunk(
            async (_arg, { rejectWithValue, dispatch }) => {
                try {
                    dispatch(setStatusAC({ status: 'loading' }));
                    const res = await todolistsApi.getTodolists();
                    todolistSchema.array().parse(res.data);
                    const newTodolists = res.data;
                    dispatch(setStatusAC({ status: 'succeeded' }));
                    return { todolists: newTodolists };
                } catch (error) {
                    handleServerError(dispatch, error);
                    return rejectWithValue(null);
                }
            },
            {
                fulfilled: (_state, action) => {
                    return action.payload.todolists.map((list) => ({
                        ...list,
                        filter: 'all',
                        entityStatus: 'idle',
                    }));
                },
            },
        ),

        createTodolistTC: create.asyncThunk(
            async (args: { title: string }, { dispatch, rejectWithValue }) => {
                try {
                    dispatch(setStatusAC({ status: 'loading' }));
                    const response = await todolistsApi.createTodolist(args);
                    if (response.data.resultCode !== ResultCode.Success) {
                        handleResultCodeError(dispatch, response.data);
                        return rejectWithValue(null);
                    }
                    dispatch(setStatusAC({ status: 'succeeded' }));
                    return response.data.data.item;
                } catch (error) {
                    handleServerError(dispatch, error);
                    return rejectWithValue(null);
                }
            },
            {
                fulfilled: (state, action) => {
                    const newTodoList: DomainTodolist = {
                        ...action.payload,
                        filter: 'all',
                        entityStatus: 'idle',
                    };
                    state.push(newTodoList);
                },
            },
        ),
        changeTodolistTitleTC: create.asyncThunk(
            async (
                args: { id: string; title: string },
                { rejectWithValue, dispatch },
            ) => {
                try {
                    dispatch(setStatusAC({ status: 'loading' }));
                    const res = await todolistsApi.changeTodolistTitle(args);
                    if (res.data.resultCode !== ResultCode.Success) {
                        handleResultCodeError(dispatch, res.data);
                        return rejectWithValue(null);
                    }
                    dispatch(setStatusAC({ status: 'succeeded' }));
                    return args;
                } catch (error) {
                    handleServerError(dispatch, error);
                    return rejectWithValue(null);
                }
            },
            {
                fulfilled: (state, action) => {
                    const index = state.findIndex(
                        (todolist) => todolist.id === action.payload.id,
                    );
                    if (index !== -1) {
                        state[index].title = action.payload.title;
                    }
                },
            },
        ),
        deleteTodolistTC: create.asyncThunk(
            async (args: { id: string }, { dispatch, rejectWithValue }) => {
                try {
                    dispatch(setStatusAC({ status: 'loading' }));
                    dispatch(
                        changeTodolistEntityStatusAC({
                            entityStatus: 'loading',
                            id: args.id,
                        }),
                    );
                    const res = await todolistsApi.deleteTodolist(args);
                    if (res.data.resultCode !== ResultCode.Success) {
                        handleResultCodeError(dispatch, res.data);
                        return rejectWithValue(null);
                    }
                    dispatch(setStatusAC({ status: 'succeeded' }));
                    return args;
                } catch (error) {
                    handleServerError(dispatch, error);
                    dispatch(
                        changeTodolistEntityStatusAC({
                            entityStatus: 'idle',
                            id: args.id,
                        }),
                    );
                    return rejectWithValue(null);
                }
            },
            {
                fulfilled: (state, action) => {
                    const index = state.findIndex(
                        (todolist) => todolist.id === action.payload.id,
                    );
                    if (index !== -1) {
                        state.splice(index, 1);
                    }
                },
            },
        ),
        changeTodolistFilterAC: create.reducer<{
            id: string;
            filter: FilterValues;
        }>((state, action) => {
            const todolist = state.find(
                (todolist) => todolist.id === action.payload.id,
            );
            if (todolist) {
                todolist.filter = action.payload.filter;
            }
        }),
        changeTodolistEntityStatusAC: create.reducer<{
            id: string;
            entityStatus: RequestStatus;
        }>((state, action) => {
            const todolist = state.find(
                (todolist) => todolist.id === action.payload.id,
            );
            if (todolist) {
                todolist.entityStatus = action.payload.entityStatus;
            }
        }),
    }),
    selectors: {
        selectTodolists: (state) => state,
    },
});

export const {
    changeTodolistFilterAC,
    fetchTodolistsTC,
    changeTodolistTitleTC,
    createTodolistTC,
    deleteTodolistTC,
    changeTodolistEntityStatusAC,
} = todoListsSlice.actions;
export const todoListReducer = todoListsSlice.reducer;
export const { selectTodolists } = todoListsSlice.selectors;

// export const fetchTodolistsTC = createAsyncThunk(
//     `${todoListsSlice.name}/fetchTodolistsTC`,
//     async (_args, { dispatch }) => {
//         const res = await todolistsApi.getTodolists();
//         const newTodolists = res.data;
//         //2.dispatch sync actions
//         dispatch(setTodolistsAC({ todolists: newTodolists }));
//     },
// );

//thunk / async action
// export const fetchTodolistsTC = createAsyncThunk(
//     `${todoListsSlice.name}/fetchTodolistsTC`,
//     async (_arg, { rejectWithValue }) => {
//         try {
//             const res = await todolistsApi.getTodolists();
//             const newTodolists = res.data;
//             return { todolists: newTodolists };
//         } catch (error: any) {
//             return rejectWithValue(error.message);
//         }
//     },
// );

// export const createTodolistTC = createAsyncThunk(
//     `${todoListsSlice.name}/createTodolistTC`,
//     async (args: { title: string }, { rejectWithValue }) => {
//         try {
//             const response = await todolistsApi.createTodolist(args);
//             return response.data.data.item;
//         } catch (error: any) {
//             return rejectWithValue(error.message);
//         }
//     },
// );

// export const changeTodolistTitleTC = createAsyncThunk(
//     `${todoListsSlice.name}/changeTodolistTitleTC`,
//     async (args: { id: string; title: string }, { rejectWithValue }) => {
//         try {
//             await todolistsApi.changeTodolistTitle(args);
//             return args;
//         } catch (error: any) {
//             return rejectWithValue(error.message);
//         }
//     },
// );

// export const deleteTodolistTC = createAsyncThunk(
//     `${todoListsSlice.name}/deleteTodolistTC`,
//     async (args: { id: string }, { rejectWithValue }) => {
//         try {
//             await todolistsApi.deleteTodolist(args);
//             return args;
//         } catch (error: any) {
//             return rejectWithValue(error.message);
//         }
//     },
// );
