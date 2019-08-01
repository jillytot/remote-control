/**
 *   ╔════   Copyright 2019 Peter Maguire
 *  ║ ════╗  Created 01/08/2019
 * ╚════ ║   (remote-control) volumeControl.jsx
 *  ════╝
 */

import React, { Component } from "react";
import ICONS from "../../../icons/icons";
import Icon from "../../common/icon";
import "./volumeControl.css";


export default class VolumeControl extends Component {

    state = {
        icon: ICONS.VOLUME_HIGH
    };

    unmutedVolume = 0;

    changeVolume = (evt) =>{
        this.setVolume(2-evt.target.value)
    };

    setVolume = (newVolume) =>{
        this.setState({icon: newVolume === 0 ? ICONS.VOLUME_OFF : newVolume < 0.5 ? ICONS.VOLUME_LOW : newVolume < 1 ? ICONS.VOLUME_MID : ICONS.VOLUME_HIGH});
        this.props.player.volume = newVolume;
    };

    toggleVolume = () => {
        if(this.props.player.volume > 0){
            this.unmutedVolume = this.props.player.volume;
            this.setVolume(0);
        }else{
           this.setVolume(this.unmutedVolume);
        }
    };

    render(){
        return  <div className="display-control" title="Volume" id="display-volume-control">
            <span onClick={this.toggleVolume}>
                <Icon icon={this.state.icon}/>
            </span>
            <input type="range" min="0" max="2" step={0.1} orient="vertical" onChange={this.changeVolume} value={this.props.player ? 2-this.props.player.volume : 0}/>
        </div>
    }
}