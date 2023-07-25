import { getDefaultConfig } from "connectkit";
import { createConfig } from "wagmi";
import { polygonMumbai } from "viem/chains";

const walletConnectProjectId = "b78a90321fdf414247141fff7aded49c";

export const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: "ERC6551 dApp",
    walletConnectProjectId,
    chains: [polygonMumbai],
  })
);
