import { TaskPriority, TaskStatus } from '@/common/enums/enums';
import * as z from 'zod';

export const taskShmema = z.object({
    description: z.string().nullable(),
    title: z.string(),
    status: z.enum(TaskStatus),
    priority: z.enum(TaskPriority),
    startDate: z.iso.datetime().nullable(),
    deadline: z.string().nullable(),
    id: z.string(),
    todoListId: z.string(),
    order: z.number(),
    addedDate: z.iso.datetime({ local: true }),
});
