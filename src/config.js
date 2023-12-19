export const crypticVaultContractEthAddress =
  "0xdaF54DEB8d15c2f1b1E4bc18FE3E7e19E0EE239F";

export const crypticAgreementFactoryEthAddress =
  "0xeAD8E99c0af2601113456D2d118d151D4b789076";

export const shortAddress = (addr) =>
  addr.length > 10 && addr.startsWith("0x")
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr;
