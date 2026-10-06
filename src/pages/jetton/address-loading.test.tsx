import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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
    const { container } = renderJetton(
      `/jetton/${formatAddress(master, "testnet")}?testnet=true${
        hasOwner ? `&address=${owner.toString()}` : ""
      }`,
    );

    expect(await screen.findByText("Example (EX)")).toBeVisible();
    expect(screen.getByRole("link", { name: formatAddress(master, "testnet") })).toBeVisible();
    expect(container.querySelectorAll(".MuiSkeleton-root")).toHaveLength(hasOwner ? 2 : 1);
    expect(screen.queryByRole("link", { name: formatAddress(admin, "testnet", true) })).toBeNull();
    if (hasOwner) {
      expect(screen.queryByRole("button", { name: "Connect Wallet" })).toBeNull();
    } else {
      expect(screen.getByRole("button", { name: "Connect Wallet" })).toBeVisible();
    }

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
    if (hasOwner) {
      expect(
        screen.getByRole("link", { name: formatAddress(owner, "testnet", false) }),
      ).toBeVisible();
    }
    expect(container.querySelectorAll(".MuiSkeleton-root")).toHaveLength(0);
  },
);

test.each([
  ["admin", owner, true],
  ["viewer", admin, false],
  ["revoked", new Address(0, Buffer.alloc(32)), false],
] as const)(
  "uses on-chain permissions while the admin address loads (%s)",
  async (_, onChainAdmin, canRevoke) => {
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
    expect(screen.queryByRole("button", { name: "Revoke ownership" })).toBeNull();

    await act(async () => finishDetails(getDetails(onChainAdmin)));
    const adminRow = screen.getByText("Admin").parentElement!;
    const revoke = screen.queryByRole("button", { name: "Revoke ownership" });
    if (canRevoke) {
      expect(revoke).toBeEnabled();
      fireEvent.click(revoke!);
      expect(screen.getByText("Revoke Ownership")).toBeVisible();
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
      await waitFor(() => expect(screen.queryByText("Revoke Ownership")).toBeNull());
    } else {
      expect(revoke).toBeNull();
    }
    expect(
      within(adminRow).queryByRole("link", { name: formatAddress(onChainAdmin, "mainnet", false) }),
    ).toBeNull();
    if (onChainAdmin.equals(new Address(0, Buffer.alloc(32)))) {
      expect(screen.getByText("Empty address")).toBeVisible();
      expect(screen.getByText("Ownership is revoked")).toBeVisible();
    } else {
      expect(adminRow.querySelector(".MuiSkeleton-root")).not.toBeNull();
    }

    await act(async () =>
      finishAddressBook({
        ok: true,
        json: async () => ({
          [onChainAdmin.toString()]: {
            user_friendly: formatAddress(onChainAdmin, "mainnet", false),
          },
          [owner.toString()]: { user_friendly: formatAddress(owner, "mainnet", false) },
        }),
      } as Response),
    );
    expect(
      within(adminRow).getByRole("link", {
        name: onChainAdmin.equals(new Address(0, Buffer.alloc(32)))
          ? "Empty address"
          : formatAddress(onChainAdmin, "mainnet", false),
      }),
    ).toBeVisible();
    expect(adminRow.querySelector(".MuiSkeleton-root")).toBeNull();
    if (canRevoke) expect(screen.getByRole("button", { name: "Revoke ownership" })).toBeEnabled();
    else expect(screen.queryByRole("button", { name: "Revoke ownership" })).toBeNull();
  },
);
