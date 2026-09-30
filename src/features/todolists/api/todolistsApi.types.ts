import z from 'zod';
import { todolistSchema } from '../model/todolist.schema';

export type Todolist = z.infer<typeof todolistSchema>;
