// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
    }

    mapping(uint256 => ProductData) private _productData;
    mapping(string => uint256) private _productIdToTokenId;

    constructor() ERC721("TrazabilityToken", "TTK") {}

    function safeMint(
        address to,
        ProductData memory data,
        string memory externalUri
    ) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _productData[tokenId] = data;
        _productIdToTokenId[data.id] = tokenId;
        _setTokenURI(tokenId, externalUri);
    }

    function getProductData(uint256 tokenId) public view returns (ProductData memory) {
        require(_exists(tokenId), "Token does not exist");
        return _productData[tokenId];
    }

    function getProductDataById(string memory productId) public view returns (ProductData memory) {
        uint256 tokenId = _productIdToTokenId[productId];
        require(_exists(tokenId), "Product ID does not exist");
        return _productData[tokenId];
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    mapping(uint256 => string) private _tokenURIs;

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
