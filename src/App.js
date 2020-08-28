import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useStateProviderValue } from "./StateProvider";
import HomeScreen from "./HomeScreen";
import { auth, provider } from "./firebase";

function App() {
  const [{ user }, dispatch] = useStateProviderValue();

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        dispatch({
          type: "SET_USER",
          user: user,
        });
      }
    });
  }, []);

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <div className="appBody">
          <Router>
            <Sidebar />
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>
              <Route path="/">
                <HomeScreen />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
