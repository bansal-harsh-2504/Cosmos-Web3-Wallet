import "./App.css";
import Home from "./Pages/Home";
import Wallet from "./Pages/Wallet";
import Generate from "./Pages/Generate";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/theme";
import { useState, useEffect } from "react";
import RecoveryCode from "./Pages/RecoveryCode";

function App() {
  const [themeMode, setThemeMode] = useState("dark");
  const darkTheme = () => {
    setThemeMode("dark");
  };
  const lightTheme = () => {
    setThemeMode("light");
  };

  useEffect(() => {
    document.querySelector("body").classList.remove("dark", "light");
    document.querySelector("body").classList.add(themeMode);
  }, [themeMode]);
  return (
    <>
        <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/import" element={<Generate />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/phrase" element={<RecoveryCode />} />
          </Routes>
          <Toaster position="bottom-right" />
        </ThemeProvider>
    </>
  );
}

export default App;
