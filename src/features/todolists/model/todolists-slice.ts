import { createAppSlice } from '@/common/utils';
import { Todolist } from '../api/todolistsApi.types';
import { todolistsApi } from '../api/todolistsApi';
import { setStatusAC } from '@/app/app-slice';

export type DomainTodolist = Todolist & { filter: FilterValues };
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
                    const newTodolists = res.data;
                    dispatch(setStatusAC({ status: 'succeeded' }));
                    return { todolists: newTodolists };
                } catch (error: any) {
                    dispatch(setStatusAC({ status: 'failed' }))
                    return rejectWithValue(error.message);
                }
            },
            {
                fulfilled: (_state, action) => {
                    return action.payload.todolists.map((list) => ({
                        ...list,
                        filter: 'all',
                    }));
                },
            },
        ),

        createTodolistTC: create.asyncThunk(
            async (args: { title: string }, { rejectWithValue }) => {
                try {
                    const response = await todolistsApi.createTodolist(args);
                    return response.data.data.item;
                } catch (error: any) {
                    return rejectWithValue(error.message);
                }
            },
            {
                fulfilled: (state, action) => {
                    const newTodoList: DomainTodolist = {
                        ...action.payload,
                        filter: 'all',
                    };
                    state.push(newTodoList);
                },
            },
        ),
        changeTodolistTitleTC: create.asyncThunk(
            async (
                args: { id: string; title: string },
                { rejectWithValue },
            ) => {
                try {
                    await todolistsApi.changeTodolistTitle(args);
                    return args;
                } catch (error: any) {
                    return rejectWithValue(error.message);
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
            async (args: { id: string }, { rejectWithValue }) => {
                try {
                    await todolistsApi.deleteTodolist(args);
                    return args;
                } catch (error: any) {
                    return rejectWithValue(error.message);
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
