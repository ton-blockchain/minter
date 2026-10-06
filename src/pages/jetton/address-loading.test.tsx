import { act, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import BN from "bn.js";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Address } from "ton";
import { formatAddress } from "lib/network";
import theme from "theme";
import { Jetton } from ".";

const mockGetDetails = jest.fn();
const mockShowNotification = jest.fn();
let mockConnectedAddress = "";
jest.mock("lib/deploy-controller", () => ({
  jettonDeployController: { getJettonDetails: (...args: unknown[]) => mockGetDetails(...args) },
}));
jest.mock("@tonconnect/ui-react", () => ({
  useTonAddress: () => mockConnectedAddress,
  useTonConnectUI: () => [{}],
  TonConnectButton: () => null,
}));
jest.mock("hooks/useNotification", () => () => ({ showNotification: mockShowNotification }));
jest.mock("react-markdown", () => ({ children }: { children: React.ReactNode }) => <>{children}</>);

const master = Address.parseRaw(`0:${"11".repeat(32)}`);
const admin = Address.parseRaw(`-1:${"22".repeat(32)}`);
const owner = Address.parseRaw(`0:${"33".repeat(32)}`);
const getDetails = (adminAddress = admin) => ({
  minter: {
    admin: adminAddress,
    totalSupply: new BN("100000000000"),
    metadata: { name: "Example", symbol: "EX", decimals: "9" },
  },
  jettonWallet: { balance: new BN("1000000000"), jWalletAddress: owner },
});
const renderJetton = (path: string) =>
  render(
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/jetton/:id" element={<Jetton />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </RecoilRoot>,
  );
const fetchMock = jest.spyOn(global, "fetch");
beforeEach(() => {
  fetchMock.mockReset();
  mockConnectedAddress = "";
  mockGetDetails.mockResolvedValue(getDetails());
});
afterAll(() => fetchMock.mockRestore());

test.each([true, false])(
  "shows jetton data while only address rows wait (selected owner: %s)",
  async (hasOwner) => {
    let finish!: (response: Response) => void;
    fetchMock.mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    renderJetton(
      `/jetton/${formatAddress(master, "testnet")}?testnet=true${
        hasOwner ? `&address=${owner.toString()}` : ""
      }`,
    );

    expect(await screen.findByText("Example (EX)")).toBeVisible();
    expect(screen.getByRole("link", { name: formatAddress(master, "testnet") })).toBeVisible();
    expect(screen.getByText("100")).toBeVisible();
    expect(screen.getByText("1")).toBeVisible();
    expect(screen.getByRole("group", { name: "Admin" })).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("group", { name: "Wallet Address" })).toHaveAttribute(
      "aria-busy",
      String(hasOwner),
    );
    expect(screen.queryByRole("link", { name: formatAddress(admin, "testnet", true) })).toBeNull();
    expect(screen.queryAllByRole("button", { name: "Connect Wallet" })).toHaveLength(
      hasOwner ? 0 : 1,
    );

    await act(async () =>
      finish({
        ok: true,
        json: async () => ({
          [admin.toString()]: { user_friendly: formatAddress(admin, "testnet", true) },
          [owner.toString()]: { user_friendly: formatAddress(owner, "testnet", false) },
        }),
      } as Response),
    );
    expect(screen.getByRole("link", { name: formatAddress(admin, "testnet", true) })).toBeVisible();
    expect(screen.getByRole("group", { name: "Admin" })).toHaveAttribute("aria-busy", "false");
    expect(screen.getByRole("group", { name: "Wallet Address" })).toHaveAttribute(
      "aria-busy",
      "false",
    );
    expect(
      screen.queryAllByRole("link", { name: formatAddress(owner, "testnet", false) }),
    ).toHaveLength(hasOwner ? 1 : 0);
  },
);

const beginPendingLoad = (onChainAdmin = owner) => {
  mockConnectedAddress = owner.toFriendly();
  let finishDetails!: (details: ReturnType<typeof getDetails>) => void;
  let finishAddressBook!: (response: Response) => void;
  mockGetDetails.mockReturnValueOnce(
    new Promise((resolve) => {
      finishDetails = resolve;
    }),
  );
  fetchMock.mockReturnValueOnce(
    new Promise((resolve) => {
      finishAddressBook = resolve;
    }),
  );
  renderJetton(`/jetton/${formatAddress(master, "mainnet")}`);
  return {
    loadDetails: () => finishDetails(getDetails(onChainAdmin)),
    loadAddresses: () =>
      finishAddressBook({
        ok: true,
        json: async () => ({
          [onChainAdmin.toString()]: {
            user_friendly: formatAddress(onChainAdmin, "mainnet", false),
          },
          [owner.toString()]: { user_friendly: formatAddress(owner, "mainnet", false) },
        }),
      } as Response),
  };
};

test("admin actions are ready before address presentation", async () => {
  const load = beginPendingLoad();
  expect(screen.queryByRole("button", { name: "Revoke ownership" })).toBeNull();
  await act(async () => load.loadDetails());
  expect(screen.getByRole("button", { name: "Revoke ownership" })).toBeEnabled();
  expect(screen.getByRole("group", { name: "Admin" })).toHaveAttribute("aria-busy", "true");
  expect(
    screen.queryAllByRole("link", { name: formatAddress(owner, "mainnet", false) }),
  ).toHaveLength(0);
  await act(async () => load.loadAddresses());
  expect(screen.getByRole("button", { name: "Revoke ownership" })).toBeEnabled();
  expect(screen.getByRole("group", { name: "Admin" })).toHaveAttribute("aria-busy", "false");
  expect(
    screen.getAllByRole("link", { name: formatAddress(owner, "mainnet", false) }),
  ).toHaveLength(2);
});

test("opens revoke confirmation while addressBook is pending", async () => {
  const load = beginPendingLoad();
  await act(async () => load.loadDetails());
  fireEvent.click(screen.getByRole("button", { name: "Revoke ownership" }));
  expect(screen.getByText("Revoke Ownership")).toBeVisible();
  await act(async () => load.loadAddresses());
});

test.each([
  { name: "viewer", onChainAdmin: admin, emptyCount: 0 },
  { name: "revoked", onChainAdmin: new Address(0, Buffer.alloc(32)), emptyCount: 1 },
])(
  "keeps revoke unavailable to $name while addresses load",
  async ({ onChainAdmin, emptyCount }) => {
    const load = beginPendingLoad(onChainAdmin);
    expect(screen.queryByRole("button", { name: "Revoke ownership" })).toBeNull();
    await act(async () => load.loadDetails());
    expect(screen.queryByRole("button", { name: "Revoke ownership" })).toBeNull();
    expect(screen.queryAllByText("Empty address")).toHaveLength(emptyCount);
    expect(screen.queryAllByText("Ownership is revoked")).toHaveLength(emptyCount);
    await act(async () => load.loadAddresses());
    expect(screen.queryByRole("button", { name: "Revoke ownership" })).toBeNull();
  },
);
