import { ethers, JsonRpcProvider, formatEther } from "ethers";
import { derivePath } from "ed25519-hd-key";
import { mnemonicToSeedSync } from "bip39";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import Button from "../Button/Button";
import toast from "react-hot-toast";
import Buffer from "buffer";
import "../../Pages/css/Wallet.css";

const provider = new JsonRpcProvider(
  `${import.meta.env.VITE_ETH_DEVNET_CONNECTION_URL}`
);

const EthWallet = () => {
  let [mnemonic, setMnemonic] = useState("");
  let [ethWallets, setEthWallets] = useState([]);
  let [ethIndex, setEthIndex] = useState(0);

  const generateEthWallet = (storedEthMnemonic) => {
    let pathType = "60";
    let accountIndex = ethIndex;
    const seedBuffer = mnemonicToSeedSync(mnemonic || storedEthMnemonic);
    const path = `m/44'/${pathType}'/0'/${accountIndex}'`;
    const derivedSeed = derivePath(path, seedBuffer.toString("hex")).key;

    setEthIndex(accountIndex + 1);
    localStorage.setItem("ethIndex", JSON.stringify(accountIndex + 1));
    let privateKeyEncoded, publicKeyEncoded;
    if (pathType === "60") {
      const privateKey = Buffer.from(derivedSeed).toString("hex");
      privateKeyEncoded = privateKey;
      const wallet = new ethers.Wallet(privateKey);
      publicKeyEncoded = wallet.address;
    }
    const newWallet = {
      publicKey: publicKeyEncoded,
      privateKey: privateKeyEncoded,
      mnemonic: mnemonic || storedEthMnemonic,
      path,
      balance: 0,
      display: false,
    };
    const updatedWallets = [...ethWallets, newWallet];
    setEthWallets(updatedWallets);
    localStorage.setItem("ethWallets", JSON.stringify(updatedWallets));
    return newWallet;
  };

  const deleteEthWallet = (index) => {
    const updatedWallets = ethWallets.filter((_, idx) => idx !== index);
    setEthWallets(updatedWallets);
    toast.success("Eth Wallet deleted.");
    localStorage.setItem("ethWallets", JSON.stringify(updatedWallets));
  };

  const clearEthWallets = () => {
    setEthWallets([]);
    localStorage.removeItem("ethWallets");
    localStorage.removeItem("ethIndex");
    setEthIndex(0);
    toast.success("Eth Wallets cleared.");
  };

  const showEthBalance = async (publicKey) => {
    try {
      const balanceWei = await provider.getBalance(publicKey);
      const balanceEther = formatEther(balanceWei);
      setEthWallets((prevWallets) =>
        prevWallets.map((wallet) =>
          wallet.publicKey === publicKey
            ? { ...wallet, balance: balanceEther, display: true }
            : wallet
        )
      );
    } catch (error) {
      console.error("Failed to fetch Ethereum wallet balance:", error);
      toast.error("Failed to fetch balance. Please try again.");
    }
  };

  useEffect(() => {
    setEthIndex(JSON.parse(localStorage.getItem("ethIndex")));
    const storedEthWallets = localStorage.getItem("ethWallets");
    const storedEthMnemonic = localStorage.getItem("mnemonic");
    setMnemonic(storedEthMnemonic);

    if (storedEthWallets) {
      setEthWallets(JSON.parse(storedEthWallets));
    } else {
      if (storedEthMnemonic) {
        generateEthWallet(storedEthMnemonic);
      }
    }
  }, []);

  return (
    <div className="Wallets">
      <div className="type-of-wallet">
        <h1>Ethereum Wallets</h1>
        <div className="add-delete-wallets">
          <span onClick={() => generateEthWallet("")}>
            <Button text="Add Wallet" move="move-aside" />
          </span>
          <span onClick={() => clearEthWallets()}>
            <Button text={"Clear Wallets"} />
          </span>
        </div>
      </div>
      {ethWallets.length == 0 ? (
        <p className="white">Click Add wallet to generate a new wallet.</p>
      ) : (
        ethWallets.map((wallet, idx) => (
          <div key={idx} className="individual-wallet">
            <div className="wallet-idx">
              <div style={{ display: "flex" }}>
                <h2>Wallet {idx + 1}</h2>
                <button
                  className="show-balance"
                  onClick={() => showEthBalance(wallet.publicKey)}
                >
                  <span className="border-bottom">Show balance :</span>{" "}
                  {wallet.display ? wallet.balance + " ETH" : "Click to load"}
                </button>
              </div>
              <MdDeleteOutline
                className="icon"
                onClick={() => deleteEthWallet(idx)}
              />
            </div>
            <div className="keys">
              <div className="public-key">
                <p>Public Key</p>
                <p>{wallet.publicKey}</p>
              </div>
              <div className="private-key">
                <p>Private Key</p>
                <div className="hide-key">
                  <p>{wallet.privateKey}</p>
                  <IoEyeOutline className="icon" />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EthWallet;
