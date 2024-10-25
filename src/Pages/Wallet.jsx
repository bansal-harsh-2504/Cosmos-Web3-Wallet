import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Accordian from "../Components/Accordian/Accordian";
import "./css/Wallet.css";
import EthWallet from "../Components/Wallet/EthWallet";
import SolWallet from "../Components/Wallet/SolWallet";

const Wallet = () => {
  return (
    <>
      <Header />
      <Accordian />
      <div className="wrapper">
        <SolWallet />
        <EthWallet />
        <div className="Wallets"></div>
      </div>
      <Footer position="full" />
    </>
  );
};

export default Wallet;
