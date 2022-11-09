import { Link, styled, Typography } from "@mui/material";
import { ReactNode } from "react";

const StyledContainer = styled(Typography)({
  marginBottom: 15,
  fontSize: 14,
  fontWeight: 600,
  "& a": {
    fontSize: 14,
    color: "unset",
    textDecoration: "unset",
    fontWeight: 600,
  },
});
interface Props {
  children: ReactNode;
  href?: string;
}

function SectionLabel({ children, href }: Props) {
  return (
    <StyledContainer>
      {href ? (
        <Link target="_blank" href={href}>
          {children}
        </Link>
      ) : (
        children
      )}
    </StyledContainer>
  );
}

export default SectionLabel;
