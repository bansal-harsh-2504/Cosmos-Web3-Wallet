import { useEffect, useState } from "react";
import Button from "../Components/Button/Button";
import { Link } from "react-router-dom";
import { generateMnemonic } from "bip39";
import copyToClipboard from "../hooks/copyToClipboard";
import "./css/RecoveryCodes.css";
import Header from "../Components/Header/Header";

const RecoveryCode = () => {
  const [checked, setChecked] = useState(false);
  const [mnemonic, setMnemonic] = useState([]);
  useEffect(() => {
    let storedMnemonic = generateMnemonic();
    localStorage.setItem("mnemonic", storedMnemonic);
    localStorage.removeItem("solWallets");
    localStorage.removeItem("ethWallets");
    setMnemonic(storedMnemonic.split(" "));
  }, []);
  return (
    <>
      <Header />
      <div className="center">
        <h1>Secret Recovery Phrase</h1>
        <p>
          This phrase is the ONLY way to recover your wallet.
          <br /> Do NOT share it with anyone!
        </p>
        <div className="secret-phrase" onClick={() => copyToClipboard()}>
          <div className="flex-phrase">
            {mnemonic.map((phrase, idx) => (
              <div key={idx} className="phrase">
                <p key={idx}>
                  <span className="span">{idx + 1 + " "}</span>
                  {phrase}
                </p>
              </div>
            ))}
          </div>
          <div className="copy">
            <p>Click anywhere on this card to copy</p>
          </div>
        </div>
        <input
          type="checkbox"
          className="input"
          id="checkbox"
          onChange={(e) => setChecked(e.target.checked)}
        />{" "}
        <label htmlFor="checkbox" className="label">
          I saved my secret recovery phrase
        </label>
        <br />
        <Link to={"/wallet"}>
          <Button
            text="Next"
            disabled={!checked}
            move={`btn-wide ${checked ? "" : "o-6"}`}
          />
        </Link>
      </div>{" "}
    </>
  );
};

export default RecoveryCode;
