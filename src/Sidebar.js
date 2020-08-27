import React, { useState, useEffect } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import SidebarChat from "./SidebarChat.js";
import db from "./firebase";
import "./Sidebar.css";
import { useStateProviderValue } from "./StateProvider";

function Sidebar() {
  let searchTimer = null;
  const [rooms, setRooms] = useState([]);
  const [input, setInput] = useState("");
  const [mySearch, setMySearch] = useState("");
  const [{ user }, dispatch] = useStateProviderValue();

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

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        })).filter(str => {
          return str.data.name.includes(mySearch);
        })
      )
    );

    return () => {
      unsubscribe();
    };
  }, [mySearch]);

  return (
    <div className="sidebar">
      {console.log(rooms)}
      <div className="sidebar_header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar_headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>

          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchOutlinedIcon />
          <input value={input}
            onChange={evt => doSearch(evt)}
            placeholder="Search for a chat"
            type="text" />
        </div>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
