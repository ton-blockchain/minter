import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Jetton } from ".";
import ConnectAction from "./actions/ConnectAction";

const mockGetJettonDetails = jest.fn();
const mockInvalidateJettonDetails = jest.fn();
const mockShowNotification = jest.fn();
const mockOpenModal = jest.fn().mockResolvedValue(undefined);
const mockTonConnectUI = { connected: false, openModal: mockOpenModal };
let mockConnectedAddress = "";
let mockConnectionRestored = true;
let mockSelectedAddress: string | null = null;

jest.mock("@tonconnect/ui-react", () => ({
  useTonAddress: () => mockConnectedAddress,
  useTonConnectUI: () => [mockTonConnectUI],
  useIsConnectionRestored: () => mockConnectionRestored,
}));

jest.mock("hooks/useJettonAddress", () => ({
  useJettonAddress: () => ({
    isAddressEmpty: false,
    jettonAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
  }),
}));

jest.mock("hooks/useNotification", () => () => ({
  showNotification: mockShowNotification,
}));

jest.mock("store/jetton-store/useJettonStore", () => () => ({
  getJettonDetails: mockGetJettonDetails,
  invalidateJettonDetails: mockInvalidateJettonDetails,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => [
    new URLSearchParams(mockSelectedAddress ? { address: mockSelectedAddress } : {}),
  ],
}));

jest.mock("components/Screen", () => ({
  Screen: ({ children }: { children: React.ReactNode }) => children,
  ScreenContent: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("pages/jetton/dataRow/token", () => ({ Token: () => null }));
jest.mock("pages/jetton/styled", () => ({
  StyledContainer: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("pages/jetton/wallet", () => ({ Wallet: () => null }));
jest.mock("./FaultyDeploy", () => () => null);

beforeEach(() => {
  mockGetJettonDetails.mockReset();
  mockInvalidateJettonDetails.mockReset();
  mockShowNotification.mockReset();
  mockOpenModal.mockClear();
  mockConnectedAddress = "";
  mockConnectionRestored = true;
  mockTonConnectUI.connected = false;
  mockSelectedAddress = null;
});

test("opens the wallet modal from ConnectAction without a header wallet button", () => {
  render(<ConnectAction />);

  fireEvent.click(screen.getByRole("button", { name: "Connect Wallet" }));

  expect(mockOpenModal).toHaveBeenCalledTimes(1);
});

test("ConnectAction waits for connection restoration", () => {
  mockConnectionRestored = false;
  const view = render(<ConnectAction />);

  expect(screen.getByRole("button", { name: "Connect Wallet" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Connect Wallet" }));
  expect(mockOpenModal).not.toHaveBeenCalled();

  mockConnectionRestored = true;
  view.rerender(<ConnectAction />);
  expect(screen.getByRole("button", { name: "Connect Wallet" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Connect Wallet" }));
  expect(mockOpenModal).toHaveBeenCalledTimes(1);
});

test("ConnectAction is hidden for a connected wallet", () => {
  mockConnectedAddress = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";
  mockTonConnectUI.connected = true;
  render(<ConnectAction />);

  expect(screen.queryByRole("button", { name: "Connect Wallet" })).toBeNull();
  expect(mockOpenModal).not.toHaveBeenCalled();
});

test("ConnectAction checks the current connection before opening the modal", () => {
  render(<ConnectAction />);
  mockTonConnectUI.connected = true;

  fireEvent.click(screen.getByRole("button", { name: "Connect Wallet" }));

  expect(mockOpenModal).not.toHaveBeenCalled();
});

test("reloads jetton details when the selected wallet query parameter changes", async () => {
  const view = render(<Jetton />);

  await waitFor(() => expect(mockGetJettonDetails).toHaveBeenCalledTimes(1));

  mockSelectedAddress = "0:1111111111111111111111111111111111111111111111111111111111111111";
  view.rerender(<Jetton />);
  await waitFor(() => expect(mockGetJettonDetails).toHaveBeenCalledTimes(2));

  mockSelectedAddress = null;
  view.rerender(<Jetton />);
  await waitFor(() => expect(mockGetJettonDetails).toHaveBeenCalledTimes(3));

  view.unmount();
  expect(mockInvalidateJettonDetails).toHaveBeenCalledTimes(3);
});
