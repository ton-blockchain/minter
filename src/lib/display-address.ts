import { Address } from "ton";
import { formatAddress, Network, NETWORK_CONFIG, TONCENTER_API_KEY } from "./network";

function parseAccount(value: Address | string): Address {
  const address = typeof value === "string" ? Address.parse(value) : value;
  if (address.hash.length !== 32) throw new Error("Invalid address hash");
  if (
    typeof value === "string" &&
    !Address.isFriendly(value) &&
    value.toUpperCase() !== address.toString().toUpperCase()
  ) {
    throw new Error("Invalid raw address");
  }
  return address;
}

function checkedFriendly(value: unknown, address: Address, network: Network): string | undefined {
  if (typeof value !== "string") return;
  try {
    const parsed = Address.parseFriendly(value);
    if (parsed.address.equals(address) && parsed.isTestOnly === (network === "testnet")) {
      return formatAddress(address, network, parsed.isBounceable);
    }
  } catch {}
}

// Like DNS, resolve presentation through Toncenter without persisting account state.
// A fallback is only a display format, not a classification of the account.
export async function getDisplayAddresses(
  values: (Address | string)[],
  network: Network,
): Promise<string[]> {
  const addresses = values.map((value) => {
    try {
      return parseAccount(value);
    } catch {
      return null;
    }
  });
  const fallback = addresses.map((address) => (address ? formatAddress(address, network) : ""));
  const rawAddresses = Array.from(
    new Set(addresses.flatMap((address) => (address ? [address.toString()] : []))),
  );
  if (!rawAddresses.length) return fallback;

  const params = new URLSearchParams();
  rawAddresses.forEach((address) => params.append("address", address));
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const request = async () => {
    const response = await fetch(`${NETWORK_CONFIG[network].toncenterV3}/addressBook?${params}`, {
      headers: { "X-API-Key": TONCENTER_API_KEY },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Unable to load address book");
    const book: unknown = await response.json();
    if (!book || typeof book !== "object" || Array.isArray(book)) return fallback;

    const entries = new Map<string, unknown>();
    Object.entries(book).forEach(([key, entry]) => {
      try {
        entries.set(parseAccount(key).toString(), entry?.user_friendly);
      } catch {}
    });
    return addresses.map((address, index) =>
      address
        ? checkedFriendly(entries.get(address.toString()), address, network) || fallback[index]
        : "",
    );
  };

  try {
    return await Promise.race([
      request(),
      new Promise<string[]>((resolve) => {
        timeout = setTimeout(() => {
          controller.abort();
          resolve(fallback);
        }, 10_000);
      }),
    ]);
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}
