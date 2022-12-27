import { Box, Typography } from "@mui/material";
import AddressLink from "components/AddressLink";
import React, { FunctionComponent, useState } from "react";
import { JettonDetailMessage } from "pages/jetton/types";
import LoadingContainer from "components/LoadingContainer";
import {
  RowActionsButton,
  RowContent,
  RowTitle,
  RowValueDisplayer,
  RowValueSection,
} from "pages/jetton/dataRow/styled";
import { MessageRenderer } from "pages/jetton/dataRow/utils";
import { AppHeading } from "components/appHeading";
import { AppButton } from "components/appButton";
import { CenteringWrapper, SearchBarInput } from "components/header/headerSearchBar/styled";
import { Popup } from "components/Popup";
import { PopupTitle } from "components/editLogoPopup/styled";
import { useNavigate } from "react-router-dom";

interface DataRowProps {
  title: string;
  value?: string | null | number | JSX.Element;
  message?: JettonDetailMessage | undefined;
  address?: string | null;
  actions?: FunctionComponent[] | undefined;
  dataLoading: boolean;
  description?: string;
  hasButton?: boolean;
  showIcon?: boolean;
}

export const DataRow: React.FC<DataRowProps> = ({
  title,
  value,
  message,
  actions,
  dataLoading,
  description,
  address,
  hasButton,
  showIcon = true,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [val, setVal] = useState<string>("");
  const navigate = useNavigate();

  return (
    <Box>
      <Popup open={showPopup} onClose={() => setShowPopup(false)} maxWidth={592}>
        <PopupTitle>Check balance for another address</PopupTitle>
        <Typography sx={{ alignSelf: "baseline" }} mb={1.5}>
          Enter address to check balance:
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "auto",
            padding: "0px 17px",
            width: "100%",
            minHeight: 50,
            height: "100%",
            transition: "0.1s all",
            background: "#F7F9FB",
            border: "0.5px solid rgba(114, 138, 150, 0.16)",
            borderRadius: 40,
          }}>
          <SearchBarInput
            placeholder="Jetton address"
            onPaste={(e: any) => setVal(e.target.value)}
            onChange={(e) => setVal(e.target.value)}
            value={val}
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                //@ts-ignore
                navigate("/jetton/" + e.target.value, { replace: true });
                setShowPopup(false);
              }
            }}
          />
        </Box>
      </Popup>
      <RowTitle variant="h6">
        {title === "Wallet Address" ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {title}{" "}
            <Box>
              <AppButton onClick={() => setShowPopup(true)} transparent>
                Switch wallet address
              </AppButton>
            </Box>
          </Box>
        ) : (
          title
        )}
      </RowTitle>
      <RowContent>
        <RowValueDisplayer>
          <LoadingContainer loading={dataLoading} loaderHeight="50%">
            <RowValueSection hasButton={hasButton}>
              {address && value ? (
                <AddressLink address={address} value={value} showIcon={showIcon} />
              ) : (
                <Typography>{value || "-"}</Typography>
              )}
            </RowValueSection>
            {actions && (
              <RowActionsButton>
                {actions.map((action, index) => {
                  const ActionComponent = action;
                  return <ActionComponent key={index} />;
                })}
              </RowActionsButton>
            )}
          </LoadingContainer>
        </RowValueDisplayer>

        {description && (
          <AppHeading
            text={description}
            variant="h6"
            marginTop={4}
            fontSize={12}
            fontWeight={500}
            marginLeft={20}
            color="rgba(114,138,150,0.7)"
          />
        )}
        {!dataLoading && <MessageRenderer message={message} />}
      </RowContent>
    </Box>
  );
};
