import { useState } from "react";
import Login from "../components/Login/Login";
import { Register } from "../components/Register/Register";

export default function App() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div>
      {showLogin ? (
        <Login onToggleView={toggleView} />
      ) : (
        <Register onToggleView={toggleView} />
      )}
    </div>
  );
}
