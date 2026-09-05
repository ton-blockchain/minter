import { fireEvent, render, screen } from "@testing-library/react";
import { AppNumberInput } from "./AppInput";

test("keeps a pasted negative amount negative so validation can reject it", () => {
  const onChange = jest.fn();
  render(<AppNumberInput value="" label="Amount" onChange={onChange} />);

  fireEvent.change(screen.getByRole("textbox"), { target: { value: "-100" } });

  expect(onChange).toHaveBeenLastCalledWith("-100");
});
