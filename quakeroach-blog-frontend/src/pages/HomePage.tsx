import './HomePage.css'
import Box from "../components/Box";
import { ENVARS } from '../globals/envars';

export default function HomePage() {
  return (
    <div className="home-page">
      <Box>
        Hello
        <br />
        Hello "{ENVARS.baseApiUrl}"
      </Box>
    </div>
  );
}