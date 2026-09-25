import { TaskPriority } from '@/common/enums/enums';
import z from 'zod';
import { taskShmema } from '../model/task.schema';

export type DomainTask = z.infer<typeof taskShmema>;

export type UpdateTaskModel = {
    description: string | null;
    title: string;
    status: number;
    priority: TaskPriority;
    startDate: string | null;
    deadline: string | null;
};
export type GetTasksResponse = {
    error: string | null;
    totalCount: number;
    items: DomainTask[];
};
