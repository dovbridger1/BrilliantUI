import React, { Fragment, useState } from 'react';
import ReactDOM from 'react-dom'
import { Menu } from './external/Menues.js';
import ReactQuillWrapper from './external/ReactQuillWrapper.js';
import { EmailChips } from './external/EmailChips.js';
import './EmailComposer.css';
import { send_email } from '../backend/Connect.js';
import { create_mail_object, get_priority_style_by_name, sleep } from '../utils.js';
import { person0 } from '../data_objects/Contact.js';
import Draggable from 'react-draggable';
import { useSelector, useDispatch } from 'react-redux';
import { Delete } from '../actions/email_composer.js'
import { IMPORTANT } from '../data_objects/Consts.js';

var SEND_WAS_CANCELED = { value: false }

export function EmailComposers() {

    const composer_names = useSelector(state => state.email);
    const user_address = useSelector(state => state.user.get_address());
    const dispatch = useDispatch();
    const [focused, set_focus] = useState(-1);
    const [send_was_canceled, set_send_cancelation] = useState(false);
    const [show_send_message, set_show_send_message] = useState(false);
    const handle_close = (id) => {
        dispatch(Delete(id));
    };

    const my_set_send_cancelation = (value) => {
        SEND_WAS_CANCELED.value = value;
        set_send_cancelation(value);
    }

    const my_send = async (...args) => {
        await sleep(2500)
        const should_send = !SEND_WAS_CANCELED.value
        if (should_send) {
            send(...args);
        }
        set_show_send_message(false);
        my_set_send_cancelation(false);
        return should_send;
    }
    function wake(was_canceled) {
        console.log(was_canceled);
    }
    const composers = composer_names.map(n => (
        <div className={focused === n ? "on_top" : undefined} onClick={e => set_focus(n)}>
            <EmailComposer user_address={user_address}
                on_close={handle_close}
                id={composer_names.indexOf(n)}
                set_show_send_message={set_show_send_message}
                send={my_send}
            />
        </div>
    ));
    return ReactDOM.createPortal(
        <Fragment>
            <EmailSendMessage
                visible={show_send_message}
                on_undo={() => my_set_send_cancelation(true)}
                was_canceled={send_was_canceled}
            />
            {composers}
        </Fragment>,
        document.getElementById('email_composer')
    );
}
export function EmailComposer(props) {
    const [to, set_to] = useState([]);
    const [cc, set_cc] = useState([]);
    const [bcc, set_bcc] = useState([]);
    const [subject, set_subject] = useState("");
    const [files, set_files] = useState([]);
    const [file_buffers, set_buffers] = useState({});
    const [file_progress, set_progress] = useState({});
    const handle_close = () => props.on_close(props.id);
    const handle_send = (html) => {
        props.set_show_send_message(true);
        props.send(to, subject, html, cc, bcc, file_buffers, files).then(res => {
            if (res) {
                handle_close();
            }
        });
    };
    function my_set_files(e) {
        const new_files = [...e.target.files]
        set_files((old_files) => [...old_files, ...new_files.filter(f => !old_files.map(of => of.name).includes(f.name))]);
        upload_files(new_files, my_set_buffers, my_set_progress);
        scroll_to_files();
        document.getElementById(e.target.id).value = null;
    }

    function scroll_to_files() {
        const simplebar = document.querySelector('#EmailContent' + props.id + ' .simplebar-content-wrapper')
        simplebar.scrollBy({ top: 999, left: 0, behavior: 'smooth' });
    }

    function my_set_progress(file, progress) {
        set_progress(old_progresses => {
            var new_progresses = Object.assign({}, old_progresses);
            new_progresses[file.name] = Math.round(progress * 100);
            return new_progresses
        });
    }
    function my_set_buffers(file, new_buffer) {
        set_buffers(old_buffers => {
            var new_buffers = old_buffers;
            new_buffers[file.name] = new_buffer;
            return new_buffers;
        });
    }
    function remove_file(file) {
        set_files(Object.values(files).filter(f => f !== file))
        my_set_buffers(file, undefined)
        my_set_progress(file, undefined)

    }
    return (
        <Draggable handle=".EmailComposer" cancel=".EmailContent" axis="x" defaultPosition={{ x: 50 * props.id, y: 0 }}>
            <div className='EmailComposer'>
                <ComposeHeader on_close={handle_close} user_address={props.user_address} />
                <Recipients id={props.id} label='To' items={to} onChange={set_to}></Recipients>
                <Recipients id={props.id} label='CC' items={cc} onChange={set_cc}></Recipients>
                <Recipients id={props.id} label='BCC' items={bcc} onChange={set_bcc}></Recipients>
                <Subject onChange={(e) => set_subject(e.target.value)}></Subject>
                <EmailContent id={props.id} handle_send={handle_send}
                    files={files}
                    file_progress={file_progress}
                    set_files={my_set_files}
                    remove_file={remove_file}
                ></EmailContent>
            </div>
        </Draggable>
    );
}



