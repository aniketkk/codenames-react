import React from 'react'
import './index.css'
import Grid from "@material-ui/core/Grid";

export class MasterCard extends React.Component {

    render(){
        return (
            <Grid  className={this.props.className +' paper-text-align'}>{this.props.word.value}</Grid>
        );
    }


}

