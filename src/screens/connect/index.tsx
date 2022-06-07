import { Button } from "@mui/material";
import  { useState } from "react";
import { Popup } from "../../components/Popup";
import DesktopFlow from "./DesktopFlow";

function ConnectScreen() {
  const [showPopup, setShowPopup] = useState(false);


  return (
    <div>
      <h1>Please connect</h1>
      <Button onClick={() => setShowPopup(true)}>Connect</Button>
      <Popup open={showPopup} onClose={() => setShowPopup(false)}>
        <div style={{ position: "relative", width:'300px', height:'300px' }}>
          <DesktopFlow />
        </div>
      </Popup>
    </div>
  );
}

export { ConnectScreen };
