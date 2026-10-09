import { useEffect, useState } from "react";
import { getDisplayAddresses } from "lib/display-address";
import { Network } from "lib/network";

export function useDisplayAddresses(addresses: string[], network: Network): string[] {
  // Compare by content: callers may recreate the address array on each render.
  const requestKey = JSON.stringify([network, addresses]);
  const [result, setResult] = useState({ requestKey: "", addresses: [] as string[] });

  useEffect(() => {
    let current = true;
    const [requestNetwork, requestAddresses]: [Network, string[]] = JSON.parse(requestKey);
    getDisplayAddresses(requestAddresses, requestNetwork).then((formatted) => {
      if (current) setResult({ requestKey, addresses: formatted });
    });
    return () => {
      current = false;
    };
  }, [requestKey]);

  // Never show the preceding account/network while its replacement is loading.
  return result.requestKey === requestKey ? result.addresses : [];
}
