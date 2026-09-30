import { useState, useEffect } from "react";
import {
    Paper,
    CardHeader,
    CardContent,
    TextField,
    Button,
    Alert
} from "@mui/material";
import * as api from "../util/api"
const MatchList = (props) => {

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const loadMatches = async () => {
            let username = JSON.parse(sessionStorage.getItem("userInfo")).userName;
            console.log("username: " + username);
            let result = await api.users.getMatches(username);
            setMatches(result);
        }
        loadMatches();
    }, []);

    const getRoomName = (uName) => {
        var roomName = "";
        let userName = JSON.parse(sessionStorage.getItem("userInfo")).userName;
        if(uName < userName){
            roomName = uName + ":" + userName;
        }
        else {
            roomName = userName + ":" + uName;
        }
        return {roomName, userName};
    }
    return (<>
        <Paper elevation={4} sx={{ marginTop: "0.5em" }}>
            <CardHeader title="Matches" />
        </Paper>
        <>
            {matches.map(function(object,i){
 	           return <Paper key={i} elevation={4} sx={{ marginTop: "0.5em" }}>
                <CardHeader title={object.firstName + " " + object.lastName}  />
                <CardContent>
                <Button object={object}fullWidth variant="contained"
                    onClick={() => props.joinRoom(getRoomName(object.userName))}
                >
                    Chat
                </Button>
            </CardContent>
        </Paper>
	         })}
        </>
    </>);
};

export default MatchList;