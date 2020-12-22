import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Main } from './Main.js'
import './Home.css';
import { get_calendar, get_mailbox } from '../data_objects/Connect.js';
import { create_threads } from '../data_objects/Thread.js';
import { Calendar } from './Calendar.js';
import { create_calendar_events } from '../utils.js';

export class Home extends React.Component {
    constructor(props) {
        super(props);
        console.log("Started Home");
        this.update_search_bar = this.update_search_bar.bind(this);
        this.state = {
            emailThreads: {},
            calendarEvents: [],
            search: ""
        };
    }
    update_search_bar(value) {
        this.setState({ search: value });
    }

    componentDidMount() {
        get_mailbox((emails) => this.set_threads(emails));
        get_calendar((events) => this.set_calendar(events));
    }
    set_threads(emails) {
        this.setState({ emailThreads: create_threads(emails) });
        //  this.setState({ selected_thread_id: Object.keys(this.emailThreads)[0] });
    }
    set_calendar(events) {
        this.setState({ calendarEvents: create_calendar_events(events) });
    }
    render() {
        return (
            <Router>
                <div className='Home'>
                    <Nav />
                    <div className='not_nav'>
                        <div className='top_buttons'>
                            {SearchBar(this.state.search, this.update_search_bar)}
                            <button className='filter_button'>Filter</button>
                        </div>
                        <Switch>
                            <Route
                                path='/mail' exact
                                render={() =>
                                    <Main emailThreads={this.state.emailThreads}
                                        load_threads_function={() => get_mailbox((emails) => this.set_threads(emails))}
                                    />}>
                            </Route>
                            <Route
                                path='/calendar' exact
                                render={() =>
                                    <Calendar events={this.state.calendarEvents} />}>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

function Nav() {
    const logo = { icon: "button_icons/logo.svg", link: '/' }
    const brilliant_mode = { icon: "button_icons/brilliant.svg", link: '/' }
    const accounts = { icon: "button_icons/accounts.svg", link: '/' }
    const mail = { icon: "button_icons/mail.svg", link: '/mail' }
    const layout = { icon: "button_icons/layout.svg", link: '/' }
    const calendar = { icon: "button_icons/calendar.svg", link: '/calendar' }
    const files = { icon: "button_icons/files.svg", link: '/' }
    const people = { icon: "button_icons/people.svg", link: '/' }
    const task = { icon: "button_icons/task.svg", link: '/' }
    return (
        <div className='Nav'>
            {NavCluster([logo])}
            {NavCluster([brilliant_mode])}
            {NavCluster([mail, task, calendar, people, files])}
            {NavCluster([layout, accounts])}
        </div>
    );
}
//            <img className='nav_link' src={icon} />
function NavCluster(icon_links) {
    return (
        <div className='NavCluster'>
            {icon_links.map(i_l => <Link className='nav_link' to={i_l.link}>
                <img src={i_l.icon} />
            </Link>)}
        </div>
    )
}


const SearchBar = (keyword, setKeyword) => {
    return (
        <div className="SearchBar">
            <img src='button_icons/search.png'></img>
            <input
                key="search_bar"
                value={keyword}
                placeholder={"search"}
                onChange={(e) => setKeyword(e.target.value)}
            />
        </div>
    );
}
