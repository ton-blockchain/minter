import { render, waitFor } from "@testing-library/react";
import { Jetton } from ".";

const mockGetJettonDetails = jest.fn();
const mockInvalidateJettonDetails = jest.fn();
const mockShowNotification = jest.fn();
let mockSelectedAddress: string | null = null;

jest.mock("@tonconnect/ui-react", () => ({
  useTonAddress: () => "",
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
  mockSelectedAddress = null;
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
