import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import BaseButton from "components/BaseButton";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Popup } from "components/Popup";

interface Props {
  onSubmit: () => void;
  open: boolean;
}

function FaultyDeploy({ onSubmit, open }: Props) {
  return (
    <Popup open={open} onClose={() => {}}>
      <StyledWarningPopup>
        <Box className="header">
          <WarningAmberRoundedIcon />
          <Typography>Some warning</Typography>
        </Box>
        <Typography className="description">Some description</Typography>
        <BaseButton onClick={onSubmit}>Action</BaseButton>
      </StyledWarningPopup>
    </Popup>
  );
}

export default FaultyDeploy;

export const StyledWarningPopup = styled(Box)({
  width: 300,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  "& .header": {
    display: "flex",
    gap: 10,
    "* ": {
      color: "rgb(255, 152, 0)",
    },
    "& p": {
      fontSize: 22,
      fontWeight: 500,
    },
    "& svg": {
      position: "relative",
      top: 4,
    },
  },
  "& .description": {
    fontSize: 16,
    marginTop: 20,
  },
  "& .base-button": {
    marginTop: 40,
    height: 40,
    width: 200,
  },
});
