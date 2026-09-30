import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
/* Material UI & Styling */
import {
    Paper,
    CardHeader,
    CardContent,
    Fab
} from '@mui/material';

/* Components */

import Chat from "./Chat";
import MatchList from "./MatchList";
/* App Component */

function Matches() {

    /* Login */

    const [joinInfo, setJoinInfo] = useState({
        userName: '',
        roomName: '',
        error: ''
    });

    const hasJoined = () => joinInfo.userName && joinInfo.roomName && !joinInfo.error;
    const joinRoom = joinData => socket.current.emit("join", joinData);
    const leaveRoom = () => socket.current.disconnect();
     /* Chat */
    const [typingUsers, setTypingUsers] = useState([]);
    const [chatLog, setChatLog] = useState([]);
    const sendMessage = (text) => {
        socket.current.send(text);
    }
    const notifyTyping = (typingInfo) => {
        socket.current.emit("typing", typingInfo);
    }

    //const [roomLog, setRoomLog] = useState({});
    const [roomLog, setRoomLog] = useState([]);
    /* WebSocket */

    // https://react.dev/reference/react/useRef
    // useRef is a React Hook that lets you reference a value that’s not needed for rendering
    const effectRan = useRef(false);
    const socket = useRef();

    const connectToServer = () => {
        if (effectRan.current) return; // Don't run twice with Strict Mode

        try {
            // Only use localhost:9000 if the app is being hosted on port 5173 (i.e. Vite)
            const wsServerAddress = window.location.port == 5173 ? "localhost:9000" : "/";
            const ws = io.connect(wsServerAddress, { transports: ["websocket"] });

            // Handle join
            ws.on("join-response", setJoinInfo);
            ws.on("chat update", setChatLog);
            ws.on("room update", setRoomLog);
            ws.on("typing", setTypingUsers);
            socket.current = ws;
            effectRan.current = true; // Flag to prevent connecting twice
        }
        catch (e) {
            console.warn(e);
        }
    };

    useEffect(() => {
        connectToServer();
    }, []);

	/* App Rendering */

    return (
        <Paper>
            {
                hasJoined() ?
                    <Chat {...joinInfo} sendMessage={sendMessage} chatLog={chatLog} notifyTyping={notifyTyping} leaveRoom={leaveRoom} roomLog={roomLog} typingUsers={typingUsers}/>
                    : <MatchList joinRoom={joinRoom} error={joinInfo.error} />
            }
        </Paper>
    );
}

export default Matches;