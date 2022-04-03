export function getContractAddress(version) {
  console.log("NETWORK VERSION - CONTRACT ADDRESS", version);
  let contractAddress = null;
  let allAddress = [
    {
      symbol: "FTM",
      rpc: "https://rpc.ftm.tools/",
      chain_id: "250",
      lighthouse_contract_address: "0x61E296FDc8c498Ed183a2D19FD5927736E46E3B6",
    },
    {
      symbol: "MATIC",
      rpc: "https://polygon-rpc.com/",
      chain_id: "137",
      lighthouse_contract_address: "0x801206f0db68A8CBaEdCCe1346127331E326dBE5",
      deposit_contract_address: "0x78dd8C06932F76CAA8E356a4A96e9ed5b11EBFE9",
    },
    {
      symbol: "BNB",
      rpc: "https://bsc-dataseed.binance.org/",
      chain_id: "56",
      lighthouse_contract_address: "0xf81f7df9e0b2953e2666b208645a8cd5d2d9e845",
    },
    {
      symbol: "FTM",
      rpc: "https://rpc.testnet.fantom.network/",
      chain_id: "0xfa2",
      lighthouse_contract_address: "0x93a347e0fe192a31A0C81E23B4238489043A97f8",
      deposit_contract_address: "0x7506BC5C92F1675826c7E23934a2bbde91802F7e",
    },
    {
      symbol: "MATIC",
      rpc: "https://rpc-mumbai.maticvigil.com/",
      chain_id: "80001",
      lighthouse_contract_address: "0xEF5787e17efdC2cc8F6487D1F1aD2A7e04b83F6D",
      deposit_contract_address: "0x5cd3E10b00b5379e1f0303d2ED77CB3D7662e6e2",
    },
    {
      symbol: "BNB",
      rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chain_id: "97",
      lighthouse_contract_address: "0xbCEe1a1f22F316569951e8F833f61a6ffCeee535",
      deposit_contract_address: "0x7506BC5C92F1675826c7E23934a2bbde91802F7e",
    },
  ];
  let currentAddress = allAddress.filter((item) => item.chain_id === version);
  return currentAddress?.[0]?.["lighthouse_contract_address"] || null;
}
