// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./CrypticVaultToken.sol";

contract CrypticVault is Ownable {
    struct emergencyAlert {
        address user;
        string subject;
        string message;
    }

    mapping(address => bool) private loginStatus;
    mapping(address => mapping(address => bool)) private transferStatus;
    mapping(address => address) private users;

    mapping(address => uint256) private tokenIds;

    event TokenCreated(address, address);

    function getLoginStatus(address caller) external view returns (bool) {
        return loginStatus[caller];
    }

    function createToken(
        string calldata name,
        string calldata symbol
    ) external {
        address _address = address(new CrypticVaultToken(name, symbol)); // Created Token contract.
        // here add if else if conditions with argument module and store the address in their relevent variable.
        emit TokenCreated(msg.sender, _address);
    }

    function bulkMintERC721(
        address tokenAddress,
        uint256 start,
        uint256 end
    ) external {
        for (uint256 i = start; i < end; i++) {
            CrypticVaultToken(tokenAddress).safeMint(msg.sender);
        }
        loginStatus[msg.sender] = true;
        // Remove the next line. Will do that step in create token function.
        users[msg.sender] = tokenAddress;
        // Here we will also have token address to set the token Id of particular token's.
        setTokenId(msg.sender, end - 1);
    }

    function transferToken(
        address from,
        address payable to,
        address token,
        uint256 amount
    ) external {
        CrypticVaultToken(token).transferTokens(from, to, token, amount);
        transferStatus[from][to] = true;
    }

    function getTokenAddress(
        address userAddress
    ) external view returns (address) {
        return users[userAddress];
    }

    function setTokenId(address userAddress, uint256 tokenId) public {
        tokenIds[userAddress] = tokenId;
    }

    function getTokenId(address userAddress) external view returns (uint256) {
        return tokenIds[userAddress];
    }

    function getTransferStatus(
        address adminAddress,
        address memberAddress
    ) external view returns (bool) {
        return transferStatus[adminAddress][memberAddress];
    }
}
