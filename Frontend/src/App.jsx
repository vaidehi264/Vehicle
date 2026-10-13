import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h1>Vehicle Home Page</h1>;
}

function About() {
  return <h1>About Vehicle</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>{" | "}
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;