// Sources flattened with hardhat v2.14.0 https://hardhat.org

// File @openzeppelin/contracts/utils/Context.sol@v4.8.3

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}


// File @openzeppelin/contracts/access/Ownable.sol@v4.8.3


// OpenZeppelin Contracts (last updated v4.7.0) (access/Ownable.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File contracts/CrypticAgreement.sol


pragma solidity ^0.8.4;

contract CrypticAgreement is Ownable {
    string name;
    string cid;
    address creator;
    string status;

    mapping(address => bool) public signed;
    address[] members;
    uint256 signedMembers;

    constructor(
        string memory _name,
        string memory _cid,
        address _creator,
        string memory _status
    ) {
        name = _name;
        cid = _cid;
        creator = _creator;
        status = _status;
    }

    function addMembers(address[] calldata _members) external {
        require(msg.sender == creator, "Only owner can add members");
        for (uint256 i = 0; i < _members.length; i++) {
            signed[address(_members[i])] = false;
            members.push(_members[i]);
        }
    }

    function checkMember(address memberAddress) public view returns (bool) {
        bool containsMember = false;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == memberAddress) {
                containsMember = true;
            }
        }
        return containsMember;
    }

    function signAgreement(address signer) external {
        bool containsMember = checkMember(signer);
        require(containsMember, "You are not member of this agreement");
        require(!signed[signer], "You have already signed agreement");
        signed[signer] = true;
        signedMembers = signedMembers + 1;
    }

    function checkAgreementStatus() external view returns (string memory) {
        if (signedMembers == members.length) {
            return "Signed";
        } else {
            return "Unsigned";
        }
    }

    function getMembers() external view returns (address[] memory) {
        return members;
    }

    function getName() external view returns (string memory) {
        return name;
    }

    function getCid() external view returns (string memory) {
        return cid;
    }

    function setCid(string memory _cid) external {
        cid = _cid;
    }

    function getOwner() external view returns (address) {
        return creator;
    }
}


// File contracts/CrypticAgreementFactory.sol


pragma solidity ^0.8.4;


contract CrypticAgreementFactory is Ownable {
    mapping(address => address[]) private agreemets;

    event agreementCreated(address agreement);

    function createAgreement(
        string calldata name,
        string calldata cid,
        string calldata status
    ) external returns (address) {
        CrypticAgreement agreementContract = new CrypticAgreement(
            name,
            cid,
            msg.sender,
            status
        );
        agreemets[msg.sender].push(address(agreementContract));
        emit agreementCreated(address(agreementContract));
        return address(agreementContract);
    }

    function getAgrrements(address userAddress)
        external
        view
        returns (address[] memory)
    {
        return agreemets[userAddress];
    }
}
