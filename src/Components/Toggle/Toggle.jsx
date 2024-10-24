import "./Toggle.css";
import useTheme from "../../contexts/theme";
import { useEffect } from "react";

const Toggle = () => {
  useEffect(() => {
    if (
      localStorage.getItem("theme") == null ||
      localStorage.getItem("theme") == "dark"
    ) {
      darkTheme();
    } else if (localStorage.getItem("theme") == "light") {
      lightTheme();
    }
  }, []);
  const onChangeBtn = (e) => {
    const darkModeStatus = e.currentTarget.checked;
    if (darkModeStatus) {
      localStorage.setItem("theme", "dark");
      darkTheme();
    } else {
      localStorage.setItem("theme", "light");
      lightTheme();
    }
  };

  const { themeMode, lightTheme, darkTheme } = useTheme();

  return (
    <div className="theme">
      <img
        src={themeMode === "light" ? "light.svg" : "light-light.svg"}
        className="light"
        alt=""
      />
      <input
        type="checkbox"
        className="theme-checkbox"
        onChange={onChangeBtn}
        checked={themeMode === "dark"}
      />
      <img
        src={themeMode === "light" ? "dark.svg" : "dark-light.svg"}
        className="dark"
        alt=""
      />
    </div>
  );
};

export default Toggle;
