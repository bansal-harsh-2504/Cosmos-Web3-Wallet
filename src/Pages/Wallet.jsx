import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Accordian from "../Components/Accordian/Accordian";
import bs58 from "bs58";
import { ethers } from "ethers";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { validateMnemonic, mnemonicToSeedSync } from "bip39";

const Wallet = () => {
  return (
    <>
      <Header />
      <Accordian/>
      
      <Footer />
    </>
  );
};

export default Wallet;
