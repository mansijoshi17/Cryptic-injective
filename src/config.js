export const crypticVaultContractEthAddress =
  "0x0005A12fFB8edf3D93E49fEb79E3ea45883B1de2";

export const crypticAgreementFactoryEthAddress =
  "0x89d050840d9B93AA6E5f73A350921dD1818059f7";

export const shortAddress = (addr) =>
  addr.length > 10 && addr.startsWith("0x")
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr;