function Recipients(props) {
    return (
        <div className='Recipients'>
            <label for={props.label}>{props.label}</label>
            <div className="input_container">
                <EmailChips
                    recipient_id={props.label}
                    composer_id={props.id}
                    type='text' placeholder=''
                    on_items_change={props.onChange}
                    items={props.items} />
            </div>
        </div>
    );
}

function Subject(props) {
    return (
        <div className='Subject'>
            <div className="subject_title_line">
                <h3>Subject</h3>
                {<PriorityOptions default_selection={IMPORTANT} />}
            </div>
            <input type='text' placeholder='' onChange={props.onChange}></input>
        </div>
    );
}

export function PriorityOptions(props) {
    const options = ['Urgent', 'Important', 'Can Wait', 'No Priority'];
    const [selected, set_selected] = useState(options[props.default_selection]);
    const style_class = get_priority_style_by_name(selected);
    return (
        <Menu value={selected} options={options} style_class={style_class}
            onChange={(sel) => {
                set_selected(sel.value)
                if (props && props.onChange) {
                    props.onChange(sel.value);
                }
            }
            }
        />
    );
}


export function EmailContent(props) {
    return (
        <div id={"EmailContent" + props.id} className='EmailContent'>
            <h3>Content</h3>
            <ReactQuillWrapper id={props.id}
                files={props.files}
                file_progress={props.file_progress}
                set_files={props.set_files}
                remove_file={props.remove_file}
                handle_send={props.handle_send} />
        </div>
    );
}

function ComposeHeader(props) {
    return (
        <div className="header">
            <div className="header_label">
                <img src="button_icons/mail.svg"></img>
                <span id="from_label">From</span>
            </div>
            <span id="sender_address">{props.user_address}</span>
            <button className="delete" onClick={props.on_close}>&times;</button>
        </div>

    );
}

function send(to, subject, html_content, cc, bcc, file_buffers, files) {
    console.log("Sending mail:");
    console.log(html_content)
    const attachment_buffers = Object.values(files).map(f => {
        return {
            name: f.name,
            type: f.type,
            buffer: file_buffers[f.name]
        }
    });
    try {
        const email = create_mail_object(to, subject, html_content, 'html', cc, bcc, attachment_buffers);
        send_email(email);
    } catch (err) {
        alert(err);
    }
}

function upload_files(files, my_set_buffers, my_set_progress) {

    for (const file of files) {
        var reader = new FileReader()
        reader.onload = (evt) => {
            my_set_buffers(file, evt.target.result);
            my_set_progress(file, 1);
        }
        reader.onprogress = (evt) => {
            if (evt.loaded && evt.total) {
                my_set_progress(file, evt.loaded / evt.total);
            }
        }
        reader.readAsBinaryString(file);
    }
}

function EmailSendMessage(props) {
    const prompt = props.was_canceled ? "Canceled |" : " Sending email |"
    const style = props.visible ? " visible" : "";
    return (
        <div className={"email_sent_message" + style}>
            <span className="email_sent_label">{prompt}</span>
            <span className="email_sent_undo" onClick={props.on_undo}>Undo</span>
        </div>
    );
}


