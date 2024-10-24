import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Accordian from "../Components/Accordian/Accordian";
import bs58 from "bs58";
import { ethers } from "ethers";
import { derivePath } from "ed25519-hd-key";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import nacl from "tweetnacl";
import { mnemonicToSeedSync } from "bip39";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import Button from "../Components/Button/Button";
import toast from "react-hot-toast";
import Buffer from "buffer";
import "./css/Wallet.css";
import { Connection, PublicKey } from "@solana/web3.js";
const connection = new Connection(import.meta.env.VITE_SOL_CONNECTION_URL);

const Wallet = () => {
  let [solWallets, setSolWallets] = useState([]);
  let [mnemonic, setMnemonic] = useState("");
  let [solIndex, setSolIndex] = useState(0);
  const generateSolWallet = () => {
    let pathType = "501";
    let accountIndex = solIndex;
    const seedBuffer = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/${pathType}'/0'/${accountIndex}'`;
    setSolIndex(solIndex + 1);
    const derivedSeed = derivePath(path, seedBuffer.toString("hex")).key;
    let privateKeyEncoded, publicKeyEncoded;
    if (pathType === "501") {
      const seedUint8Array = new Uint8Array(derivedSeed.slice(0, 32));
      const { secretKey } = nacl.sign.keyPair.fromSeed(seedUint8Array);
      const keyPair = Keypair.fromSecretKey(secretKey);
      privateKeyEncoded = bs58.encode(secretKey);
      publicKeyEncoded = keyPair.publicKey.toBase58();
    }
    const newWallet = {
      publicKey: publicKeyEncoded,
      privateKey: privateKeyEncoded,
      mnemonic,
      path,
    };
    const updatedWallets = [...solWallets, newWallet];
    setSolWallets(updatedWallets);
    localStorage.setItem("solWallets", JSON.stringify(updatedWallets));
    return newWallet;
  };
  const showSolBalance = () => {}; 
  const deleteSolWallet = (index) => {
    const updatedWallets = solWallets.filter((_, idx) => idx !== index);
    setSolWallets(updatedWallets);
    toast.success("Sol Wallet deleted.");
    localStorage.setItem("solWallets", JSON.stringify(updatedWallets));
  };
  const clearSolWallets = () => {
    setSolWallets([]);
    localStorage.removeItem("solWallets");
    toast.success("Sol Wallets cleared.");
  };

  let [ethWallets, setEthWallets] = useState([]);
  let [ethIndex, setEthIndex] = useState(0);
  const generateEthWallet = () => {
    let pathType = "60";
    let accountIndex = ethIndex;
    const seedBuffer = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/${pathType}'/0'/${accountIndex}'`;
    setEthIndex(ethIndex + 1);
    const derivedSeed = derivePath(path, seedBuffer.toString("hex")).key;
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
      mnemonic,
      path,
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
    toast.success("Eth Wallets cleared.");
  };
  const showEthBalance = () => {};
  useEffect(() => {
    const storedSolWallets = localStorage.getItem("solWallets");
    if (storedSolWallets) {
      setSolWallets(JSON.parse(storedSolWallets));
    } else {
      const storedSolMnemonic = localStorage.getItem("mnemonic");
      setMnemonic(storedSolMnemonic);
      if (storedSolMnemonic) {
        generateSolWallet();
      }
    }

    const storedEthWallets = localStorage.getItem("ethWallets");
    if (storedEthWallets) {
      setEthWallets(JSON.parse(storedEthWallets));
    } else {
      const storedEthMnemonic = localStorage.getItem("mnemonic");
      setMnemonic(storedEthMnemonic);
      if (storedEthMnemonic) {
        generateEthWallet();
      }
    }
  }, []);
  return (
    <>
      <Header />
      <Accordian />
      <div className="wrapper">
        <div className="Wallets">
          <div className="type-of-wallet">
            <h1>Solana Wallets</h1>
            <div className="add-delete-wallets">
              <span onClick={() => generateSolWallet()}>
                <Button text="Add Wallet" move="move-aside" />
              </span>
              <span onClick={() => clearSolWallets()}>
                <Button text={"Clear Wallets"} />
              </span>
            </div>
          </div>
          {solWallets.length == 0 ? (
            <p>Click Add wallet to generate a new wallet.</p>
          ) : (
            solWallets.map((wallet, idx) => (
              <div key={idx} className="individual-wallet">
                <div className="wallet-idx">
                  <div style={{ display: "flex" }}>
                    <h2>Wallet {idx + 1}</h2>
                    <button
                      className="show-balance"
                      onClick={() => showSolBalance(idx)}
                    >
                      Show balance :{" "}
                    </button>
                  </div>
                  <MdDeleteOutline
                    className="icon"
                    onClick={() => deleteSolWallet(idx)}
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
        <div className="Wallets">
          <div className="type-of-wallet">
            <h1>Ethereum Wallets</h1>
            <div className="add-delete-wallets">
              <span onClick={() => generateEthWallet()}>
                <Button text="Add Wallet" move="move-aside" />
              </span>
              <span onClick={() => clearEthWallets()}>
                <Button text={"Clear Wallets"} />
              </span>
            </div>
          </div>
          {ethWallets.length == 0 ? (
            <p>Click Add wallet to generate a new wallet.</p>
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
                      Show balance :{" "}
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
        <div className="Wallets"></div>
      </div>
      <Footer position="full" />
    </>
  );
};

export default Wallet;
