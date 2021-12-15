import React, { useEffect, useState } from "react";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
import LoadingIndicator from "../LoadingIndicator";

/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [minting, setMinting] = useState(false);

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
      setGameContract(gameContract);
    } else {
      console.log("No ethereum found");
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Getting characters");

        const characterTx = await gameContract.getAllDefaultCharacters();
        console.log("charactersTx: ", characterTx);

        const characters = characterTx.map((characterData) =>
          transformCharacterData(characterData)
        );

        setCharacters(characters);
      } catch (error) {
        console.log("some error when getting characters:", error);
      }
    };

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `characterNFTMinted - sender: ${sender}, tokenId: ${tokenId}, characterIndex: ${characterIndex}`
      );

      if (gameContract) {
        alert(
          `Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${gameContract}/${tokenId.toNumber()}`
        );
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("characterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    if (gameContract) {
      getCharacters();

      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract]);

  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div>
          <p>{character.name}</p>
        </div>
        <img
          src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`}
          alt={character.name}
        />
        <button
          type="button"
          className="character-mint-button"
          onClick={mintCharacterNFTAction(index)}
        >
          {`Mint ${character.name}`}
        </button>
      </div>
    ));

  const mintCharacterNFTAction = (characterIndex) => async () => {
    try {
      if (gameContract) {
        setMinting(true);
        console.log("minting character");
        const mintTx = await gameContract.mintCharacterNFT(characterIndex);
        await mintTx.wait();
        console.log("mintTx:", mintTx);
        setMinting(false);
      }
    } catch (error) {
      console.log("some error when minting character:", error);
      setMinting(false);
    }
  };

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
      {minting && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Minting In Progress...</p>
          </div>
          <img
            src="https://media.giphy.com/media/ksw8FL1miIlTzNxe7A/giphy.gif"
            alt="Minting loading indicator"
          />
        </div>
      )}
    </div>
  );
};

export default SelectCharacter;
