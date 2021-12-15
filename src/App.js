import React, { useEffect } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import Arena from "./Components/Arena";
import SelectCharacter from "./Components/SelectCharacter";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import myEpicGame from "./utils/MyEpicGame.json";
import { ethers } from "ethers";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currAccount, setCurrAccount] = React.useState(null);
  const [characterNFT, setCharacterNFT] = React.useState(null);

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "4") {
        alert("please connect to the Rinkeby test network");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("checking for character nft on addr", currAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      console.log("gameContract", gameContract);

      const tx = await gameContract.checkIfUserHasNFT();
      if (tx.name) {
        console.log("user has character nft");
        setCharacterNFT(transformCharacterData(tx));
      } else {
        console.log("user does not have character nft");
      }
    };

    if (currAccount) {
      console.log("currAccount", currAccount);
      fetchNFTMetadata();
    }
  }, [currAccount]);

  const renderContent = () => {
    if (!currAccount) {
      return (
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
      );
    } else if (currAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currAccount && characterNFT) {
      return (
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
      );
    }
  };

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
            running forward
          </p>
          {renderContent()}
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
