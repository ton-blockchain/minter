import { act, renderHook, waitFor } from "@testing-library/react";
import BN from "bn.js";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Address } from "ton";
import { formatAddress } from "lib/network";
import useJettonStore from "./useJettonStore";

const mockGetDetails = jest.fn();
const mockNotification = jest.fn();
jest.mock("lib/deploy-controller", () => ({
  jettonDeployController: { getJettonDetails: (...args: unknown[]) => mockGetDetails(...args) },
}));
jest.mock("@tonconnect/ui-react", () => ({ useTonAddress: () => "" }));
jest.mock("hooks/useNotification", () => () => ({ showNotification: mockNotification }));

const master = Address.parseRaw(`0:${"11".repeat(32)}`);
const admin = Address.parseRaw(`-1:${"22".repeat(32)}`);
const owner = Address.parseRaw(`0:${"33".repeat(32)}`);
const fetchMock = jest.spyOn(global, "fetch");
beforeEach(() => {
  fetchMock.mockReset();
  mockGetDetails.mockReset();
  mockGetDetails.mockResolvedValue({
    minter: {
      admin,
      totalSupply: new BN("100000000000"),
      metadata: { name: "Example", symbol: "EX", decimals: "9" },
    },
    jettonWallet: { balance: new BN("1000000000"), jWalletAddress: owner },
  });
});
afterEach(() => jest.useRealTimers());
afterAll(() => fetchMock.mockRestore());

function renderStore(balanceOwner: Address | null = owner) {
  return renderHook(() => useJettonStore(), {
    wrapper: ({ children }) => (
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            `/jetton/${formatAddress(master, "testnet")}?testnet=true${
              balanceOwner ? `&address=${formatAddress(balanceOwner, "testnet", false)}` : ""
            }`,
          ]}>
          <Routes>
            <Route path="/jetton/:id" element={children} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    ),
  });
}

function addressBook(adminAddress = admin, bounceable = false): Response {
  return {
    ok: true,
    json: async () => ({
      [adminAddress.toString()]: {
        user_friendly: formatAddress(adminAddress, "testnet", bounceable),
      },
      [owner.toString()]: { user_friendly: formatAddress(owner, "testnet", bounceable) },
    }),
  } as Response;
}

function delayAddressBook() {
  let finish!: (response: Response) => void;
  fetchMock.mockReturnValueOnce(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  return finish;
}

test.each([false, true])(
  "admin and balance owner use the API's bounceable flag (%s)",
  async (bounceable) => {
    fetchMock.mockResolvedValueOnce(addressBook(admin, bounceable));
    const { result } = renderStore();
    await act(async () => {
      await result.current.getJettonDetails();
    });
    await waitFor(() =>
      expect(result.current.adminAddress).toBe(formatAddress(admin, "testnet", bounceable)),
    );
    expect(result.current.selectedWalletAddress).toBe(formatAddress(owner, "testnet", bounceable));
    expect(result.current.jettonLoading).toBe(false);
  },
);

test("loads jetton data before addressBook returns, leaving only addresses pending", async () => {
  const finish = delayAddressBook();
  const { result } = renderStore();

  await act(async () => {
    expect(await result.current.getJettonDetails()).toBe(true);
  });
  expect(result.current.jettonLoading).toBe(false);
  expect(result.current.name).toBe("Example");
  expect(result.current.totalSupply?.toString()).toBe("100000000000");
  expect(result.current.balance?.toString()).toBe("1000000000");
  expect(result.current.adminAddress).toBeUndefined();
  expect(result.current.selectedWalletAddress).toBeUndefined();
  expect(result.current.adminAddressLoading).toBe(true);
  expect(result.current.selectedWalletAddressLoading).toBe(true);

  await act(async () => finish(addressBook()));
  expect(result.current.adminAddress).toBe(formatAddress(admin, "testnet", false));
  expect(result.current.selectedWalletAddress).toBe(formatAddress(owner, "testnet", false));
  expect(result.current.adminAddressLoading).toBe(false);
  expect(result.current.selectedWalletAddressLoading).toBe(false);
});

test("does not mark the wallet address as loading when no owner is selected", async () => {
  const finish = delayAddressBook();
  const { result } = renderStore(null);
  await act(async () => {
    await result.current.getJettonDetails();
  });
  expect(result.current.jettonLoading).toBe(false);
  expect(result.current.adminAddressLoading).toBe(true);
  expect(result.current.selectedWalletAddressLoading).toBe(false);
  await act(async () => finish(addressBook()));
  expect(result.current.selectedWalletAddress).toBeUndefined();
});

test("ends address placeholders with the existing fallback after a timeout", async () => {
  jest.useFakeTimers();
  delayAddressBook();
  const { result } = renderStore();
  await act(async () => {
    await result.current.getJettonDetails();
  });
  expect(result.current.name).toBe("Example");
  expect(result.current.jettonLoading).toBe(false);
  expect(result.current.adminAddressLoading).toBe(true);

  await act(async () => {
    jest.advanceTimersByTime(10_000);
  });
  expect(result.current.adminAddress).toBe(formatAddress(admin, "testnet"));
  expect(result.current.selectedWalletAddress).toBe(formatAddress(owner, "testnet"));
  expect(result.current.adminAddressLoading).toBe(false);
  expect(result.current.selectedWalletAddressLoading).toBe(false);
  expect(result.current.name).toBe("Example");
});

test("ignores the earlier address result after a newer load", async () => {
  const finishOld = delayAddressBook();
  const { result } = renderStore();
  await act(async () => {
    await result.current.getJettonDetails();
  });

  mockGetDetails.mockResolvedValueOnce({
    minter: { admin: master, metadata: { name: "New token", decimals: "9" } },
  });
  fetchMock.mockResolvedValueOnce(addressBook(master, true));
  await act(async () => {
    await result.current.getJettonDetails();
  });
  await waitFor(() => expect(result.current.adminAddressLoading).toBe(false));
  expect(result.current.adminAddress).toBe(formatAddress(master, "testnet", true));

  await act(async () => finishOld(addressBook()));
  expect(result.current.name).toBe("New token");
  expect(result.current.adminAddress).toBe(formatAddress(master, "testnet", true));
  expect(result.current.selectedWalletAddress).toBe(formatAddress(owner, "testnet", true));
});

test("does not restore addresses after the page invalidates the request", async () => {
  const finish = delayAddressBook();
  const { result } = renderStore();
  await act(async () => {
    await result.current.getJettonDetails();
  });
  act(() => result.current.invalidateJettonDetails());
  await act(async () => finish(addressBook()));
  expect(result.current.name).toBeUndefined();
  expect(result.current.adminAddress).toBeUndefined();
  expect(result.current.selectedWalletAddress).toBeUndefined();
  expect(result.current.adminAddressLoading).toBe(false);
  expect(result.current.selectedWalletAddressLoading).toBe(false);
});
