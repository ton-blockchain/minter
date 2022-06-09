import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ROUTES } from "consts";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { connectionStateAtom } from "store/connection-store";

function Navbar() {
  const navigate = useNavigate();
  const data = useRecoilValue(connectionStateAtom);
  const resetConnection = useResetRecoilState(connectionStateAtom);

  const disconnect = () => {
    resetConnection();
    navigate(ROUTES.connect);
    // killSession() // TODO add this functionality
  };

  return (
    <div className="navbar" style={{ display: "flex" }}>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Typography>{data.address}</Typography>
        {data.address &&  <Button onClick={disconnect}>Disconnect</Button>}
      </Box>
    </div>
  );
}

export default Navbar;
