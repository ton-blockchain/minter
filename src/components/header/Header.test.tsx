import { fireEvent, render, screen } from "@testing-library/react";
import { SnackbarProvider } from "notistack";
import { MemoryRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { EXAMPLE_ADDRESS } from "consts";
import { Header } from "./Header";

jest.mock("components/appLogo", () => ({ AppLogo: () => null }));
jest.mock("components/header/headerMenu/HeaderMenu", () => ({
  HeaderMenu: () => null,
  MobileMenu: () => null,
}));

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

test("header example can be applied more than once", () => {
  render(
    <RecoilRoot>
      <SnackbarProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </SnackbarProvider>
    </RecoilRoot>,
  );

  const input = screen.getByPlaceholderText("Jetton address");
  const useExample = screen.getByText("Use example.");

  fireEvent.click(useExample);
  expect(input).toHaveValue(EXAMPLE_ADDRESS);

  fireEvent.change(input, { target: { value: "" } });
  expect(input).toHaveValue("");

  fireEvent.click(useExample);
  expect(input).toHaveValue(EXAMPLE_ADDRESS);
});
