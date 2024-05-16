// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataStorage {
    struct ProductData {
        string id;
        string name;
        string trazability;
        string productReference;
    }

    mapping(uint256 => ProductData) private products;

    function storeProductData(
        uint256 tokenId,
        string memory id,
        string memory name,
        string memory trazability,
        string memory productReference
    ) public {
        products[tokenId] = ProductData(id, name, trazability, productReference);
    }

    function getProductData(uint256 tokenId) public view returns (ProductData memory) {
        return products[tokenId];
    }
}
