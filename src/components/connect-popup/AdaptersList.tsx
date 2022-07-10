import {
  ListItem,
  List,
  ListItemButton,
  Box,
  Typography,
  Fade,
} from "@mui/material";
import { useTheme, Theme } from "@mui/material/styles";
import { styled } from "@mui/system";
import TonhubImg from "assets/tonhub.png";
import ChromeExtImg from "assets/chrome.svg";
import { Providers } from "lib/env-profiles";
import { isMobile } from "react-device-detect";
import Header from "./Header";

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

const StyledContainer = styled(Box)({});

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
    // TODO sy
    name: "Tonhub",
    icon: TonhubImg,
    mobileCompatible: true,
    description: "A mobile wallet in your pocket",
  },
  [Providers.EXTENSION]: {
    name: "Google Chrome Plugin",
    icon: ChromeExtImg,
    mobileCompatible: false,
    description: "TON Wallet Plugin for Google Chrome",
  },
};

function AdaptersList({ onClose, select, open, adapters }: Props) {
  const theme = useTheme();

  if (!open) {
    return null;
  }

  return (
    <Fade in>
      <StyledContainer>
        <Header title="Select Wallet" onClose={onClose} />
        <StyledList>
          {adapters
            .filter((a) => !isMobile || adapterConfig[a.type].mobileCompatible)
            .map((adapter) => {
              const { type } = adapter;
              // @ts-ignore todo sy
              const { icon, name, description } = adapterConfig[type];

              return (
                <StyledListItem disablePadding key={type}>
                  <StyledListItemButton onClick={() => select(type)}>
                    <StyledIcon src={icon} />
                    <StyledListItemRight theme={theme}>
                      <Typography variant="h5">{name}</Typography>
                      <Typography>{description}</Typography>
                    </StyledListItemRight>
                  </StyledListItemButton>
                </StyledListItem>
              );
            })}
        </StyledList>
      </StyledContainer>
    </Fade>
  );
}

export default AdaptersList;
