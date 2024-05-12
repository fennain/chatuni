import { http, createConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

const projectId = "d1678c54b06a65f33b97523322c7ef88";

export const config = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [walletConnect({ projectId })],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});
