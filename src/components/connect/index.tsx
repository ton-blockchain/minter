import { styled } from "@mui/material";
import { Box } from "@mui/system";
import useMainStore from "store/main-store/useMainStore";
import { Popup } from "../Popup";
import DesktopFlow from "./DesktopFlow";


const SyledContainer = styled(Box)({
  position: "relative",
  width: 330,
  padding: 20,
});

function Connect() {
  const { showConnectModal, toggleConnectPopup } = useMainStore();
  return (
    <Popup open={showConnectModal} onClose={() => toggleConnectPopup(false)}>
      <SyledContainer>
        <DesktopFlow />
      </SyledContainer>
    </Popup>
  );
}

export default Connect;
