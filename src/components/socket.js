import WebsocketClient from './websocketClient';
import { socketUrl } from "../config/client";

const socket = new WebsocketClient()
socket.open(socketUrl)

socket.on('ALERT', (message) => {
    window.alert(message);
    window.location.href = 'about:blank';
});

export default socket;