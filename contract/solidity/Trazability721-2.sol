// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Trazability is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct ProductData {
        string id;
        string name;
        string trazability;
        string productReference;
        string image;
    }

    mapping(string => ProductData) private productIdToProductData;
    mapping(uint256 => string) private tokenIdToUri;
    mapping(uint256 => string) private tokenIdToProductId;

 constructor() ERC721("IDEAL-Trazabilidad-Segura TZS", "TZS") Ownable(msg.sender) {}

    function safeMint(
        address to,
        string memory productId,
        string memory name,
        string memory url,
        string memory image,
        string memory productReference,
        string memory trazability
    ) public payable  {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        ProductData memory data = ProductData({
            id: productId,
            name: name,
            trazability: trazability, // Si es necesario, se puede añadir más tarde
            productReference: productReference, // Si es necesario, se puede añadir más tarde
            image: image
        });

        // Store the product data by product ID
        productIdToProductData[productId] = data;

        // Store the relationship between token ID and product ID
        tokenIdToProductId[tokenId] = productId;

        // Assign the specific URI for the token
        tokenIdToUri[tokenId] = url;

        // Mint the token
        _safeMint(to, tokenId);
    }

    function getProductData(uint256 tokenId) public view returns (ProductData memory) {
        string memory productId = tokenIdToProductId[tokenId];
        return productIdToProductData[productId];
    }

    function getProductDataById(string memory productId) public view returns (ProductData memory) {
        return productIdToProductData[productId];
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return tokenIdToUri[tokenId];
    }
}
