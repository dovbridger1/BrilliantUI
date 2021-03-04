import React, { useState } from 'react'
import { Contact } from '../../data_objects/Contact'
import { GroupIcon } from '../mail/EmailStamp'
import { AddWatchersStyle } from './Tasks.style'
export default function AddWatchers(props) {
    const [search_text, set_search_text] = useState("");
    const options = Contact.get_filtered_contacts(search_text, 10)
    const contact_list = options.map(c =>
        <NameWithIcon key={c}
            contact={c}
            on_select={props.on_select} />);
    return (
        <AddWatchersStyle location={props.location} className="AddWatchers">
            {contact_list}
            <input className="input" type="text" value={search_text} onChange={(e) => set_search_text(e.target.value)}></input>
        </AddWatchersStyle>
    );
}

function NameWithIcon(props) {
    return (
        <div onClick={() => props.on_select(props.contact)} className="NameWithIcon">
            {GroupIcon([props.contact], 1, 35)}
            <span>{props.contact.get_name()}</span>
        </div>
    )
}
