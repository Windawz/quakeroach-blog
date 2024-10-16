import Box from "../components/Box";

export default function LoginPage() {
  return (
    <div className="login-page">
      <Box>
        Env is "{process.env.NODE_ENV}"
      </Box>
    </div>
  );
}