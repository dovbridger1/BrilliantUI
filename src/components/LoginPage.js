import React from 'react'
import { useHistory } from 'react-router-dom'

import './LoginPage.css'

export function LoginPage(props) {
    let history = useHistory()
    const handle_click = (is_login) => {
        if (is_login) {
            history.push('/external_login')
        } else {
            history.push('external_logout')
        }
    }
    const header = props.user_address ? 'Logged in as:' : 'Please Login'
    const email_labels = props.user_address ? (
        <label id="user_email">{props.user_address}</label>
    ) : null
    const action_button = props.user_address ? (
        <button className="out" onClick={() => handle_click(false)}>
            Log out
        </button>
    ) : (
        <button className="in" onClick={() => handle_click(true)}>
            Log in
        </button>
    )
    const comment_style = { color: 'gray', margin: '10px' }
    return (
        <div>
            <div className="LoginPage">
                <h3>{header}</h3>
                {email_labels}
                <div className="login_page_buttons">{action_button}</div>
            </div>
            <p style={comment_style}>-Updated March 31st</p>
            <p style={comment_style}>-Basic feed component added</p>
            <p style={comment_style}>
                Search for tasks, emails and events via the searchbar
            </p>
        </div>
    )
}
