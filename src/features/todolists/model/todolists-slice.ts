import { createSlice, nanoid } from '@reduxjs/toolkit';
import { Todolist } from '../api/todolistsApi.types';

export const todoListsSlice = createSlice({
    name: 'todoLists',
    initialState: [] as DomainTodolist[],

    reducers: (create) => ({
        deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
            const index = state.findIndex(
                (todolist) => todolist.id === action.payload.id,
            );
            if (index !== -1) {
                state.splice(index, 1);
            }
        }),
        changeTodolistTitleAC: create.reducer<{ id: string; title: string }>(
            (state, action) => {
                const index = state.findIndex(
                    (todolist) => todolist.id === action.payload.id,
                );
                if (index !== -1) {
                    state[index].title = action.payload.title;
                }
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

        createTodolistAC: create.preparedReducer(
            (title: string) => {
                const newTodoList: DomainTodolist = {
                    title,
                    filter: 'all',
                    id: nanoid(),
                    addedDate: '22',
                    order: 1,
                };
                return {
                    payload: newTodoList,
                };
            },
            (state, action) => {
                state.push(action.payload);
            },
        ),
    }),
    selectors: {
        selectTodolists: (state) => state,
    },
});

export const {
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    createTodolistAC,
    deleteTodolistAC,
} = todoListsSlice.actions;
export const todoListReducer = todoListsSlice.reducer;
export const { selectTodolists } = todoListsSlice.selectors;

export type DomainTodolist = Todolist & { filter: FilterValues };

export type FilterValues = 'all' | 'active' | 'completed';
