import React from 'react'
import './index.css'
import Grid from "@material-ui/core/Grid";
import {Card} from './Card'
import { getColor,getColorMaster } from './Helper'
import {MasterCard} from './MasterCard'
export function Board(props){
    return (


                props.words.map(function(row){
                    return (
                        <div className='board-row'>

                            {
                                row.map(function(w){
                                    return <Card key={w.id} onUpdate={props.onUpdate} onSelect={props.onSelect} className={getColor(w, props.words, props.selectedWords)} selectedWords={props.selectedWords} word={w}/>
                                })
                            }
                        </div>
                    );
                })


    );

}

export function MasterBoard(props){
    return (
        <div className="board">
            {
                props.words.map(function(row){
                    return (
                        <Grid>
                            {
                                row.map(function(w){
                                    return <MasterCard key={w.id} className={getColorMaster(w, props.words)} word={w}/>
                                })
                            }
                        </Grid>
                    );
                })
            }
        </div>
    );

}