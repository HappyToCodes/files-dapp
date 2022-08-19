export const availableNetworks = {
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    stableCoins: [
      {
        name: "USD Tether",
        contractAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        abb: "USDT",
        decimals: 6,
      },
      {
        name: "USD Coin",
        contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        abb: "USDC",
        decimals: 6,
      },
      {
        name: "DAI Coin",
        contractAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        abb: "DAI",
        decimals: 18,
      },
    ],
  },
  fantom: {
    chainId: `0x${Number(250).toString(16)}`,
    chainName: "Fantom Opera",
    nativeCurrency: {
      name: "Fantom Chain Native Token",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ftm.tools/"],
    blockExplorerUrls: ["https://ftmscan.com/"],
    stableCoins: [
      {
        name: "USD Tether",
        contractAddress: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
        abb: "USDT",
        decimals: 6,
      },
      {
        name: "USD Coin",
        contractAddress: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
        abb: "USDC",
        decimals: 6,
      },
      {
        name: "DAI Coin",
        contractAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
        abb: "DAI",
        decimals: 18,
      },
    ],
  },
  optimism: {
    chainId: `0x${Number(10).toString(16)}`,
    chainName: "Optimistic Ethereum",
    nativeCurrency: {
      name: "Optimistic Chain Native Token",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.optimism.io"],
    blockExplorerUrls: ["https://optimistic.ethereum.io"],
    stableCoins: [
      {
        name: "USD Tether",
        contractAddress: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
        abb: "USDT",
        decimals: 6,
      },
      {
        name: "USD Coin",
        contractAddress: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        abb: "USDC",
        decimals: 6,
      },
      {
        name: "DAI Coin",
        contractAddress: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        abb: "DAI",
        decimals: 18,
      },
    ],
  },
  binance: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "Binance Native Chain Token",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com"],
    stableCoins: [
      {
        name: "USD Tether",
        contractAddress: "0x55d398326f99059fF775485246999027B3197955",
        abb: "USDT",
        decimals: 6,
      },
      {
        name: "USD Coin",
        contractAddress: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        abb: "USDC",
        decimals: 6,
      },
      {
        name: "DAI Coin",
        contractAddress: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
        abb: "DAI",
        decimals: 18,
      },
    ],
  },
  ethereum: {
    chainId: `0x${Number(1).toString(16)}`,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/3d635004c08743daae3a5cb579559dbd"],
    blockExplorerUrls: ["https://etherscan.io"],
    stableCoins: [
      {
        name: "USD Tether",
        contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        abb: "USDT",
        decimals: 6,
      },
      {
        name: "USD Coin",
        contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        abb: "USDC",
        decimals: 6,
      },
      {
        name: "DAI Coin",
        contractAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
        abb: "DAI",
        decimals: 18,
      },
    ],
  },
  ethereumTestnet: {
    chainId: `0x${Number(4).toString(16)}`,
    chainName: "Ethereum Testnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
    stableCoins: [
      {
        name: "USD Tether",
        contractAddress: "0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD",
        abb: "USDT",
        decimals: 6,
      },
      {
        name: "USD Coin",
        contractAddress: "0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4",
        abb: "USDC",
        decimals: 6,
      },
      {
        name: "DAI Coin",
        contractAddress: "0x95b58a6Bff3D14B7DB2f5cb5F0Ad413DC2940658",
        abb: "DAI",
        decimals: 18,
      },
    ],
  },
};
