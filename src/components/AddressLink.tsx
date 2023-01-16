import { Box, IconButton, Link, styled } from "@mui/material";
import CopyToClipboard from "react-copy-to-clipboard";
import useNotification from "hooks/useNotification";
import CopyImg from "assets/icons/copy.svg";
import { useContext } from "react";
import { EnvContext } from "App";
import { scannerUrl } from "utils";
import theme from "theme";

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
  width: 15,
});

const StyledLink = styled("div")({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "95%",
  color: "#0688CC!important",
  [theme.breakpoints.down("sm")]: {
    fontSize: 14,
  },
});

interface AddressLinkProps {
  value: string | number | JSX.Element;
  address?: string | null;
  showIcon?: boolean;
  regularAddress?: boolean;
}

const AddressLink: React.FC<AddressLinkProps> = ({
  address,
  value,
  showIcon = true,
  regularAddress,
}) => {
  const { showNotification } = useNotification();
  const { isSandbox } = useContext(EnvContext);

  const onCopy = () => {
    showNotification("Address Copied!", "success", undefined, 3000);
  };

  return (
    <StyledContainer className="address-link">
      <StyledLink>
        <Link target="_blank" href={`${scannerUrl(isSandbox, regularAddress)}/${address}`}>
          {value || "-"}
        </Link>
      </StyledLink>
      {address && showIcon && (
        <CopyToClipboard text={address} onCopy={onCopy}>
          <IconButton sx={{ mr: 2 }}>
            <StyledImg src={CopyImg} />
          </IconButton>
        </CopyToClipboard>
      )}
    </StyledContainer>
  );
};

export default AddressLink;
