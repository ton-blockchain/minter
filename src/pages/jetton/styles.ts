import { Box, styled, Typography } from "@mui/material";

export const StyledSection = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
  
    gap: 15,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      gap: 5,
    },
  }));
  
  export const StyledMessage = styled(Box)(({ type }: { type: string }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 5,
    paddingLeft: 10,
    fontSize: 13,
    marginTop: 11,
    color: type === "success" ? "#2e7d32" : "#EE404C",
    "& svg": {
      color: type === "success" ? "#2e7d32" : "#EE404C",
      width: 16,
      position: "relative",
      top: -3,
    },
  }));
  
  export const StyledSectionTitle = styled(Box)(({ theme }) => ({
    width: 120,
    paddingLeft: 0,
    paddingTop: 14,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      paddingLeft: 0,
      paddingTop: 0,
    },
  }));
  
  export const StyledSectionRight = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "calc(100% - 135px)",
  
    "& .base-button": {
      height: "calc(100% - 10px)",
      fontSize: 12,
      padding:'0px 10px'
    },
  
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  }));
  
  export const StyledSectionRightColored = styled(Box)({
    borderRadius: 10,
    height: 46,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0px 5px 0px 20px",
    background: "#EDF2F7",
  });
  
  export const StyledSectionValue = styled(Box)(
    ({ hasButton }: { hasButton: boolean }) => ({
      width: hasButton ? "calc(100% - 140px)" : "100%",
      display: "flex",
      alignItems: "center",
      "& .address-link": {},
      "& p": {
        flex: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingRight: 20,
      },
    })
  );
  
  export const StyledContainer = styled(Box)(({ theme }) => ({
    
    display: "flex",
    gap: 30,
    flexDirection: "column",
    width: "100%",
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: "auto",
    padding: "60px 0px",
    [theme.breakpoints.down("sm")]: {
      padding: "30px 20px",
    },
  }));
  
  export const StyledTop = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: 30,
  });
  
  export const StyledTopText = styled(Box)({
    color: "#27272E",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    flex: 1,
    "& h5": {
      fontSize: 15,
      fontWeight: 400,
    },
    "& h3": {
      fontSize: 19,
      fontWeight: 600,
    },
  });
  
  export const StyledTopImg = styled(Box)(({ theme }) => ({
    width: 90,
    height: 90,
    borderRadius: "50%",
    overflow: "hidden",
    background: "rgba(0,0,0, 0.1)",
    border: "13px solid #D9D9D9",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    [theme.breakpoints.down("sm")]: {
      width: 60,
      height: 60,
      border: "2px solid #D9D9D9",
    },
  }));
  
  export const StyledTextSections = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: 24,
  });
  
  
  export const StyledCategoryTitle = styled(Typography)({
    fontWeight: 500,
    fontSize: 18,
    marginTop: 20,
  })