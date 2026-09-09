import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import { useAppDispatch } from '@/common/hooks';
import {
    deleteTaskTC,
    updateTaskTC,
} from '@/features/todolists/model/tasks-slice';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import type { ChangeEvent } from 'react';
import { getListItemSx } from './TaskItem.styles';
import { DomainTask } from '@/features/todolists/api/tasksApi.types';
import { TaskStatus } from '@/common/enums/enums';

type Props = {
    task: DomainTask;
    todolistId: string;
};

export const TaskItem = ({ task, todolistId }: Props) => {
    const dispatch = useAppDispatch();

    const deleteTask = () => {
        dispatch(deleteTaskTC({ todolistId, taskId: task.id }));
    };

    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
        const newStatusValue = e.currentTarget.checked
            ? TaskStatus.Completed
            : TaskStatus.New;
        dispatch(updateTaskTC({ task, changes: { status: newStatusValue } }));
    };

    const changeTaskTitle = (title: string) => {
        dispatch(updateTaskTC({ task, changes: { title } }));
    };

    const isTaskCompleted = task.status === TaskStatus.Completed;

    return (
        <ListItem sx={getListItemSx(isTaskCompleted)}>
            <div>
                <Checkbox
                    checked={isTaskCompleted}
                    onChange={changeTaskStatus}
                />
                <EditableSpan value={task.title} onChange={changeTaskTitle} />
            </div>
            <IconButton onClick={deleteTask}>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    );
};
