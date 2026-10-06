import { act, render, screen } from "@testing-library/react";
import { Address } from "ton";
import { formatAddress, Network, NETWORK_CONFIG } from "lib/network";
import { PendingDeployLink } from "./PendingDeployLink";

const address = Address.parseRaw(`0:${"ab".repeat(32)}`);
const fetchMock = jest.spyOn(global, "fetch");
afterEach(() => fetchMock.mockReset());
afterAll(() => fetchMock.mockRestore());

test.each<[Network, boolean]>([
  ["mainnet", false],
  ["testnet", false],
  ["testnet", true],
])(
  "pending deployment uses Toncenter's format on %s (bounceable %s)",
  async (network, bounceable) => {
    const friendly = formatAddress(address, network, bounceable);
    const response = {
      ok: true,
      json: async () => ({
        [address.toString()]: { user_friendly: friendly },
      }),
    } as Response;
    let resolveResponse!: (response: Response) => void;
    fetchMock.mockReturnValueOnce(
      new Promise<Response>((resolve) => {
        resolveResponse = resolve;
      }),
    );
    render(<PendingDeployLink address={formatAddress(address, network)} network={network} />);
    expect(screen.getByRole("link", { name: "explorer" })).toHaveAttribute(
      "href",
      `${NETWORK_CONFIG[network].explorer}/address/${formatAddress(address, network)}`,
    );
    await act(async () => {
      resolveResponse(response);
    });
    expect(screen.getByRole("link", { name: "explorer" })).toHaveAttribute(
      "href",
      `${NETWORK_CONFIG[network].explorer}/address/${friendly}`,
    );
  },
);
