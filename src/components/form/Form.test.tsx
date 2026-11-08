import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form } from "./Form";
import { offchainFormSpec, onchainFormSpec } from "pages/deployer/data";

const mockShowNotification = jest.fn();
const mockDiscardLogoDraft = jest.fn();
const mockOpenModal = jest.fn().mockResolvedValue(undefined);
const mockTonConnectUI = { connected: false, openModal: mockOpenModal };
let mockConnectedAddress = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";
let mockConnectionRestored = true;

jest.mock("@tonconnect/ui-react", () => ({
  useTonAddress: () => mockConnectedAddress,
  useTonConnectUI: () => [mockTonConnectUI],
  useIsConnectionRestored: () => mockConnectionRestored,
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
    discardLogoDraft: mockDiscardLogoDraft,
  }),
}));

jest.mock("hooks/useNotification", () => () => ({
  showNotification: mockShowNotification,
}));

jest.mock("components/editLogoPopup", () => ({ EditLogoPopup: () => null }));
jest.mock("components/logoAlertPopup", () => ({ LogoAlertPopup: () => null }));

beforeEach(() => {
  mockConnectedAddress = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";
  mockConnectionRestored = true;
  mockTonConnectUI.connected = false;
  mockOpenModal.mockClear();
});

test("opens the wallet modal without a header wallet button or submitting the form", async () => {
  mockConnectedAddress = "";
  const onSubmit = jest.fn();
  render(<Form onSubmit={onSubmit} inputs={[]} submitText="Deploy" />);

  fireEvent.click(screen.getByRole("button", { name: "Connect Wallet" }));
  await act(async () => Promise.resolve());

  expect(mockOpenModal).toHaveBeenCalledTimes(1);
  expect(onSubmit).not.toHaveBeenCalled();
});

test("waits for connection restoration before allowing a new connection", async () => {
  mockConnectedAddress = "";
  mockConnectionRestored = false;
  const onSubmit = jest.fn();
  const view = render(<Form onSubmit={onSubmit} inputs={[]} submitText="Deploy" />);

  expect(screen.getByRole("button", { name: "Connect Wallet" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Connect Wallet" }));
  expect(mockOpenModal).not.toHaveBeenCalled();

  mockConnectionRestored = true;
  view.rerender(<Form onSubmit={onSubmit} inputs={[]} submitText="Deploy" />);
  expect(screen.getByRole("button", { name: "Connect Wallet" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Connect Wallet" }));
  await act(async () => Promise.resolve());
  expect(mockOpenModal).toHaveBeenCalledTimes(1);
  expect(onSubmit).not.toHaveBeenCalled();
});

test("does not open a new connection when the wallet connects before React rerenders", async () => {
  mockConnectedAddress = "";
  const onSubmit = jest.fn();
  render(<Form onSubmit={onSubmit} inputs={[]} submitText="Deploy" />);

  mockTonConnectUI.connected = true;
  fireEvent.click(screen.getByRole("button", { name: "Connect Wallet" }));
  await act(async () => Promise.resolve());

  expect(mockOpenModal).not.toHaveBeenCalled();
  expect(onSubmit).not.toHaveBeenCalled();
});

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

test("discards the logo draft when metadata editing is cancelled", () => {
  const onCancel = jest.fn();
  render(<Form onSubmit={jest.fn()} inputs={[]} submitText="Save" onCancel={onCancel} />);

  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(mockDiscardLogoDraft).toHaveBeenCalledTimes(1);
  expect(onCancel).toHaveBeenCalledTimes(1);
});
