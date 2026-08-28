import { instance } from '@/common/instance';
import type { BaseResponse } from '@/common/types';
import type { Todolist } from './todolistsApi.types';

export const todolistsApi = {
    getTodolists() {
        return instance.get<Todolist[]>('/todo-lists');
    },
    changeTodolistTitle(payload: { id: string; title: string }) {
        const { id, title } = payload;
        return instance.put<BaseResponse>(`/todo-lists/${id}`, { title });
    },
    createTodolist(payload: { title: string }) {
        const { title } = payload;
        return instance.post<BaseResponse<{ item: Todolist }>>('/todo-lists', {
            title,
        });
    },
    deleteTodolist(payload: { id: string }) {
        const { id } = payload;
        return instance.delete<BaseResponse>(`/todo-lists/${id}`);
    },
};
