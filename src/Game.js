import React from 'react'
import './index.css'
import Button from '@material-ui/core/Button';
import AlertDialog from './AlertWinner'
import AlertBlackTile from './AlertBlackTile'
import {Board} from './Boards'
import {Team} from './Team'
import io from "socket.io-client";
import { LOCAL_CHAT_SERVER, LOCAL_APP_SERVER, APP_SERVER, CHAT_SERVER } from './Constants';

export class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            words:[],
            selectedWords:[],
            currentTeam:"BLUE",
            startTeam:"BLUE",
            blueScore:0,
            redScore:0,
            blackSelected:false
        };
        //this.onSubmit = this.handleSubmit.bind(this);
        this.socket = this.props.socket; //io(CHAT_SERVER, {transports: ['websocket', 'polling', 'flashsocket']});//https://github.com/socketio/socket.io-client/issues/641
    }

    componentDidMount() {
        const { gameid } = this.props.match.params;
        this.socket.on('selected words', (data) => {
            this.setState({
                selectedWords: data.selectedWords
            })
        });



        fetch(`${APP_SERVER}/game/${gameid}`, {
            method: 'GET'
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Need to create game...");
            }
        })
            .then(body => {
                this.setState({
                    words: body.gameCards,
                    currentTeam: body.starter,
                    startTeam: body.starter,
                    blueScore:body.blueScore,
                    redScore:body.redScore
                });
                console.log("Game created");
            })
            .catch(error => {
                fetch(`${APP_SERVER}/game/${gameid}`, { //'https://pacific-tor-94185.herokuapp.com/master'
                    method: 'POST'
                }).then(response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                })
                    .then(body => {
                        this.setState({
                            words: body.gameCards,
                            currentTeam: body.starter,
                            startTeam: body.starter
                        });
                        console.log("Game created");
                    });
            });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var self = this;
        // On submit of the form, send a POST request with the data to the server.

        const { gameid } = this.props.match.params; //'https://pacific-tor-94185.herokuapp.com/checkCorrectWords'
        fetch(`${APP_SERVER}/game/checkCorrectWords/${gameid}`, {
            method: 'POST',
            body: JSON.stringify({
                currentTeam: self.state.currentTeam,
                selectedWords: self.state.selectedWords
            }),
            headers: {
                'content-type': 'application/json'
            }

        })
            .then((response) => {
                return response.json()
            }).then((body) => {
            this.playedTurn(body);
        });
    }

    playedTurn = (body) => {
        for(let i = 0; i < body.selectedCards.length; i++) {
            for(let j = 0; j < body.selectedCards[i].length; j++) {
                if(body.selectedCards[i][j].color === 'BLACK' && body.selectedCards[i][j].guessed){
                    this.setState({blackSelected:true});
                }
            }
        }


        this.setState({
            blueScore : body.correctBlueAnswers,
            redScore : body.correctRedAnswers,
            words: body.selectedCards,
            selectedWords:[]
        })
        if(this.state.currentTeam === "BLUE") {
            this.setState({
                currentTeam: "RED"
            })
        }
        else {
            this.setState({
                currentTeam : "BLUE"
            })
        }


    };

    changeSelectedWords = (val) => {
        this.setState({
            selectedWords: val.selectedWords
        })
        this.socket.emit('selected words', {
            selectedWords: val.selectedWords
        });

    };



    checkWinner() {
        if (this.state.startTeam === 'BLUE') {
            if (this.state.blueScore === 9) {
                return "BLUE";
            } else if (this.state.redScore === 8) {
                return "RED";
            } else {
                return "NONE";
            }
        } else {
            if (this.state.blueScore === 8) {
                return "BLUE";
            } else if (this.state.redScore === 9) {
                return "RED";
            } else {
                return "NONE";
            }
        }
    }




    render() {
        let winner = this.checkWinner();
        const winnerModal = (winner !== "NONE") ? ((winner === "RED") ? <AlertDialog winner='RED'/> :
            <AlertDialog winner='BLUE'/>) : "";


        return (
            <div className="game">
                <div className='board'>
                    <Board onUpdate={this.changeSelectedWords}  selectedWords={this.state.selectedWords} words={this.state.words}/>
                    <div className="submit-button-blue">
                        <Button onClick={this.handleSubmit} size="large" variant="raised">
                            Submit
                        </Button>
                    </div>
                </div>
                <Team blueScore={this.state.blueScore} redScore={this.state.redScore} socket={this.props.socket}
                      currentTeam={this.state.currentTeam} gameid={this.props.match.params.gameid}/>
                {winnerModal}
                {this.state.blackSelected === true ? <AlertBlackTile winner={this.state.currentTeam}/> : null}

            </div>
        );
    }

}