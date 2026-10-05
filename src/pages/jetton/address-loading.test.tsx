import { act, render, screen } from "@testing-library/react";
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
jest.mock("lib/deploy-controller", () => ({
  jettonDeployController: { getJettonDetails: (...args: unknown[]) => mockGetDetails(...args) },
}));
jest.mock("@tonconnect/ui-react", () => ({
  useTonAddress: () => "",
  useTonConnectUI: () => [{}],
  TonConnectButton: () => null,
}));
jest.mock("hooks/useNotification", () => () => ({ showNotification: mockShowNotification }));
jest.mock("react-markdown", () => ({ children }: { children: React.ReactNode }) => <>{children}</>);

const master = Address.parseRaw(`0:${"11".repeat(32)}`);
const admin = Address.parseRaw(`-1:${"22".repeat(32)}`);
const owner = Address.parseRaw(`0:${"33".repeat(32)}`);
const fetchMock = jest.spyOn(global, "fetch");
beforeEach(() => {
  fetchMock.mockReset();
  mockGetDetails.mockResolvedValue({
    minter: {
      admin,
      totalSupply: new BN("100000000000"),
      metadata: { name: "Example", symbol: "EX", decimals: "9" },
    },
    jettonWallet: { balance: new BN("1000000000"), jWalletAddress: owner },
  });
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
    const { container } = render(
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <MemoryRouter
            initialEntries={[
              `/jetton/${formatAddress(master, "testnet")}?testnet=true${
                hasOwner ? `&address=${owner.toString()}` : ""
              }`,
            ]}>
            <Routes>
              <Route path="/jetton/:id" element={<Jetton />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </RecoilRoot>,
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
