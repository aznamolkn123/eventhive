import { useState } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    fetch("/api/health") 
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);
  return <div>...</div>;
}

export default App;
