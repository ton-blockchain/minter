import {
  ListItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { useTheme, Theme } from "@mui/material/styles";
import { styled } from "@mui/system";
import { Adapter, Adapters } from "tonstarter-contracts/lib/wallets/types";

const StyledListItem = styled(ListItem)({
  background: "white",
  width: "100%",
});
const StyledList = styled(List)({
  width: "100%",
});

const StyledListItemButton = styled(ListItemButton)({
  paddingLeft: 10,
});

const StyledContainer = styled(Box)({
  width: "300px",
});

const StyledConnectModalTitle = styled(Box)({
  paddingLeft: "10px",
});
const StyledListItemText = styled(ListItemText)(
  ({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.primary,
  })
);

interface Props {
  select: (adapter: Adapters) => void;
  open: boolean;
  onClose: () => void;
  adapters: Adapter[];
}

function AdaptersList({ onClose, select, open, adapters }: Props) {
  const theme = useTheme();

  if (!open) {
    return null; 
  }

  return (
    <StyledContainer>
      <StyledConnectModalTitle>
        {/* <Title onClose={onClose} text="Select Wallet" /> */}
      </StyledConnectModalTitle>
      <StyledList>
        {adapters.map((adapter) => {
          const { type, text } = adapter;
          return (
            <StyledListItem disablePadding key={type}>
              <StyledListItemButton onClick={() => select(type)}>
                <ListItemIcon style={{ minWidth: "40px" }}>
                  {/* <Icon sx={{ color: theme.palette.text.primary }} /> */}
                </ListItemIcon>
                <StyledListItemText theme={theme} primary={text} />
              </StyledListItemButton>
            </StyledListItem>
          );
        })}
      </StyledList>
    </StyledContainer>
  );
}

export default AdaptersList;
