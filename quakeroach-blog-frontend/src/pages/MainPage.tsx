import Belt from "../components/Belt";
import Box from "../components/Box";
import LinkButton from "../components/LinkButton";
import './MainPage.css'

export default function MainPage() {
  return (
    <div className="main-page">
      <div className="top">
        <LinkButton url="/" text="Quakeroach" />
        <Belt direction="horizontal">
          <LinkButton url="/write" text="New Entry" />
          <LinkButton url="/all" text="All AAaaaaa EEawe" />
        </Belt>
      </div>
      <Box>
        Hello
        <br />
        Hello
      </Box>
    </div>
  );
}