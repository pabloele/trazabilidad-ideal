// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract Trazability_copy is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
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

    mapping(string => uint256) lotToTokenId;
    mapping(uint256 => ProductData) tokenIdToProductData;

    constructor() ERC721("Ideal Trazabilidad", "IDEAL") {}

    event ProductMinted(
        address indexed owner,
        uint256 indexed tokenId,
        string lotNumber
    );

    function safeMint(
        address to,
        string memory uri,
        ProductData memory data,
        string memory lotNumber
    ) public {
        require(
            lotToTokenId[lotNumber] == 0,
            "Este lote ya tiene un producto asociado"
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        lotToTokenId[lotNumber] = tokenId;

        // Almacenar los datos del producto por ID de token
        tokenIdToProductData[tokenId] = ProductData({
            id: data.id,
            lotNumber: data.lotNumber,
            protocolName: data.protocolName,
            name: data.name,
            status: data.status,
            ownerUid: data.ownerUid,
            trazability: data.trazability
        });

        emit ProductMinted(to, tokenId, lotNumber);
    }

    function getProductDataByLotNumber(
        string memory lotNumber
    ) public view returns (ProductData memory) {
        require(
            bytes(lotNumber).length > 0,
            "Numero de lote no puede estar vacio"
        );

        uint256 tokenId = lotToTokenId[lotNumber];

        return tokenIdToProductData[tokenId];
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
