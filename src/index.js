import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css'
import {Game} from './Game';
import {Master} from './Master';

ReactDOM.render(
    <Router>
        <div>
            <Route path="/game/:gameid" component={Game}/>
            <Route path="/master/:gameid" component={Master}/>
        </div>
    </Router>,
    document.getElementById('root'));


