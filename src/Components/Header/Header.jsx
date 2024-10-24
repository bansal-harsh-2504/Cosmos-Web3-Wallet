import Toggle from "../Toggle/Toggle";
import "./Header.css";
import useTheme from "../../contexts/theme";

const Header = () => {
  const { themeMode } = useTheme();
  return (
    <div className="header">
      <div className="logo">
        <img
          src={themeMode === "light" ? "logo.png" : "logo-white.png"}
          alt=""
        />
        <span className="logo-heading">Cosmos</span>
      </div>
      <Toggle />
    </div>
  );
};

export default Header;
