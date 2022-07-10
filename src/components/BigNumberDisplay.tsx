import React from "react";
import NumberFormat from "react-number-format";

interface Props {
  value: string | number;
}
function BigNumberDisplay({ value }: Props) {
  return (
    <NumberFormat displayType="text" value={value} thousandSeparator={true} />
  );
}

export default BigNumberDisplay;
