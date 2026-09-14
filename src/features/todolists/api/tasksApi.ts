import { instance } from '@/common/instance';
import {
    DomainTask,
    GetTasksResponse,
    UpdateTaskModel,
} from './tasksApi.types';
import { BaseResponse } from '@/common/types';

export const tasksApi = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(
            `/todo-lists/${todolistId}/tasks`,
        );
    },
    createTask(payload: { title: string; todolistId: string }) {
        const { todolistId, title } = payload;
        return instance.post<BaseResponse<{ item: DomainTask }>>(
            `/todo-lists/${todolistId}/tasks`,
            { title },
        );
    },
    updateTask(payload: {
        taskId: string;
        todolistId: string;
        model: UpdateTaskModel;
    }) {
        const { todolistId, taskId, model } = payload;
        return instance.put<BaseResponse<{ item: DomainTask }>>(
            `/todo-lists/${todolistId}/tasks/${taskId}`,
            model,
        );
    },

    deleteTask(payload: { taskId: string; todolistId: string }) {
        const { todolistId, taskId } = payload;
        return instance.delete<BaseResponse>(
            `/todo-lists/${todolistId}/tasks/${taskId}`,
        );
    },
};
