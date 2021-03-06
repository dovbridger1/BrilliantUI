import React, { Fragment } from 'react';
import EmailTextArea from './EmailTextArea.js';
import { useSelector, useDispatch } from 'react-redux';
import { SHOW_HTML } from '../home/Home.js';
import { EmailStamp } from './EmailStamp.js';
import { Task } from '../../data_objects/Task';
import { Email } from '../../data_objects/Email';
import { Update } from '../../actions/tasks';
import { DeleteEmails, DeleteThread } from '../../actions/email_threads';
import './EmailContainer.css';

export default function EmailContainer(props) {
    const dispatch = useDispatch();
    const emails_deleter = (id, email_ids) =>
        dispatch(DeleteEmails(id, email_ids));
    const user = useSelector((state) => state.user.contact);
    const email = props.email;
    const tasks = useSelector((state) => Object.values(state.tasks)).filter(
        (t) => t.get_email_id() === email.get_id()
    );
    const contacts = email
        .get_receivers()
        .map((receiver) => receiver.image_link);
    var sender = email.get_sender();
    if (!sender) {
        sender = user;
    }
    const is_html = SHOW_HTML && email.get_content_type() === 'html';
    const content = is_html ? email.get_html() : email.get_text();
    const stamp = sender
        ? EmailStamp([sender.image_link], email.date, sender.get_name())
        : null;
    const on_email_delete = () => {
        if (props.thread) {
            props.thread.delete_email(email.get_id(), emails_deleter);
        }
    };
    const on_email_mark_unread = () => email.set_is_read(false);
    const email_text_area = (
        <EmailTextArea
            isUnread={!email.get_is_read()}
            sender_name={sender ? sender.get_name() : null}
            content={content}
            is_html={is_html}
            subject={email.get_subject()}
            of_center_email={true}
            tags={email.get_tags()}
            id={email.get_id()}
            tasks={tasks}
            contacts={contacts}
            on_delete={on_email_delete}
            on_mark_unread={on_email_mark_unread}
            email={email}
        />
    );
    const result =
        sender === user ? (
            <Fragment>
                {email_text_area} {stamp}
            </Fragment>
        ) : (
            <Fragment>
                {stamp} {email_text_area}
            </Fragment>
        );
    return <div className="EmailContainer">{result}</div>;
}
// Used to be to the right of the email_text_area
//   <div className="mail_right_info">
//      {AttachedFiles(email.get_attachments())}
// </div>
