import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Button from "../Components/Button/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import "./css/Generate.css";
import { useState } from "react";
import { validateMnemonic} from "bip39";
const Generate = () => {
  const [inputVal, setInputVal] = useState("");
  const navigate = useNavigate();
  const handleOnClick = () => {
    setInputVal(inputVal.trim());
    if (inputVal == "") {
      localStorage.removeItem('mnemonic');
    }else if(validateMnemonic(inputVal)){
      localStorage.setItem("mnemonic", inputVal);
    } else {
      toast.error("Invalid recovery phrase. Please try again");
    }
    navigate("/phrase");
  };
  return (
    <>
      <Header />
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.2,
        }}
        className="hero"
      >
        <h1>Secret Recovery Phrase</h1>
        <p>Save these words in a safe place.</p>
        <div className="flex">
          <input
            type="password"
            placeholder="Enter your secret phrase (or leave blank to generate)"
            onChange={(e) => {
              setInputVal(e.target.value);
            }}
            className="input-box"
          />
          <span
            onClick={() => {
              handleOnClick();
            }}
          >
            <Button text={inputVal ? "Add Wallet" : "Generate Wallet"} />
          </span>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Generate;
