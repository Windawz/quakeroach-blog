import { envars } from "../globals/envars";

export default function DevPage() {
  return (
    <div className='dev-page'>
      <div className='box'>
        Environment: {process.env.NODE_ENV}
      </div>
      <div className='box'>
        Api base url: {envars.baseApiUrl}
      </div>
    </div>
  );
}