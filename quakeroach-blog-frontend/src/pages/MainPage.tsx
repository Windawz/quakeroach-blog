import './MainPage.css'
import Box from "../components/Box";
import { ENVARS } from '../envars';

export default function MainPage() {
  return (
    <div className="main-page">
      <Box>
        Hello
        <br />
        Hello {ENVARS.baseApiUrl}
      </Box>
    </div>
  );
}