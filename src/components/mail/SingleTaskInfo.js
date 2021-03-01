import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { DEFAULT_HIGHLIGHTS } from '../../data_objects/Consts.js'
import SimpleBar from 'simplebar-react'
import './SingleTaskInfo.css'
import { AttachmentDisplay } from './FileAttachments.js'
import EmailThread from './EmailThread.js'
import { GroupIcon } from './EmailStamp.js'
import { Menu } from '../external/Menues.js'
import OptionsButton from '../OptionsButton.js'
import PriorityOptions from '../PriorityOptions.js'
import { EmailComposer } from '../EmailComposer.js'
import { send_quick_reply } from '../email_compuser_utils.js'
import { useDispatch, useSelector } from 'react-redux'
import { Update } from '../../actions/tasks'
import { Task } from '../../data_objects/Task'

function SingleTaskInfo(props) {
    return (
        <div className="SingleTaskInfo">
            <div className="header">
                <TopButtons task={props.task} />
                <h1 className="task_text">{props.task.get_text()}</h1>
            </div>
            <div className="scrollable">
                <SimpleBar className="simplebar">
                    <QuickReply to={props.task.get_initiator()} email_id={props.task.email_id} on_close={props.close} />
                    <People watching={props.thread.get_participants()}
                        owner={props.task.get_owner()} />
                    <Highlights highlights={DEFAULT_HIGHLIGHTS} />
                    <RelevantResources resources={props.thread.get_attachments()} />
                    <SourceConversation thread={props.thread} />
                </SimpleBar>
            </div>
        </div>
    );
}

export default function TaskInfoWrapper(props) {
    const task = useSelector(state => state.tasks[props.task_id]);
    if (!props.task_id || !props.thread) {
        return null;
    }
    return ReactDOM.createPortal(
        <div className="TaskInfoWrapper">
            <div className="invisible_close" onClick={props.close} />
            <SingleTaskInfo task={task}{...props} />
        </div>,
        document.getElementById('messages_to_user')
    );
}

function TopButtons(props) {
    const dispatch = useDispatch();
    const task_updater = (task) => dispatch(Update(task));
    const [priority, setPriority] = useState(props.task.get_priority());
    const [task_status, setStatus] = useState(props.task.status);
    const option_button_names = ["Quick Reply", "Set In Calendar", "Add To Topic", "Go To Source", "Mark As Done"];
    var options_buttons = option_button_names.map(n => { return { name: n } });
    options_buttons.filter(n => n.name === "Mark As Done")[0].action = e => my_set_status("Done");
    const task_options = ['To do', 'In progress', 'Pending', 'Done'];
    const my_set_status = (value) => {
        setStatus(value);
        Task.update_task(task_updater, props.task, 'set_status', [value]);
    }
    const my_set_priority = (value) => {
        setPriority(value);
        Task.update_task(task_updater, props.task, 'set_priority', [value]);

    }
    return (
        <div className="TopButtons">
            <div className="task_status">
                <Menu options={task_options} label='' value={task_status} onChange={
                    e => my_set_status(e.value)} />
            </div>
            <OptionsButton options={options_buttons} offset={{ top: 0, left: 15 }} />
            <div className="task_priority">
                <PriorityOptions default_selection={priority} onChange={my_set_priority} />
            </div>
            <span>{props.task.get_formatted_deadline().date}</span>
        </div>
    )
}

function QuickReply(props) {
    const email_attributes = {
        email_id: props.email_id,
        composer_type: 'quick_reply'
    }
    const quick_reply_component =
        <EmailComposer only_content={true}
            id={-1}
            email_attributes={email_attributes}
            content_title={props.to.get_name()}
            send={send_quick_reply}
            on_close={props.on_close}
        />
    return <TitledComponent title="Quick Reply" component={quick_reply_component} class_name={"quick_reply"} />
}

function People(props) {
    const watching =
        <span>
            <div><p> Watching</p></div>
            {GroupIcon(props.watching, 6, 30, 22)}
        </span>

    const owner =
        <span>
            {GroupIcon([props.owner], 1, 50)}
            <div>
                <p className="owner_name">{props.owner.get_name()}</p>
                <p>Owner</p>
            </div>
        </span>

    const people_componenet =
        <div className="People">
            {owner}
            {watching}
        </div>
    return <TitledComponent title="People" component={people_componenet} class_name="People" />
}

function Highlights(props) {
    const highlights =
        <ul> {props.highlights.map(h => <li>{h}</li>)}</ul>

    return <TitledComponent title="Highlights" component={highlights} />
}

function RelevantResources(props) {
    if (props.resources.length === 0) {
        return null;
    }
    const attachemnts_for_display =
        <div className="RelevantResources">
            {props.resources.map(a => <AttachmentDisplay attachment={a} />)}
        </div>

    return <TitledComponent title="Relevant Resources" component={attachemnts_for_display} />
}

function SourceConversation(props) {
    const email_thread_component = <EmailThread id={props.thread.get_id()} thread={props.thread} is_selected={false}
        handle_select={() => { }} priority={null} options_offset={{ top: 0, left: -160 }} />
    return <TitledComponent title="Source Conversation" component={email_thread_component} />
}

function TitledComponent(props) {
    let general_class_name = "general_component";
    if (props.class_name) {
        general_class_name += " " + props.class_name;
    }
    return (
        <div className="TitledComponent">
            <h4 className="title">{props.title}</h4>
            <div className={general_class_name} >
                {props.component}
            </div>
        </div>
    );
}

