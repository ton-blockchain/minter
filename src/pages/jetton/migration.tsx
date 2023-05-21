import useJettonStore from "store/jetton-store/useJettonStore";
import { AppButton } from "components/appButton";
import { CenteringWrapper } from "components/footer/styled";
import { Popup } from "components/Popup";
import { Typography } from "@mui/material";
import bullet from "assets/icons/bullet.svg";
import { Box } from "@mui/system";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

export function MigrationPopup({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}) {
  const { symbol } = useJettonStore();
  const [progress, setProgress] = useState([false, false, false]);
  const [migrationStarted, setMigrationStarted] = useState(false);
  const [showRedirectButton, setShowRedirectButton] = useState(false);

  const navigate = useNavigate();

  const onClose = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    setMigrationStarted(true);
    setTimeout(() => sendTransaction(0), 1300);
    setTimeout(() => sendTransaction(1), 2600);
    setTimeout(() => sendTransaction(2), 3900);
  };

  const deployNewJetton = async () => {};

  const deployMigrationMaster = async () => {};

  const mintJettonsToMaster = async () => {};

  const sendTransaction = async (index: number) => {
    switch (index) {
      case 0:
        await deployNewJetton();
        break;
      case 1:
        await deployMigrationMaster();
        break;
      case 2:
        await mintJettonsToMaster();
        break;
      default:
        break;
    }

    // Update the progress state
    setProgress((prevProgress) => {
      const newProgress = [...prevProgress];
      newProgress[index] = true;
      return newProgress;
    });

    // If this is the last transaction, show the redirect button
    if (index === 2) {
      setShowRedirectButton(true);
    }
  };

  const redirectToNewPage = () => {
    const newJettonAddress = "EQAGPPuLtcu8BimtY8TFVrpJ-E36akEFZHexCSD_BNQl_QrW";
    navigate(`/jetton/${newJettonAddress}`);
  };

  return (
    <Popup open={open} maxWidth={600} onClose={onClose}>
      {!migrationStarted ? (
        <>
          <Box ml={3} mt={-1} mb={-0.6} sx={{ alignSelf: "baseline", color: "#464646" }}>
            <Typography
              sx={{
                color: "#161C28",
                fontWeight: 800,
                fontSize: 20,
                marginBottom: 3.2,
                textAlign: "center",
              }}>
              Initiate migration
            </Typography>
            <Typography sx={{ fontWeight: 500, marginBottom: 2.2 }}>
              This operation will initiate the migration process of the <br /> token{" "}
              <span style={{ fontWeight: 900 }}>{symbol}</span>. This means:
            </Typography>
            <ul
              style={{
                listStyleImage: `url(${bullet})`,
                paddingLeft: 20,
                fontWeight: 500,
                marginBottom: 0,
              }}>
              <li style={{ marginBottom: 10 }}>
                <span style={{ paddingLeft: 5 }}>
                  New Jetton contract will be deployed with the same settings
                </span>
              </li>
              <li style={{ marginBottom: 10 }}>
                <span style={{ paddingLeft: 5 }}>
                  Users will need to migrate their <span style={{ fontWeight: 900 }}>{symbol}</span>{" "}
                  manually{" "}
                </span>
              </li>
              <li style={{ marginBottom: 10 }}>
                <span style={{ paddingLeft: 5 }}>
                  Your project should support the new version of the Jetton
                </span>
              </li>
            </ul>
            <Typography textAlign="left" sx={{ fontWeight: 700 }}>
              You should consider these points before initiating the migration.
            </Typography>
          </Box>
          <CenteringWrapper>
            <Box mr={4.2}>
              <AppButton transparent width={100} onClick={() => onClose()}>
                Cancel
              </AppButton>
            </Box>
            <AppButton
              width={100}
              onClick={() => {
                onSubmit();
              }}>
              Migration
            </AppButton>
          </CenteringWrapper>
        </>
      ) : (
        <>
          <TransactionProgress progress={progress} />
          {showRedirectButton && (
            <AppButton
              width={200}
              onClick={() => {
                onClose();
                redirectToNewPage();
              }}>
              Go to the new Jetton
            </AppButton>
          )}
        </>
      )}
    </Popup>
  );
}

function TransactionProgress({ progress }: { progress: boolean[] }) {
  return (
    <div>
      <Typography
        sx={{
          color: "#161C28",
          fontWeight: 800,
          fontSize: 20,
          marginBottom: 3.2,
          textAlign: "center",
        }}>
        Migration process
      </Typography>

      <Typography sx={{ color: "red", marginBottom: 2 }}>
        Do not close this page until you finish the process.
      </Typography>

      {progress.map((done, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          sx={{ gap: 2, marginBottom: done && index === progress.length - 1 ? -1 : 2 }}>
          <Spinner spinning={!done} />
          <Typography variant="body1">Transaction {index + 1}</Typography>
        </Box>
      ))}
    </div>
  );
}

function Spinner({ spinning }: { spinning: boolean }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {spinning ? <CircularProgress size={24} /> : <CheckCircleIcon color="primary" />}
    </Box>
  );
}
