import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { todolistsApi } from '../api/todolistsApi';
import { Todolist } from '../api/todolistsApi.types';

export type DomainTodolist = Todolist & { filter: FilterValues };
export type FilterValues = 'all' | 'active' | 'completed';

export const todoListsSlice = createSlice({
    name: 'todoLists',
    initialState: [] as DomainTodolist[],

    reducers: (create) => ({
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
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
                return action.payload?.todolists.map((list) => ({
                    ...list,
                    filter: 'all',
                }));
            })
            .addCase(fetchTodolistsTC.rejected, (_state, action) => {
                alert(action.payload);
            })
            .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
                const index = state.findIndex(
                    (todolist) => todolist.id === action.payload.id,
                );
                if (index !== -1) {
                    state[index].title = action.payload.title;
                }
            })
            .addCase(deleteTodolistTC.fulfilled, (state, action) => {
                const index = state.findIndex(
                    (todolist) => todolist.id === action.payload.id,
                );
                if (index !== -1) {
                    state.splice(index, 1);
                }
            })
            .addCase(createTodolistTC.fulfilled, (state, action) => {
                const newTodoList: DomainTodolist = {
                    ...action.payload,
                    filter: 'all',
                };
                state.push(newTodoList);
            });
    },
    selectors: {
        selectTodolists: (state) => state,
    },
});

//thunk / async action
export const fetchTodolistsTC = createAsyncThunk(
    `${todoListsSlice.name}/fetchTodolistsTC`,
    async (_arg, { rejectWithValue }) => {
        try {
            const res = await todolistsApi.getTodolists();
            const newTodolists = res.data;
            return { todolists: newTodolists };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    },
);

export const createTodolistTC = createAsyncThunk(
    `${todoListsSlice.name}/createTodolistTC`,
    async (args: { title: string }, { rejectWithValue }) => {
        try {
            const response = await todolistsApi.createTodolist(args);
            return response.data.data.item;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    },
);

export const changeTodolistTitleTC = createAsyncThunk(
    `${todoListsSlice.name}/changeTodolistTitleTC`,
    async (args: { id: string; title: string }, { rejectWithValue }) => {
        try {
            await todolistsApi.changeTodolistTitle(args);
            return args;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    },
);

export const deleteTodolistTC = createAsyncThunk(
    `${todoListsSlice.name}/deleteTodolistTC`,
    async (args: { id: string }, { rejectWithValue }) => {
        try {
            await todolistsApi.deleteTodolist(args);
            return args;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    },
);
export const { changeTodolistFilterAC} =
    todoListsSlice.actions;
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
