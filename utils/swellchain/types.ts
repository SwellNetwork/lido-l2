export type SweContractNames =
  | "L1CrossDomainMessenger"
  | "L2CrossDomainMessenger";

export type SweContractAddresses = Record<SweContractNames, string>;
export type CustomSweContractAddresses = Partial<SweContractAddresses>;
export interface CommonOptions {
  customAddresses?: CustomSweContractAddresses;
}
