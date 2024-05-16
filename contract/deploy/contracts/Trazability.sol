// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract Trazability is ERC1155, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct ProductData {
        string id;
        string lotNumber;
        string protocolName;
        string name;
        string status;
        string ownerUid;
        string trazability;
    }

    mapping(string => ProductData) productIdToProductData;
    mapping(uint256 => string) tokenIdToUri;
    mapping(uint256 => string) tokenIdToProductId; // Agregado este mapeo

    constructor() ERC1155("Trazabilidad Ideal") {}

    function safeMint(
        address to,
        ProductData memory data,
        uint256 amount,
        string memory externalUri
    ) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Convert struct to bytes
        bytes memory dataBytes = abi.encodePacked(
            data.id,
            data.lotNumber,
            data.protocolName,
            data.status,
            data.ownerUid,
            data.trazability
        );

        // Mint 'amount' tokens with the specified external URI
        _mint(to, tokenId, amount, dataBytes);

        // Almacenar los datos del producto por ID de producto
        productIdToProductData[data.id] = ProductData({
            id: data.id,
            lotNumber: data.lotNumber,
            protocolName: data.protocolName,
            name: data.name,
            status: data.status,
            ownerUid: data.ownerUid,
            trazability: data.trazability
        });

        // Almacenar la relación entre el ID de token y el ID de producto
        tokenIdToProductId[tokenId] = data.id;

        // Asignar el URI específico del token
        tokenIdToUri[tokenId] = externalUri;
    }

    function getProductData(string memory productId) public view returns (ProductData memory) {
        return productIdToProductData[productId];
    }

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return tokenIdToUri[tokenId];
    }
}
