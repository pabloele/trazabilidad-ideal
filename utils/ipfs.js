const DEFAULT_IPFS_GATEWAY = "https://ipfs.io/ipfs/";
const DEFAULT_PINATA_API_URL = "https://api.pinata.cloud";

const getGatewayBase = () => {
  const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || DEFAULT_IPFS_GATEWAY;
  if (!gateway) {
    return DEFAULT_IPFS_GATEWAY;
  }
  return gateway.endsWith("/") ? gateway : `${gateway}/`;
};

const stripIpfsPrefix = (value) =>
  value.replace(/^ipfs:\/\//, "").replace(/^ipfs\//, "");

export const buildIpfsUrl = (cidOrPath) => {
  if (!cidOrPath || typeof cidOrPath !== "string") {
    return "";
  }

  const normalized = stripIpfsPrefix(cidOrPath);
  if (!normalized) {
    return "";
  }

  return `${getGatewayBase()}${normalized}`;
};

const getPinataApiBase = () =>
  process.env.NEXT_PUBLIC_IPFS_API_URL || DEFAULT_PINATA_API_URL;

const getPinataAuthHeaders = () => {
  const apiKey = process.env.NEXT_PUBLIC_IPFS_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_IPFS_KEY_SECRET;

  if (!apiKey || !apiSecret) {
    return null;
  }

  return {
    pinata_api_key: apiKey,
    pinata_secret_api_key: apiSecret,
  };
};

export const pinFileToIpfs = async (file, options = {}) => {
  const headers = getPinataAuthHeaders();
  if (!headers) {
    throw new Error("Missing Pinata API credentials");
  }

  const formData = new FormData();
  const fileName = options.fileName || file?.name || "file";
  formData.append("file", file, fileName);

  if (options.metadata) {
    formData.append("pinataMetadata", JSON.stringify(options.metadata));
  }

  if (options.options) {
    formData.append("pinataOptions", JSON.stringify(options.options));
  }

  const response = await fetch(`${getPinataApiBase()}/pinning/pinFileToIPFS`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Pinata error ${response.status}: ${errorBody || response.statusText}`
    );
  }

  const data = await response.json();
  return {
    path: data.IpfsHash,
    url: buildIpfsUrl(data.IpfsHash),
    data,
  };
};

export const pinJsonToIpfs = async (content, options = {}) => {
  const headers = getPinataAuthHeaders();
  if (!headers) {
    throw new Error("Missing Pinata API credentials");
  }

  const response = await fetch(`${getPinataApiBase()}/pinning/pinJSONToIPFS`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataContent: content,
      pinataMetadata: options.metadata,
      pinataOptions: options.options,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Pinata error ${response.status}: ${errorBody || response.statusText}`
    );
  }

  const data = await response.json();
  return {
    path: data.IpfsHash,
    url: buildIpfsUrl(data.IpfsHash),
    data,
  };
};

export const resolveIpfsUrl = (value) => {
  if (!value || typeof value !== "string") {
    return value;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    if (value.includes("/ipfs/")) {
      const parts = value.split("/ipfs/");
      const ipfsPath = parts[parts.length - 1];
      return buildIpfsUrl(ipfsPath);
    }

    return value;
  }

  return buildIpfsUrl(value);
};
