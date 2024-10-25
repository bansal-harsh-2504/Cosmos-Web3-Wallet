import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import nacl from "tweetnacl";
import { mnemonicToSeedSync } from "bip39";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import Button from "../Button/Button";
import toast from "react-hot-toast";
import "../../Pages/css/Wallet.css";
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(
  `${import.meta.env.VITE_SOL_DEVNET_CONNECTION_URL}`
);

const SolWallet = () => {
  let [mnemonic, setMnemonic] = useState("");
  let [solWallets, setSolWallets] = useState([]);
  let [solIndex, setSolIndex] = useState(0);

  const generateSolWallet = (storedSolMnemonic) => {
    let pathType = "501";
    let accountIndex = solIndex;
    const seedBuffer = mnemonicToSeedSync(mnemonic || storedSolMnemonic);
    const path = `m/44'/${pathType}'/0'/${accountIndex}'`;
    const derivedSeed = derivePath(path, seedBuffer.toString("hex")).key;
    let privateKeyEncoded, publicKeyEncoded;
    setSolIndex(accountIndex + 1);
    localStorage.setItem("solIndex", JSON.stringify(accountIndex + 1));

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
      mnemonic: mnemonic || storedSolMnemonic,
      path,
      balance: 0,
      display: false,
    };

    const updatedWallets = [...solWallets, newWallet];
    setSolWallets(updatedWallets);
    localStorage.setItem("solWallets", JSON.stringify(updatedWallets));
    return newWallet;
  };

  const getSolBalance = async (publicKey) => {
    try {
      const walletPublicKey = new PublicKey(publicKey);
      const balanceInLamports = await connection.getBalance(walletPublicKey);
      const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;
      setSolWallets((prevWallets) =>
        prevWallets.map((wallet) =>
          wallet.publicKey === publicKey
            ? { ...wallet, balance: balanceInSol, display: true }
            : wallet
        )
      );
      return balanceInSol;
    } catch (error) {
      console.error("Failed to fetch Solana wallet balance:", error);
      toast.error("Failed to fetch balance. Please try again.");
    }
  };

  const deleteSolWallet = (index) => {
    const updatedWallets = solWallets.filter((_, idx) => idx !== index);
    setSolWallets(updatedWallets);
    toast.success("Sol Wallet deleted.");
    localStorage.setItem("solWallets", JSON.stringify(updatedWallets));
  };

  const clearSolWallets = () => {
    setSolWallets([]);
    localStorage.removeItem("solWallets");
    localStorage.removeItem("solIndex");
    setSolIndex(0);
    toast.success("Sol Wallets cleared.");
  };

  useEffect(() => {
    setSolIndex(JSON.parse(localStorage.getItem("solIndex")));
    const storedSolWallets = localStorage.getItem("solWallets");
    const storedSolMnemonic = localStorage.getItem("mnemonic");
    setMnemonic(storedSolMnemonic);

    if (storedSolWallets) {
      setSolWallets(JSON.parse(storedSolWallets));
    } else {
      if (storedSolMnemonic) {
        generateSolWallet(storedSolMnemonic);
      }
    }
  }, []);
  return (
    <div className="Wallets">
      <div className="type-of-wallet">
        <h1>Solana Wallets</h1>
        <div className="add-delete-wallets">
          <span onClick={() => generateSolWallet("")}>
            <Button text="Add Wallet" move="move-aside" />
          </span>
          <span onClick={() => clearSolWallets()}>
            <Button text={"Clear Wallets"} />
          </span>
        </div>
      </div>
      {solWallets.length == 0 ? (
        <p className="white">Click Add wallet to generate a new wallet.</p>
      ) : (
        solWallets.map((wallet, idx) => (
          <div key={idx} className="individual-wallet">
            <div className="wallet-idx">
              <div style={{ display: "flex" }}>
                <h2>Wallet {idx + 1}</h2>
                <button
                  className="show-balance"
                  onClick={() => getSolBalance(wallet.publicKey)}
                >
                  <span className="border-bottom">
                    {wallet.display
                      ? "Balance: " + wallet.balance + " SOL"
                      : "Show balance"}
                  </span>{" "}
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
  );
};

export default SolWallet;
