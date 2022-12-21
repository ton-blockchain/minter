import React from "react";
import { Box, styled, Typography } from "@mui/material";
import { TypographyProps } from "@mui/material/Typography/Typography";
import { Variant } from "@mui/material/styles/createTypography";

interface HeadingWrapperProps {
  marginLeft?: number;
  marginTop?: number;
  marginBottom?: number;
}

const HeadingWrapper = styled(Box)((props: HeadingWrapperProps) => ({
  marginLeft: props.marginLeft,
  marginTop: props.marginTop,
  marginBottom: props.marginBottom,
  width: "100%",
}));

interface HeadingTextProps {
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  textAlign?: TypographyProps["align"];
}

const HeadingText = styled(Typography)((props: HeadingTextProps) => ({
  fontSize: props.fontSize || 14,
  fontWeight: props.fontWeight || 400,
  color: props.color || "#000",
  textAlign: props.textAlign,
  wordBreak: "break-all",
}));

interface AppHeadingProps extends HeadingWrapperProps, HeadingTextProps {
  text: string;
  variant: Variant;
  limitText?: number;
}

export const AppHeading: React.FC<AppHeadingProps> = ({
  marginLeft,
  marginTop,
  marginBottom,
  fontSize,
  fontWeight,
  color,
  textAlign,
  text,
  variant,
  limitText,
}) => {
  return (
    <HeadingWrapper marginLeft={marginLeft} marginTop={marginTop} marginBottom={marginBottom}>
      <HeadingText
        variant={variant}
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
        textAlign={textAlign}>
        {limitText ? text.slice(0, limitText) + `${text.length >= limitText ? "..." : ""}` : text}
      </HeadingText>
    </HeadingWrapper>
  );
};
