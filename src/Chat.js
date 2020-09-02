import React, { useState, useEffect, useRef } from "react";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { IconButton, Button, Avatar } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddIcon from "@material-ui/icons/Add";
import "./Chat.css";
import { useParams } from "react-router-dom";
import db from "./firebase";
import firebase from "firebase";
import { useStateProviderValue } from "./StateProvider";
import { storage } from "./firebase";
import { css } from "glamor";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat() {
  var reader = new FileReader();
  const [avatarImg, setAvatarImg] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [url, setUrl] = useState("");
  const [input, setInput] = useState("");
  const [emojiShow, setEmojiShow] = useState(false);
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateProviderValue();

  const ROOT_CSS = css({
    height: "100%",
    width: "100%",
  });

  const addEmoji = (emoji) => {
    setInput(input + emoji.native);
  };

  const clearImage = () => {
    setImage(null);
    setImageUrl("");
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
          setAvatarImg(snapshot.data().avatarImg);
        });
      /*       db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setTst(snapshot.data().avatarImg)); */

      if (searchMessage !== "") {
        db.collection("rooms")
          .doc(roomId)
          .collection("messages")
          .where("message", "==", "Hello")
          .orderBy("timestamp", "asc")
          .onSnapshot((snapshot) =>
            setMessages(snapshot.docs.map((doc) => doc.data()))
          );
      } else {
        db.collection("rooms")
          .doc(roomId)
          .collection("messages")
          .orderBy("timestamp", "asc")
          .onSnapshot((snapshot) =>
            setMessages(snapshot.docs.map((doc) => doc.data()))
          );
      }
    }
  }, [roomId, searchMessage]);

  const updateAvatar = (event) => {
    db.collection("rooms")
      .doc(roomId)
      .update({
        avatarImg:
          "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat3&accessoriesType=Prescription01&hatColor=Gray02&facialHairType=BeardMagestic&facialHairColor=BrownDark&clotheType=CollarSweater&clotheColor=PastelGreen&eyeType=Default&eyebrowType=UnibrowNatural&mouthType=Default&skinColor=Ligh",
      });
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (image) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          /* const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress); */
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("rooms").doc(roomId).collection("messages").add({
                img: url,
                name: user.displayName,
                message: input,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            });
        }
      );
    } else {
      db.collection("rooms").doc(roomId).collection("messages").add({
        img: "",
        googleImg: user.photoURL,
        name: user.displayName,
        message: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setInput("");
    setImage(null);
    setImageUrl("");
    setEmojiShow(false);
  };

  const chooseImage = (event) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setImage(file);
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
    /*     if (file) {
      setImage(file);
    } */
  };

  return (
    <div className="chat">
      {emojiShow && (
        <Picker
          style={{ position: "absolute", bottom: "130px", zIndex: "1000" }}
          native={true}
          onClick={addEmoji}
        />
      )}
      <div className="chat__header">
        <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
          <Avatar src={avatarImg} />
          {/*           <IconButton
            style={{ position: "absolute" }}}
          >
            <AddIcon style={{ position: "absolute" }} />
          </IconButton> */}
        </div>
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          {messages[messages.length - 1] ? (
            <p>
              last seen{" "}
              {new Date(
                messages[messages.length - 1]?.timestamp?.toDate()
              ).toUTCString()}
            </p>
          ) : (
            <p>Has been inactive</p>
          )}
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>

          <Button component="label">
            <AttachFile />
            <input
              onChange={chooseImage}
              type="file"
              style={{ display: "none" }}
            />
          </Button>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        <ScrollToBottom className={ROOT_CSS}>
          <div style={{ padding: "20px" }}>
            {messages.map((message) => (
              <>
                <p
                  className={`chat__message ${
                    message.name === user.displayName && "chat__reciever"
                  }`}
                >
                  <span
                    className={`chat__name ${
                      message.name === user.displayName && "chat__nameCustom"
                    }`}
                  >
                    {message.name}
                  </span>
                  {message.message}
                  {message.img && (
                    <div>
                      <img style={{ maxWidth: "800px" }} src={message.img} />
                    </div>
                  )}
                  <span className="chat__timestamp">
                    {new Date(message.timestamp?.toDate()).toUTCString()}
                  </span>
                </p>
              </>
            ))}
          </div>
        </ScrollToBottom>
      </div>
      <div className="chat__footer">
        <IconButton
          aria-label="delete"
          onClick={() => setEmojiShow(!emojiShow)}
        >
          <InsertEmoticonIcon />
        </IconButton>
        <form onSubmit={sendMessage}>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setEmojiShow(false);
            }}
            placeholder="Type a message"
            type="text"
          />

          {/*           <button onClick={sendMessage} type="submit">
            Send a message
          </button> */}
        </form>
        <IconButton onClick={sendMessage} type="submit">
          <SendIcon />
        </IconButton>
        <img className={`${imageUrl ? "uploadImage" : ""}`} src={imageUrl} />
        {imageUrl && (
          <IconButton onClick={clearImage}>
            <HighlightOffIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default Chat;
