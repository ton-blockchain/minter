import { Alert, Box, IconButton, Link, Snackbar, styled } from "@mui/material";
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import ContentCopySharpIcon from "@mui/icons-material/ContentCopySharp";

interface Props {
  text: string;
  value: string;
  href?: string;
}

const StyledContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  "& a": {
    textDecoration: 'none',
    color:'unset'
  }
});

function AddressLink({ text, value, href }: Props) {
  const [success, setSuccess] = useState(false)
  return (
    <StyledContainer>
      <Link target='_blank' href={href}>{text}</Link>
      <CopyToClipboard text={value} onCopy={() => setSuccess(true)}>
        <IconButton>
          <ContentCopySharpIcon style={{ color: "black", width: 20, height: 20 }} />
        </IconButton>
      </CopyToClipboard>
      <Snackbar
      
        open={success}
        autoHideDuration={5000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity='success' sx={{ width: "100%" }}>
         Address Copied!
        </Alert>
      </Snackbar>

    </StyledContainer>
  );
}

export default AddressLink;
