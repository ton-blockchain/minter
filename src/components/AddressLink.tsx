import { Box, IconButton, Link, styled } from "@mui/material";
import CopyToClipboard from "react-copy-to-clipboard";
import useNotification from "hooks/useNotification";
import CopyImg from "assets/copy.svg";
import { useContext } from "react";
import { EnvContext } from "App";
import { scannerUrl } from "utils";
import theme from "theme";

interface Props {
  address?: string | null;
  value?: string | number | JSX.Element;
}

const StyledContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  "& a": {
    textDecoration: "none",
    color: "unset",
  },
});

const StyledImg = styled("img")({
  width: 20,
});

const StyledLink = styled("div")({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "80%",
  color: "#0688CC!important",
  [theme.breakpoints.down("sm")]: {
    fontSize: 14,
  },
});

function AddressLink({ address, value }: Props) {
  const { showNotification } = useNotification();
  const { isSandbox } = useContext(EnvContext);

  const onCopy = () => {
    showNotification("Address Copied!", "success", undefined, 3000);
  };

  return (
    <StyledContainer className="address-link">
      <StyledLink>
        <Link target="_blank" href={`${scannerUrl(isSandbox)}/${address}`}>
          {value || "-"}
        </Link>
      </StyledLink>
      {address && (
        <CopyToClipboard text={address} onCopy={onCopy}>
          <IconButton>
            <StyledImg src={CopyImg} />
          </IconButton>
        </CopyToClipboard>
      )}
    </StyledContainer>
  );
}

export default AddressLink;
