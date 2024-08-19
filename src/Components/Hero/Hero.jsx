import { Link } from "react-router-dom";
import Button from "../Button/Button";
import "./Hero.css";
import { motion } from "framer-motion";

const Hero = () => {
  const handleLocalStorage = () => {
    localStorage.removeItem('mnemonic');
  };
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.2,
      }}
      className="hero"
    >
      <h1>Cosmos welcomes you to the future of finance.</h1>
      <p>Secure, easy-to-use, and designed for you.</p>
      <Link to="/phrase">
        <Button
          text="Create new wallet"
          move="move-aside"
          onclick={handleLocalStorage}
        />
      </Link>
      <Link to="/import">
        <Button text="Import an existing wallet" move="" />
      </Link>
    </motion.div>
  );
};

export default Hero;
