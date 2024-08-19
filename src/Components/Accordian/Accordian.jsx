import { useEffect, useState } from "react";
import "./Accordian.css";
import { MdOutlineContentCopy } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import copyToClipboard from "../../hooks/copyToClipboard";

const Accordian = () => {
  const [mnemonic, setMnemonic] = useState([]);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    let storedMnemonic = localStorage.getItem("mnemonic");
    if (storedMnemonic) {
      try {
        setMnemonic(storedMnemonic.split(" "));
      } catch (error) {
        console.error("Error parsing mnemonic:", error);
      }
    } else {
      navigate("/import");
    }
  }, []);

  return (
    <div className={`outer-div ${selected ? "active" : ""}`}>
      <div className="arrow" onClick={() => setSelected(!selected)}>
        <h1 className="h1">Your Secret Phrase</h1>
        {selected ? <IoIosArrowUp className="arrow-icon"/>: (
            <IoIosArrowDown className="arrow-icon" />
        )}
      </div>
      <div onClick={() => copyToClipboard()}>
        <div
          className="mnemonic-container"
          style={{ display: `${selected ? "flex" : "none"}` }}
        >
          {mnemonic.map((phrase, idx) => (
            <p key={idx} className="p">{phrase}</p>
          ))}
        </div>
        <p className={`copy-anywhere ${selected ? "active" : ""}`}>
          <MdOutlineContentCopy /> Click Anywhere to Copy
        </p>
      </div>
    </div>
  );
};

export default Accordian;
