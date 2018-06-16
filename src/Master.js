import React from 'react'
import './index.css'
import { MasterBoard } from './Boards'
import { APP_SERVER } from "./Constants";
import {Chatter} from "./Chatter";

export class Master extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            words:[]
        };
    }

    componentDidMount() {
        const { gameid } = this.props.match.params;

        fetch(`${APP_SERVER}/master/${gameid}`, { //'https://pacific-tor-94185.herokuapp.com/master'
            method: 'GET'
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Something went wrong ...');
            }
            })
            .then(body => {
                this.setState({
                    words: body
                });
            }).catch(error => this.setState({ error, isLoading: false }))
            ;
    }






    render(){
        return (
            <div className="game">
                <MasterBoard words={this.state.words}/>
                <Chatter gameid={this.props.match.params.gameid} socket={this.props.socket}/>
            </div>
        );
    }
}
