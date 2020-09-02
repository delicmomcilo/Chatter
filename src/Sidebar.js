import React, { useState, useEffect } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import SidebarChat from "./SidebarChat.js";
import Tooltip from "@material-ui/core/Tooltip";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import db from "./firebase";
import firebase from "firebase";
import "./Sidebar.css";
import { useStateProviderValue } from "./StateProvider";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

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

function Sidebar() {
  const classes = useStyles();
  let searchTimer = null;
  const [rooms, setRooms] = useState([]);
  const [input, setInput] = useState("");
  const [mySearch, setMySearch] = useState("");
  const [roomName, setRoomName] = React.useState("");
  const [{ user }, dispatch] = useStateProviderValue();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  function doSearch(evt) {
    var searchText = evt.target.value; // this is the search text
    setInput(searchText);
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      setMySearch(searchText);
    }, 500);
  }

  function logout() {
    firebase
      .auth()
      .signOut()
      .then(function () {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      })
      .catch(function (error) {
        // An error happened.
      });
  }

  const createChat = () => {
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
      });
    }
    handleClose();
  };

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs
          .map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
          .filter((str) => {
            return str.data.name.toLowerCase().includes(mySearch.toLowerCase());
          })
      )
    );

    return () => {
      unsubscribe();
    };
  }, [mySearch]);

  return (
    <div className="sidebar">
      <Dialog
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create a new room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            onChange={(e) => setRoomName(e.target.value)}
            margin="dense"
            id="name"
            label="Room name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createChat} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <div className="sidebar_header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar_headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>

          <IconButton>
            <ChatIcon />
          </IconButton>
          <Tooltip title="Logout" aria-label="Logout">
            <IconButton onClick={logout}>
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchOutlinedIcon />
          <input
            value={input}
            onChange={(evt) => doSearch(evt)}
            placeholder="Search for a chat"
            type="text"
          />
        </div>
        <div onClick={handleClickOpen} className="sidebarAddChat">
          <Tooltip
            title="Add"
            aria-label="add"
            style={{ width: "40px", height: "40px" }}
          >
            <Fab color="primary" className={classes.fab}>
              <AddIcon />
            </Fab>
          </Tooltip>
        </div>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat
            key={room.id}
            id={room.id}
            name={room.data.name}
            avatarImg={room.data.avatarImg}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
