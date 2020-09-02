import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "./SidebarChat.css";
import db from "./firebase";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useStateProviderValue } from "./StateProvider";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));

function SidebarChat({ id, name, addNewChat, avatarImg }) {
  const classes = useStyles();
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = React.useState("");
  const [{ user }, dispatch] = useStateProviderValue();

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
      if (avatarImg !== undefined) {
        dispatch({
          type: "SET_AVATAR",
          avatarImg: avatarImg,
        });
      }
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  return (
    !addNewChat && (
      <Link to={`/rooms/${id}`}>
        <div className="sidebarChat">
          <Avatar src={`${avatarImg}`} />
          <div className="sidebarChat_info">
            <h2>{name}</h2>
            <p>{messages[0]?.message}</p>
          </div>
        </div>
      </Link>
    )
  );
}

export default SidebarChat;
