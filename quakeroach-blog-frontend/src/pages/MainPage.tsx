import './MainPage.css'
import Box from "../components/Box";

export default function MainPage() {
  function f() {
    throw new Error("AAAA");
  }

  return (
    <div className="main-page">
      <Box>
        Hello
        <br />
        {f()}
      </Box>
    </div>
  );
}