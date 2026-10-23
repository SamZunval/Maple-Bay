import { useState, useEffect } from "react";
import {
    Paper,
    CardHeader,
    CardContent,
    TextField,
    Button,
    Alert
} from "@mui/material";
import * as api from "../util/api";

const ChatList = (props) => {

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const loadMatches = async () => {
            let username = JSON.parse(sessionStorage.getItem("userInfo")).email;
            let result = await api.chatroom.getUserChatRooms(username);
            setMatches(result);
        }
        loadMatches();
    }, []);

    const getRoomName = (name,fancyRoomName) => {
        var roomName = name;
        let userName = JSON.parse(sessionStorage.getItem("userInfo")).email;
        return {roomName, userName,fancyRoomName};
    }
    
    return (<>
        <Paper elevation={4} sx={{ marginTop: "0.5em" }}>
            <CardHeader title="Items for sale" />
        </Paper>
        <>
            {matches != null && [matches].map(function(object,i){
 	           return <Paper key={i} elevation={4} sx={{ marginTop: "0.5em" }}>
                <CardHeader title={object.roomName}  />
                <CardContent>
                <Button object={object}fullWidth variant="contained"
                    onClick={() => props.joinRoom(getRoomName(object._id,object.roomName))}
                >
                    Chat
                </Button>
            </CardContent>
        </Paper>
	         })}
        </>
    </>);
};

export default ChatList;