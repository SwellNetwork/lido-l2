import contracts from "./contracts";
import network, { NetworkName } from "../network";
import { CommonOptions } from "./types";
import { CrossChainMessenger, MessageStatus } from "@eth-optimism/sdk";

interface ContractsOptions extends CommonOptions {
  forking: boolean;
}

interface MessageData {
  sender: string;
  recipient: string;
  calldata: string;
  gasLimit?: number;
}

export default function messaging(
  networkName: NetworkName,
  options: ContractsOptions
) {
  const [ethProvider, sweProvider] = network
    .multichain(["eth", "swe"], networkName)
    .getProviders(options);

  const optContracts = contracts(networkName, options);
  const crossChainMessenger = new CrossChainMessenger({
    l2ChainId: network.chainId("swe", networkName),
    l1SignerOrProvider: ethProvider,
    l2SignerOrProvider: sweProvider,
    l1ChainId: network.chainId("eth", networkName),
  });
  return {
    prepareL2Message(msg: MessageData) {
      const calldata =
        optContracts.L1CrossDomainMessenger.interface.encodeFunctionData(
          "sendMessage",
          [msg.recipient, msg.calldata, msg.gasLimit || 1_000_000]
        );
      return { calldata, callvalue: 0 };
    },
    async waitForL2Message(txHash: string) {
      await crossChainMessenger.waitForMessageStatus(
        txHash,
        MessageStatus.RELAYED
      );
    },
  };
}
