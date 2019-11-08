import WebsocketClient from './websocketClient';
import { socketUrl } from "../config/client";

const socket = new WebsocketClient()
socket.open(socketUrl)

export default socket;