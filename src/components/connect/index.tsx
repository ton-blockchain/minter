
import useMainStore from "store/main-store/useMainStore";
import { Popup } from "../Popup";
import DesktopFlow from "./DesktopFlow";

function Connect() {
  const { showConnectModal, toggleConnectPopup } = useMainStore();
  return (
    <Popup open={showConnectModal} onClose={() => toggleConnectPopup(false)}>
      <div style={{ position: "relative", width: "330px", padding: '20px'}}>
        <DesktopFlow />
      </div>
    </Popup>
  );
}

export default Connect;
