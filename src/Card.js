import React from 'react'
import './index.css'
import Grid from "@material-ui/core/Grid"
import {  searchInResponse } from './Helper'

export class Card extends React.Component {

    addAndRemoveWords(val){
        let newWords = val.selectedWords.slice();
        let indexOfValue = newWords.indexOf(this.props.word.value);
        //let indexInResponse = searchInResponse(newWords[indexOfValue],newResponse)

        if(this.props.word.guessed === true){
            alert("this one is guessed!")
        }
        else{
            if(indexOfValue !== -1) {
                newWords.splice(indexOfValue, 1);

            }else{
                newWords.push(this.props.word.value);
            }
        }


        return {selectedWords:newWords};
    }


    handleClick = () => {
        let val = {};

        val.selectedWords = this.props.selectedWords;

        let newVal = this.addAndRemoveWords(val);
        this.props.onUpdate(newVal);
        this.props.onSelect({word: val});

    }

    render(){
        return (
            <Grid onClick={this.handleClick} className={this.props.className+' paper-text-align'} >{this.props.word.value}</Grid>
        );
    }


}