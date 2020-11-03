pragma solidity =0.5.16;

import '../UniswapV2ERC20.sol';

contract ERC20 is UniswapV2ERC20 {
    string public name;
    string public symbol;

    constructor(uint _totalSupply, string memory _symbol, string memory _name) public {
        name = _name;
        symbol = _symbol;
        _mint(msg.sender, _totalSupply);
    }
}
