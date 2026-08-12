import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form } from "./Form";
import { offchainFormSpec, onchainFormSpec } from "pages/deployer/data";

const mockShowNotification = jest.fn();

jest.mock("@tonconnect/ui-react", () => ({
  useTonAddress: () => "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
}));

jest.mock("hooks/useJettonAddress", () => ({
  useJettonAddress: () => ({ jettonAddress: undefined }),
}));

jest.mock("hooks/useJettonLogo", () => ({
  useJettonLogo: () => ({
    jettonLogo: {
      logoUrl: "https://example.com/logo.png",
      image: "https://example.com/logo.png",
      iconHover: false,
      isLoading: false,
      hasError: false,
    },
    setIconHover: jest.fn(),
  }),
}));

jest.mock("hooks/useNotification", () => () => ({
  showNotification: mockShowNotification,
}));

jest.mock("components/editLogoPopup", () => ({ EditLogoPopup: () => null }));
jest.mock("components/logoAlertPopup", () => ({ LogoAlertPopup: () => null }));

test("numeric form examples are stored as strings", () => {
  const numericInputs = [...onchainFormSpec, ...offchainFormSpec].filter(
    (input) => input.type === "number",
  );

  expect(numericInputs).not.toHaveLength(0);
  expect(numericInputs.every((input) => typeof input.default === "string")).toBe(true);
});

test("keeps repeated numeric examples as exact strings", async () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);
  render(
    <Form
      onSubmit={onSubmit}
      inputs={[
        {
          name: "mintAmount",
          label: "Tokens to Mint",
          description: "Initial supply.",
          type: "number",
          default: 21000000,
          required: true,
          errorMessage: "Mint amount required",
        },
      ]}
      submitText="Deploy"
    />,
  );

  const useExample = screen.getByText("Use example.");
  fireEvent.click(useExample);
  fireEvent.click(useExample);
  fireEvent.click(screen.getByRole("button", { name: "Deploy" }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ mintAmount: "21000000" })),
  );
});
