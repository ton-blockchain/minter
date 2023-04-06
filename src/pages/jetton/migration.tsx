import useJettonStore from "store/jetton-store/useJettonStore";
import { AppButton } from "components/appButton";
import { CenteringWrapper } from "components/footer/styled";
import { Popup } from "components/Popup";
import { Typography } from "@mui/material";
import bullet from "assets/icons/bullet.svg";
import { Box } from "@mui/system";
import { useState } from "react";

export function MigrationPopup({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}) {
  const { symbol } = useJettonStore();

  const onClose = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    onClose();
    console.log(123);
  };

  return (
    <Popup open={open} maxWidth={600} onClose={onClose}>
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
            onClose();
            onSubmit();
          }}>
          Migration
        </AppButton>
      </CenteringWrapper>
    </Popup>
  );
}
