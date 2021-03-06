import React from 'react';
import { PRIORITIES } from '../../data_objects/Consts';
import TaskRow from './TaskRow';
import { GroupedTasksStyle } from './Tasks.style';
import { sort_tasks } from './utils';

export default function GroupedTasks(props) {
    const title = PRIORITIES[props.priority];
    const sorted_tasks = sort_tasks(props.tasks, props.sort_methods);
    const tasks = sorted_tasks.map((t) => (
        <TaskRow
            on_click={props.select_task_id}
            key={t.id}
            task={t}
            task_text={t.text}
            deadline={t.deadline}
            owner={t.owner}
            watchers={t.watchers}
            tags={t.tags}
            priority={props.priority}
            status={t.status}
            on_multiselect={props.on_multiselect}
            multiselected_tasks={props.multiselected_tasks}
        />
    ));
    return tasks.length === 0 ? null : (
        <GroupedTasksStyle priority={props.priority}>
            <p>{title}</p>
            {tasks}
        </GroupedTasksStyle>
    );
}
