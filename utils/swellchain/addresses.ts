import { NetworkName } from "../network";
import { SweContractAddresses, CommonOptions } from "./types";

const SwellchainMainnetAddresses: SweContractAddresses = {
  L1CrossDomainMessenger: "0xe6a99ef12995defc5ff47ec0e13252f0e6903759",
  L2CrossDomainMessenger: "0x4200000000000000000000000000000000000007"
};

const SwellchainSepoliaAddresses: SweContractAddresses = {
  L1CrossDomainMessenger: "0xd89f9ec2d109fb5f978a3b5b846d6aa1959872fb",
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
