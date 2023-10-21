import { ListItem, List, ListItemButton, Box, Typography, Fade } from "@mui/material";
import { useTheme, Theme } from "@mui/material/styles";
import { styled } from "@mui/system";
import TonhubImg from "assets/icons/tonhub.png";
import ChromeExtImg from "assets/icons/chrome.svg";
import OpenMaskImg from "assets/icons/openmask-logo.svg";
import { Providers } from "lib/env-profiles";
import { isMobile } from "react-device-detect";
import Header from "./Header";
import { useNetwork } from "../../lib/hooks/useNetwork";

const StyledListItem = styled(ListItem)({
  background: "white",
  width: "100%",
});
const StyledList = styled(List)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 30,
  padding: 0,
});

const StyledListItemButton = styled(ListItemButton)({
  padding: 0,
});

const StyledIcon = styled("img")({
  width: "40px",
  height: "40px",
  objectFit: "cover",
  marginRight: "24px",
});

const StyledListItemRight = styled(Box)(({ theme }: { theme: Theme }) => ({
  "& h5": {
    color: theme.palette.secondary.main,
    fontSize: "18px",
    fontWeight: "500",
    marginBottom: "5px",
  },
  "& p": {
    color: theme.palette.secondary.main,
    fontSize: "14px",
    opacity: "0.7",
  },
}));

interface Props {
  // todo sy any
  select: (adapter: Providers) => void;
  open: boolean;
  onClose: () => void;
  adapters: { type: Providers }[];
}

const adapterConfig = {
  [Providers.TON_HUB]: {
    name: "Tonhub",
    icon: TonhubImg,
    mobileCompatible: true,
    testnetCompatible: false, // When TC2 is available this distinction becomes obsolete
  },
  [Providers.TONKEEPER]: {
    name: "Tonkeeper",
    icon: "https://tonkeeper.com/assets/tonconnect-icon.png", // TODO
    mobileCompatible: true,
    testnetCompatible: true,
  },

  [Providers.EXTENSION]: {
    name: "Google Chrome Plugin",
    icon: ChromeExtImg,
    mobileCompatible: false,
    testnetCompatible: true,
  },
  [Providers.OPEN_MASK]: {
    name: "OpenMask",
    icon: OpenMaskImg,
    mobileCompatible: false,
    testnetCompatible: true,
  },
};

function AdaptersList({ onClose, select, open, adapters }: Props) {
  const theme = useTheme();
  const { network } = useNetwork();

  if (!open) {
    return null;
  }

  return (
    <Fade in>
      <Box>
        <Header title="Select Wallet" onClose={onClose} />
        <StyledList>
          {adapters
            .filter(
              (a) =>
                (!isMobile || adapterConfig[a.type].mobileCompatible) &&
                (network === "mainnet" || adapterConfig[a.type].testnetCompatible),
            )
            .map((adapter) => {
              const { type } = adapter;
              const { icon, name } = adapterConfig[type];

              return (
                <StyledListItem disablePadding key={type}>
                  <StyledListItemButton onClick={() => select(type)}>
                    <StyledIcon src={icon} />
                    <StyledListItemRight theme={theme}>
                      <Typography variant="h5">{name}</Typography>
                    </StyledListItemRight>
                  </StyledListItemButton>
                </StyledListItem>
              );
            })}
        </StyledList>
      </Box>
    </Fade>
  );
}

export default AdaptersList;
