import React, { useEffect } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currAccount, setCurrAccount] = React.useState(null);

  const checkIfWalletIsConntected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("make you you hv metamask");
        return;
      } else {
        console.log("metamask is connected, we hv eth obj", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length === 0) {
          console.log("no accounts found");
        } else {
          const account = accounts[0];
          console.log("account found", account);
          setCurrAccount(account);
        }
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    checkIfWalletIsConntected();
  }, []);

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("get metamask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrAccount(accounts[0]);
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">
            welcome to Bojack horseman's condo
          </p>
          <p className="sub-text">
            "BoJack, when you get sad, you run straight ahead and you keep
            running forward, no matter what... Don't you ever stop running and
            don't you ever look behind you... All that exists is what's ahead.
          </p>
          <div className="connect-wallet-container">
            <img
              src="http://49.media.tumblr.com/87092d1a1fac85c04fa6560405df3595/tumblr_o3bubgokIY1v6l2a0o1_1280.gif"
              alt="Monty Python Gif"
            />
            <button
              className="connect-wallet-button cta-button"
              onClick={connectWalletAction}
            >
              Connect Wallet to get Started
            </button>
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
