import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css'
import {Game} from './Game';
import {Master} from './Master';
import io from "socket.io-client";
import {CHAT_SERVER} from "./Constants";


const socket = io(CHAT_SERVER, {transports: ['websocket', 'polling', 'flashsocket']});//https://github.com/socketio/socket.io-client/issues/641

ReactDOM.render(
    <Router>
        <div>
            <Route path="/game/:gameid" render={(props) => (
                <Game {...props} socket={socket} />
            )}
            />
            <Route path="/master/:gameid" render={(props) => (
                <Master {...props} socket={socket} />
            )}/>
        </div>
    </Router>,
    document.getElementById('root'));


