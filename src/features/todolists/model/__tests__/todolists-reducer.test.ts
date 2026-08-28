import { nanoid } from '@reduxjs/toolkit';
import { beforeEach, expect, test } from 'vitest';
import {
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    createTodolistAC,
    deleteTodolistAC,
    DomainTodolist,
    todoListReducer,
} from '../todolists-slice';

let todolistId1: string;
let todolistId2: string;
let startState: DomainTodolist[] = [];

beforeEach(() => {
    todolistId1 = nanoid();
    todolistId2 = nanoid();

    startState = [
        {
            id: todolistId1,
            title: 'What to learn',
            filter: 'all',
            addedDate: '22',
            order: 1,
        },
        {
            id: todolistId2,
            title: 'What to buy',
            filter: 'all',
            addedDate: '22',
            order: 2,
        },
    ];
});

test('correct todolist should be deleted', () => {
    const endState = todoListReducer(
        startState,
        deleteTodolistAC({ id: todolistId1 }),
    );

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be created', () => {
    const title = 'New todolist';
    const endState = todoListReducer(startState, createTodolistAC(title));

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(title);
});

test('correct todolist should change its title', () => {
    const title = 'New title';
    const endState = todoListReducer(
        startState,
        changeTodolistTitleAC({ id: todolistId2, title }),
    );

    expect(endState[0].title).toBe('What to learn');
    expect(endState[1].title).toBe(title);
});

test('correct todolist should change its filter', () => {
    const filter = 'completed';
    const endState = todoListReducer(
        startState,
        changeTodolistFilterAC({ id: todolistId2, filter }),
    );

    expect(endState[0].filter).toBe('all');
    expect(endState[1].filter).toBe(filter);
});
