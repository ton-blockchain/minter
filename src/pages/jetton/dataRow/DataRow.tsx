import { Box, Typography } from "@mui/material";
import AddressLink from "components/AddressLink";
import React, { FunctionComponent } from "react";
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

export interface DataRowProps {
  title: string;
  value?: string | null | number | JSX.Element;
  message?: JettonDetailMessage | undefined;
  address?: string | null;
  actions?: FunctionComponent[] | undefined;
  dataLoading: boolean;
  description?: string;
  hasButton?: boolean;
  showIcon?: boolean;
  children?: React.ReactNode;
  regularAddress?: boolean;
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
  children,
  regularAddress,
}) => {
  return (
    <Box>
      <RowTitle variant="h6">{children ? children : title}</RowTitle>
      <RowContent>
        <RowValueDisplayer>
          <LoadingContainer loading={dataLoading} loaderHeight="50%">
            <RowValueSection hasButton={hasButton}>
              {address && value ? (
                <AddressLink
                  address={address}
                  value={value}
                  showIcon={showIcon}
                  regularAddress={regularAddress}
                />
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
