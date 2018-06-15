import React from 'react'
import './chatterStyle.css'
import io from "socket.io-client";
import { COLORS, TYPING_TIMER_LENGTH } from './ChatterHelpers'
import { LOCAL_CHAT_SERVER } from './Constants'
export class Chatter extends React.Component {
    constructor() {
        super();
        this.state = {
            response: false,
            typing: false,
            lastTypingTime: (new Date()).getTime(),
            username: '',
            message: '',
            connected: false,
            userRegistered:false,
            prevMessages:[],
            typingMessages:[]
        };

        this.socket = io(CHAT_SERVER, {transports: ['websocket', 'polling', 'flashsocket']});//https://github.com/socketio/socket.io-client/issues/641
        //console.log(this.socket);
    }


    componentDidMount() {
        const { gameid } = this.props;


        this.socket.on("add user", () => {console.log("added user")});//this.setState({ response: data })

        // Whenever the server emits 'login', log the login message
        this.socket.on('login', (data) => {
            this.setState({connected : true});
            // Display the welcome message
            var message = "Welcome to this.socket.IO Chat – ";
            this.log(message, {
                prepend: true
            });
            this.addParticipantsMessage(data);
        });

        // Whenever the server emits 'new message', update the chat body
        this.socket.on('new message', (data) => {
            this.addChatMessage(data);
        });

        // Whenever the server emits 'user joined', log it in the chat body
        this.socket.on('user joined', (data) => {
            this.log(data.username + ' joined');
            this.addParticipantsMessage(data);
        });

        // Whenever the server emits 'user left', log it in the chat body
        this.socket.on('user left', (data) => {
            this.log(data.username + ' left');
            this.addParticipantsMessage(data);
            this.removeChatTyping(data);
        });

        // Whenever the server emits 'typing', show the typing message
        this.socket.on('typing', (data) => {
            this.updateTyping(data);
        });

        // Whenever the server emits 'stop typing', kill the typing message
        this.socket.on('stop typing', (data) => {
            this.removeChatTyping(data);
        });

        this.socket.on('disconnect', () => {
            this.log('you have been disconnected');
        });

        this.socket.on('reconnect', () => {
            this.log('you have been reconnected');
            if (this.state.username !== '') {
                this.socket.emit('add user', this.state.username);
            }
        });

        this.socket.on('reconnect_error', () => {
            this.log('attempt to reconnect has failed');
        });


    }

    // Sends a chat message
    sendMessage = () => {
        const { gameid } = this.props;
        const { message, connected, username } = this.state;

        //var message = $inputMessage.val();
        // Prevent markup from being injected into the message
        let cleanedMessage = this.cleanInput(message);
        // if there is a non-empty message and a this.socket connection
        if (cleanedMessage !== '' && connected) {
            this.setState({
                message:''
            })
            this.addChatMessage({
                username: username,
                message: cleanedMessage
            });
            // tell server to execute 'new message' and send along one parameter
            this.socket.emit('new message', cleanedMessage);
        }
    }


    handleKeyPressMessage = (event) => {
        const { gameid } = this.props;
        // Auto-focus the current input when a key is typed
        let data ={username:this.state.username};
        this.socket.emit('typing', data);
        this.updateTyping({username:this.state.username});
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            document.getElementById('inputMessage').focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (this.state.username !== '') {
                this.sendMessage();
                this.socket.emit('stop typing', {username:this.state.username});
                this.setState({
                    typingMessages:[...this.state.typingMessages, data],
                    typing:false
                })
            }
        }
    }


    // Sets the client's username
    handleKeyPressUserName = (event) => {
        const { gameid } = this.props;

        if (!(event.ctrlKey || event.metaKey || event.altKey))
            document.getElementById('usernameInput').focus();

        let username = this.cleanInput(this.state.username.trim());

        // If the username is valid
        if (event.which === 13) {
            console.log({ gameId:gameid, username:username });
            this.socket.emit('add user', { gameId:gameid, username:username });
            this.setState({userRegistered:true});
        }
    }

    // Adds the visual chat message to the message list
    addChatMessage = (data) => {
        this.setState({ prevMessages: [...this.state.prevMessages, {
                username:data.username,
                usernameColor:this.getUsernameColor(data.username),
                message:data.message
            }]});
    }




    updateTyping = (data) => {
        const { gameid } = this.props;
        console.log(data);
        if (this.state.connected) {
            if (!this.state.typing) {
                this.setState({
                    typingMessages:[...this.state.typingMessages, data],
                    typing:true
                })
            }
            this.setState({lastTypingTime : (new Date()).getTime()});


            setTimeout(() => {

                var typingTimer = (new Date()).getTime();
                var timeDiff = typingTimer - this.state.lastTypingTime;
                if (timeDiff >= TYPING_TIMER_LENGTH && this.state.typing) {
                    this.socket.emit('stop typing');

                    this.setState({

                            typing:false,
                            typingMessages: this.state.typingMessages.filter(d => d.username !== data.username)

                    })

                }
            }, TYPING_TIMER_LENGTH);
        }
    }


    addParticipantsMessage = (data) => {
        var message = '';
        if (data.numUsers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        this.log(message);
    }




// Log a message
    log = (message, options) => {
        console.log(message);
        //var $el = $('<li>').addClass('log').text(message);
        //this.addMessageElement($el, options);
    }


// Removes the visual chat typing message
    removeChatTyping = (data) => {
        console.log("remove chat typing "+ data);
        // this.getTypingMessages(data).fadeOut(() => {
        //     $(this).remove();
        // });
        return this.state.typingMessages.filter(d => d.username !== data.username);
    }


// Gets the color of a username through our hash function
    getUsernameColor = (username) => {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    // Prevents input from having injected markup. keeping this here for now
    cleanInput = (input) => {
        return input;//$('<div/>').text(input).html();
    }

    handleChangeMessage = (event) => {
        this.setState({message: event.target.value});
    }


    handleChangeUserName = (event) => {
        this.setState({username: event.target.value});
    }



//{userRegistered} {username !== '' &&}
  //
    render() {
        // testing for this.socket connections
        const { userRegistered } = this.state;
        return (
            <div className='measure'>



                    {userRegistered ? (

                            <div id="chatarea" className="chatArea">
                                <ul id="pages" className="pages">
                                    <li id="chatpage">

                                        {
                                            this.state.prevMessages.map(function(w){
                                                return  <li><span className={'username ' + w.usernameColor}>{w.username}:</span><span className="messageBody">{w.message}</span></li>
                                            })
                                        }

                                        {
                                            this.state.typingMessages.map((w) => {
                                                return  w.username !== this.state.username && <li><span className='username'>{w.username}:</span><span className="messageBody"> is typing...</span></li>
                                            })
                                        }


                                    </li>
                                </ul>
                                <input id="inputMessage" className="inputMessage" value={this.state.message} onKeyPress={this.handleKeyPressMessage}  onChange={this.handleChangeMessage} placeholder="Type here..."/>
                            </div>
                        ) :

                        (

                                <div className="login page">
                                    <div className="title">What's your nickname?</div>
                                        <input id="usernameInput" className="usernameInput" value={this.state.username} onKeyPress={this.handleKeyPressUserName} onChange={this.handleChangeUserName} type="text" maxLength="14" />
                                </div>

                        )}

            </div>
        )
    }
}