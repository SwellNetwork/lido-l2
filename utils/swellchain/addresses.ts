import { NetworkName } from "../network";
import { SweContractAddresses, CommonOptions } from "./types";

const SwellchainMainnetAddresses: SweContractAddresses = {
  L1CrossDomainMessenger: "0x0000000000000000000000000000000000000000", // todo
  L2CrossDomainMessenger: "0x4200000000000000000000000000000000000007"
};

const SwellchainSepoliaAddresses: SweContractAddresses = {
  L1CrossDomainMessenger: "0x0000000000000000000000000000000000000000", // todo
  L2CrossDomainMessenger: "0x4200000000000000000000000000000000000007",
};

export default function addresses(  
  networkName: NetworkName,
  options: CommonOptions = {}
) {
  switch (networkName) {
    case "mainnet":
      return { ...SwellchainMainnetAddresses, ...options.customAddresses };
    case "sepolia":
      return { ...SwellchainSepoliaAddresses, ...options.customAddresses };
    default:
      throw new Error(`Network "${networkName}" is not supported`);
  }
}
