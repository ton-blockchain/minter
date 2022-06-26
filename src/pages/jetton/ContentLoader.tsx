import { Box, Skeleton, styled } from "@mui/material";

const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection:'column',
  gap: 40,
  width:'100%',
});

const StyledRightSide = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 20,
  flex: 1,
  maxWidth: 300,
  alignItems: "flex-start",
  height: "100%",
});

const StyledLeftSide = styled(Box)({
  width: 120,
  height: 120,
});

function ContentLoader() {
  return (
    <StyledContainer>
      <StyledLeftSide>
        <Skeleton variant='circular' width="100%" height="100%" />
      </StyledLeftSide>
      <StyledRightSide>
        <Skeleton width="80%" />
        <Skeleton width="60%" />
        <Skeleton width="70%" />
        <Skeleton width="90%" />
      </StyledRightSide>
    </StyledContainer>
  );
}

export default ContentLoader;
