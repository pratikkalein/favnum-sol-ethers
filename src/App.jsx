import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "./abi";
import { Bars } from "react-loader-spinner";

function App() {
  const [favNum, setfavNum] = useState("");
  const [updatefavNum, setupdatefavNum] = useState("");
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const contractAddress = "0x5F529B5e3b6C74d0491127538eB5C3DEA61A8952";
  let contract = null;
  let provider = null;
  let signer = null;

  useEffect(() => {
    connectWallet();
  }),
    [];

  async function connectWallet() {
    if (window.ethereum == null) {
      console.log("MetaMask not installed!");
      alert("Please install MetaMask first.");
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      setWalletAddress(signer.address);
      setButtonText("Connected");
      initContract();
    }
  }

  function initContract() {
    contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer || provider
    );
  }

  const handleChange = (event) => {
    setupdatefavNum(event.target.value);
  };

  const retriveFavNum = async () => {
    try {
      if (!provider) {
        alert("Please connect your wallet first.");
        return;
      }
      const result = await contract.retrieve();
      setfavNum(result.toString());
    } catch (error) {
      console.error("Error retrieving favorite number:", error);
      alert("Failed to retrieve favorite number. Please try again.");
    }
  };

  const updateFavNum = async () => {
    try {
      if (!provider) {
        alert("Please connect your wallet first.");
        return;
      }
      setLoading(true);
      const transaction = await contract.updateFavNum(updatefavNum);
      await transaction.wait();
      alert("Successfully updated favorite number!");
      setupdatefavNum("");
      retriveFavNum();
      setLoading(false);
    } catch (error) {
      console.error("Error updating favorite number:", error);
      alert("Failed to update favorite number. Please try again.");
    }
  };

  return (
    <>
      <h1>Favorite Number</h1>
      <h3>
        Simple app that stores your favorite number on to the Sepolia Testnet.
      </h3>
      <p>
        Get some test ETH :{" "}
        <a href="https://sepoliafaucet.com/" target="_blank">
          Sepolia Faucet
        </a>
      </p>
      <button onClick={connectWallet}>{buttonText}</button>
      <h5>{walletAddress ? `Wallet Address: ${walletAddress}` : ""}</h5>
      <div>
        <input
          className="input"
          type="number"
          onChange={handleChange}
          value={updatefavNum}
        />
        <button className="button" onClick={updateFavNum}>
          Update
        </button>
        <Bars
          height="40"
          width="40"
          color="#6e37e1"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={loading}
        />
      </div>
      <div>
        <button className="button" onClick={retriveFavNum}>
          Retrieve
        </button>
        {favNum === "" ? "" : <h4>Favorite Number is: {favNum}</h4>}
      </div>
      <p>
        You can find the transactions on{" "}
        <a
          href="https://sepolia.etherscan.io/address/0x5F529B5e3b6C74d0491127538eB5C3DEA61A8952"
          target="_blank"
        >
          Sepolia Etherscan.
        </a>
      </p>
      <p>
        Made with ❤️ by{" "}
        <a href="https://pratikkale.in" target="_blank">
          Pratik Kale |{" "}
          <a
            href="https://github.com/pratikkalein/favnum-sol-ethers"
            target="_blank"
          >
            Source Code
          </a>
        </a>
      </p>
    </>
  );
}

export default App;
