import BN from "bn.js";
import NumberFormat from "react-number-format";
import BigNumber from "bignumber.js";
import { fromDecimals } from "utils";

interface Props {
  value: BigNumber | BN | number | string;
  decimals?: number | string;
}
function BigNumberDisplay({ value, decimals }: Props) {
  if (decimals) {
    value = fromDecimals(value.toString(), decimals);
  }
  return <NumberFormat displayType="text" value={value.toString()} thousandSeparator={true} />;
}

export default BigNumberDisplay;
