import React from 'react'
import './index.css'
import {Chatter} from "./Chatter";

export function Team(props){
    return (
        <div className="team group">
            <div>
                <h2 className={props.currentTeam==='BLUE' ? 'current-team current-team-blue': 'current-team'}>BLUE</h2>
                <div className={props.currentTeam==='BLUE' ? 'score group current-team-blue': 'score group'}>
                    <h2 className={props.currentTeam==='BLUE' ? 'score-title current-team-blue': 'score-title'}>SCORE:</h2>
                    <h2 className={props.currentTeam==='BLUE' ? 'current-score current-team-blue': 'current-score'}>{props.blueScore}</h2>
                </div>
            </div>
            <div>
                <h2 className={props.currentTeam==='RED' ? 'current-team current-team-red': 'current-team'}>RED</h2>
                <div className={props.currentTeam==='RED' ? 'score group current-team-red': 'score group'}>
                    <h2 className={props.currentTeam==='RED' ? 'score-title current-team-red': 'score-title'}>SCORE:</h2>
                    <h2 className={props.currentTeam==='RED' ? 'current-score current-team-red': 'current-score'}>{props.redScore}</h2>
                </div>
            </div>
            <Chatter gameid={props.gameid}/>
        </div>
    );

}