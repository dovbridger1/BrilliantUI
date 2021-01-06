import React from "react";
import { Contact } from '../../data_objects/Contact.js'
import "./EmailChips.css";

export class EmailChips extends React.Component {
    state = {
        value: "",
        error: null,
        options: []
    };

    handleKeyDown = evt => {
        if (["Enter", "Tab", ","].includes(evt.key)) {
            evt.preventDefault();

            var value = this.state.value.trim();

            if (value && this.isValid(value)) {
                this.setState({
                    value: ""
                });
                this.props.on_items_change([...this.props.items, value]);
            }
        }
    };

    handleChange = evt => {
        const options = Contact.get_filtered_contacts(evt.target.value);
        const value = options.length === 1 && evt.target.value.length > this.state.value.length ? options[0] : evt.target.value;
        this.setState({
            value: value,
            error: null,
            options: options
        });
        //     eventFire(document.getElementById('select_list'), 'click');
    };

    handleDelete = item => {
        this.props.on_items_change(this.props.items.filter(i => i !== item));
    };

    handlePaste = evt => {
        evt.preventDefault();

        var paste = evt.clipboardData.getData("text");
        var emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

        if (emails) {
            var toBeAdded = emails.filter(email => !this.isInList(email));

            this.props.on_items_change([...this.props.items, ...toBeAdded]);
        }
    };

    isValid(email) {
        let error = null;

        if (this.isInList(email)) {
            error = `${email} has already been added.`;
        }

        if (!this.isEmail(email)) {
            error = `${email} is not a valid email address.`;
        }

        if (error) {
            this.setState({ error });

            return false;
        }

        return true;
    }

    isInList(email) {
        return this.props.items.includes(email);
    }

    isEmail(email) {
        return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    }

    render() {
        return (
            <div id="chips_container">
                {this.props.items.map(item => (
                    <div className="tag-item" key={item}>
                        {Contact.get_contact_name_by_address(item) || item}
                        <button
                            type="button"
                            className="button"
                            onClick={() => this.handleDelete(item)}
                        >
                            &times;
            </button>
                    </div>
                ))}

                <input
                    className={"input " + (this.state.error && " has-error")}
                    value={this.state.value}
                    placeholder=""
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleChange}
                    onPaste={this.handlePaste}
                />
                <select id="select_list" onChange={(e) => { this.handleChange(e); }}>
                    {this.state.options.map(o => <option value={o}>{o}</option>)}
                </select>

            </div>
        );
    }
}


function eventFire(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}
//                {this.state.error && <p className="error">{this.state.error}</p>}