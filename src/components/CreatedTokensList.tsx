import React from "react";
import { Box, Typography, IconButton, styled, Tooltip } from "@mui/material";
import { useCreatedTokens } from "hooks/useCreatedTokens";
import { useNavigatePreserveQuery } from "lib/hooks/useNavigatePreserveQuery";
import { ROUTES } from "consts";
import close from "assets/icons/close.svg";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const TokensWrapper = styled(Box)({
  background: "rgba(29, 38, 51, 0.8)",
  backdropFilter: "blur(0.5px)",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "0 1px 1px 0 #2D3945 inset",
  borderRadius: 24,
  padding: 24,
});

const TokenItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  background: "#131B25",
  borderRadius: 20,
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  cursor: "pointer",
  transition: "0.2s all",
  "&:hover": {
    borderColor: "#1EAEFB",
  },
});

const TokenName = styled(Typography)({
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: 600,
});

const TokenAddress = styled(Typography)({
  color: "#93A5B8",
  fontSize: 12,
});

export const CreatedTokensList: React.FC = () => {
  const { tokens, removeToken } = useCreatedTokens();
  const navigate = useNavigatePreserveQuery();

  if (tokens.length === 0) return null;

  return (
    <TokensWrapper>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography sx={{ color: "#FFFFFF", fontSize: 16, fontWeight: 600 }}>
          Your created tokens
        </Typography>
        <Tooltip
          title="Created tokens are stored only in your browser. No data is sent to any server."
          arrow
          placement="top"
          componentsProps={{
            tooltip: {
              sx: {
                background: "#1D2633",
                border: "0.5px solid #364459",
                borderRadius: "10px",
                color: "#93A5B8",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.35,
                padding: "10px 16px",
                boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.3)",
              },
            },
            arrow: {
              sx: {
                color: "#1D2633",
              },
            },
          }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "1px solid #364459",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "rgba(29, 38, 51, 0.8)",
              "&:hover": {
                background: "rgba(37, 50, 68, 0.8)",
              },
            }}>
            <HelpOutlineIcon sx={{ color: "#93A5B8", width: 12, height: 12 }} />
          </Box>
        </Tooltip>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {tokens.map((token) => (
          <TokenItem
            key={token.address}
            onClick={() => navigate(`${ROUTES.jetton}/${token.address}`)}>
            <Box>
              <TokenName>
                {token.name} ({token.symbol})
              </TokenName>
              <TokenAddress>{token.address.slice(0, 20)}...</TokenAddress>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                removeToken(token.address);
              }}>
              <img src={close} alt="Remove" width={14} height={14} />
            </IconButton>
          </TokenItem>
        ))}
      </Box>
    </TokensWrapper>
  );
};
