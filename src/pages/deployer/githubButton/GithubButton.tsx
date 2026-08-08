import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { MINTER_GITHUB_URL } from "consts";
import { StyledGithubIcon } from "components/header/headerMenu/styled";
import githubIcon from "assets/icons/github-logo.svg";
import rightArrow from "assets/icons/right.svg";

export const GithubButton = () => {
  return (
    <IconButton
      className="github-icon"
      sx={{ padding: 0, mt: 2 }}
      href={MINTER_GITHUB_URL}
      target="_blank">
      <StyledGithubIcon width={20} height={20} src={githubIcon} />
      <Typography
        ml={1}
        variant="h5"
        sx={{
          color: "#000",
          fontWeight: 700,
          fontSize: 16,
          display: "flex",
          alignItems: "center",
        }}>
        GitHub Repo{" "}
      </Typography>
      <Box
        ml={1}
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}>
        <img
          width={14}
          height={14}
          style={{ position: "absolute", top: "-6px" }}
          src={rightArrow}
          alt="Icon"
        />
      </Box>
    </IconButton>
  );
};
