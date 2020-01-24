import React, { Component } from "react";
import ICONS from "../../../icons/icons";
import Icon from "../../common/icon";
import "./volumeControl.css";


export default class VolumeControl extends Component {

    state = {
        icon: ICONS.VOLUME_HIGH,
        volume: 0
    };

    unmutedVolume = 1;

    changeVolume = (evt) =>{
        this.setVolume(2-evt.target.value)
    };

    setVolume = (newVolume) =>{
        this.setState({
            volume: 2-newVolume,
            icon: newVolume === 0 ? ICONS.VOLUME_OFF : newVolume < 0.5 ? ICONS.VOLUME_LOW : newVolume < 1 ? ICONS.VOLUME_MID : ICONS.VOLUME_HIGH
        });
        this.props.player.volume = newVolume;
        localStorage.setItem(this.props.channel, JSON.stringify({unmutedVolume: this.unmutedVolume, volume: newVolume}));
    };

    toggleVolume = () => {
        if(!this.props.player)return;
        if(this.props.player.volume > 0){
            this.unmutedVolume = this.props.player.volume;
            this.setVolume(0);
        }else{
           this.setVolume(this.unmutedVolume);
        }
    };

    componentDidMount(){
        if(!window.localStorage)return;
        let that = this;
        setTimeout(function() {
            let itemID = that.props.channel;
            if (localStorage.getItem(itemID)) {
                try {
                    let data = JSON.parse(localStorage.getItem(itemID));
                    if (data.volume) {
                        console.log("Setting volume", data.volume);
                        that.setVolume(data.volume);
                    }

                    if (data.unmutedVolume)
                        that.unmutedVolume = data.unmutedVolume;
                } catch (e) {
                    console.error("Error loading volume localStorage ");
                    console.error(e);
                    localStorage.removeItem(itemID);
                }
            }
        }, 1000);
        //Alright, this isn't the best way of handling this I admit
    };

    render(){
        return  <div className="display-control" title="Volume" id="display-volume-control">
            <span onClick={this.toggleVolume}>
                <Icon icon={this.state.icon}/>
            </span>
            <input type="range" disabled={!this.props.player} min="0" max="2" step={0.1} orient="vertical" onChange={this.changeVolume} value={this.state.volume}/>
        </div>
    }
}