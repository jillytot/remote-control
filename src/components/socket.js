import WebsocketClient from './websocketClient';
import { socketUrl } from "../config/clientSettings";

const socket = new WebsocketClient()
socket.open(socketUrl)

export default socket;