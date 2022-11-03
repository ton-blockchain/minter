import { JettonDetailMessage } from "pages/jetton/types";
import { RowMessage } from "pages/jetton/dataRow/styled";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ReactMarkdown from "react-markdown";
import React from "react";

const LinkRenderer = ({ href, children }: any) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

interface MessageRendererProps {
  message?: JettonDetailMessage;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({ message }) => {
  if (!message) {
    return null;
  }
  return (
    <RowMessage type={message.type}>
      {message.type === "warning" ? <WarningRoundedIcon /> : <CheckCircleRoundedIcon />}

      {message.text && (
        <ReactMarkdown components={{ a: LinkRenderer }}>{message.text}</ReactMarkdown>
      )}
    </RowMessage>
  );
};
