import { Skeleton } from "@mui/material";
import React, { ReactNode } from "react";

interface Props {
  loading: boolean;
  children: ReactNode;
  loaderWidth?: string;
  loaderHeight?: string;
}

function LoadingContainer({
  loading,
  children,
  loaderWidth = "70%",
  loaderHeight = "25px",
}: Props) {
  return <>{loading ? <Skeleton width={loaderWidth} height={loaderHeight} /> : children}</>;
}

export default LoadingContainer;
