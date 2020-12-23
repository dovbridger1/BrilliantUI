import Axios from 'axios';
import { sleep } from '../utils.js';
import { Email } from './Email.js';
Axios.defaults.xsrfCookieName = 'csrftoken';
Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

export async function get_mailbox(callback_func, url) {
    while (true) {
        try {
            var res = await Axios.get(url);
            const emails = res.data.emails;
            callback_func(emails.map(e => new Email(e)));
            if (res.data.done) {
                break;
            }
        }
        catch {
            console.log('unable to load emails');
            console.log(res);
            if (res && res.response && res.response.status === 500) {
                console.log("Server response 500, redirecting to 'signin' page");
                window.open('/signin');
                sleep(3000);
            }
        }
    }
}

export function get_calendar(callback_func) {
    Axios.get('/calendar_react').then(res => {
        const events = res.data;
        callback_func(events);
    }).catch((res) => {
        console.log('unable to load events');
    });
}


export function send_email(email) {
    Axios.post('/sendmail_react', email).then(res => console.log(res));
}