import React from "react";
import { Container } from "@mui/material";

export default function App() {
  const [clicks, setClicks] = React.useState<number>(0);
  const onClick = () => {
    fetch("/api/random")
      .then(response => response.json())
      .then(data => setClicks(data));
  };

  return (
    <Container>
      <h1>Clicks: {clicks}</h1>
      <button onClick={onClick}>Click me</button>
    </Container>
  );
}
