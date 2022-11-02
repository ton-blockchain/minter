import { Box, styled, Typography } from "@mui/material";
import AddressLink from "components/AddressLink";
import { FunctionComponent } from "react";
import { JettonDetailMessage } from "./types";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LoadingContainer from "components/LoadingContainer";
import FieldDescription from "components/FieldDescription";
import ReactMarkdown from "react-markdown";
import theme from "theme";

interface RowProps {
  title: string;
  value?: string | null | number | JSX.Element;
  message?: JettonDetailMessage | undefined;
  address?: string | null;
  actions?: FunctionComponent[] | undefined;
  dataLoading: boolean;
  description?: string;
  hasButton?: boolean;
}

const Row = ({
  title,
  value,
  message,
  actions,
  dataLoading,
  description,
  address,
  hasButton,
}: RowProps) => {
  return (
    <Box>
      <StyledSection>
        <StyledSectionTitle>{title}</StyledSectionTitle>
        <StyledSectionRight>
          <StyledSectionRightColored>
            <LoadingContainer loading={dataLoading} loaderHeight="50%">
              <StyledSectionValue hasButton={hasButton}>
                {address && value ? (
                  <AddressLink address={address} value={value} />
                ) : (
                  <Typography>{value || "-"}</Typography>
                )}
              </StyledSectionValue>
              {actions && (
                <StyledActions>
                  {actions.map((action, index) => {
                    const ActionComponent = action;
                    return <ActionComponent key={index} />;
                  })}
                </StyledActions>
              )}
            </LoadingContainer>
          </StyledSectionRightColored>

          {description && <FieldDescription>{description}</FieldDescription>}
          {!dataLoading && <Message message={message} />}
        </StyledSectionRight>
      </StyledSection>
    </Box>
  );
};

function LinkRenderer({ href, children }: any) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

const Message = ({ message }: { message?: JettonDetailMessage }) => {
  if (!message) {
    return null;
  }
  return (
    <StyledMessage type={message.type}>
      {message.type === "warning" ? <WarningRoundedIcon /> : <CheckCircleRoundedIcon />}

      {message.text && (
        <ReactMarkdown components={{ a: LinkRenderer }}>{message.text}</ReactMarkdown>
      )}
    </StyledMessage>
  );
};

export default Row;

const StyledMessage = styled(Box)(({ type }: { type: string }) => ({
  maxWidth: "90%",
  display: "flex",
  alignItems: "flex-start",
  gap: 5,
  paddingLeft: 10,
  fontSize: 13,
  marginTop: 11,
  "& *": {
    color: type === "success" ? "#2e7d32" : "#ff9800",
  },
  "& svg": {
    color: type === "success" ? "#2e7d32" : "#ff9800",
    width: 16,
    position: "relative",
    top: -3,
  },
  "& p": {
    margin: 0,
  },
}));

const StyledActions = styled(Box)({
  height: "100%",
  display: "flex",
  alignItems: "center",
  gap: 10,
  "& .base-button": {
    height: "calc(100% - 10px)",
    fontSize: 12,
    padding: "0px 10px",
  },
});

const StyledSectionRightColored = styled(Box)({
  height: 46,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0px 5px 0px 20px",
  background: "#F7F9FB",
  borderRadius: 40,
});

const StyledSection = styled(Box)(({ theme }) => ({}));

export const StyledSectionTitle = styled(Box)(({ theme }) => ({
  fontSize: 14,
  marginBottom: 8,
}));

const StyledSectionRight = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const StyledSectionValue = styled(Box)(({ hasButton }: { hasButton?: boolean }) => ({
  width: hasButton ? "calc(100% - 130px)" : "100%",
  display: "flex",
  alignItems: "center",
  "& .address-link": {},
  "& p": {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    paddingRight: 20,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
}));
