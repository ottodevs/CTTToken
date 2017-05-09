pragma solidity ^0.4.4;


import "./zeppelin/token/StandardToken.sol";


contract CTTToken is StandardToken {
    string public name = "CTTToken";

    string public symbol = "CTT";

    uint public decimals = 18;

    uint public INITIAL_SUPPLY = 10000;

    uint public EMISSION_RATE = 1000;

    address owner;

    event Emission(uint value);

    function CTTToken(address initialAccount){
        totalSupply = INITIAL_SUPPLY;
        owner = msg.sender;
        balances[msg.sender] = INITIAL_SUPPLY;
    }

    function createWallet(address _client) returns (bool success){
        if (balances[_client] == 0) {
            balances[_client] = 0;
        }
    }

    function buyCoin(address _to, uint _value) returns (bool success){
//        createWallet(_to);
//        var _allowence = allowed[owner][msg.sender];
        balances[owner] = safeSub(balances[owner], _value);
        balances[_to] += _value;
//        allowed[owner][msg.sender] = safeSub(_allowence, _value);
        Transfer(owner, _to, _value);
    }

    function sellCoin(address _from, uint _value) returns (bool success){
//        createWallet(_from);
//        var _allowence = allowed[_from][msg.sender];
        balances[owner] = safeAdd(balances[owner], _value);
        balances[_from] -= _value;
//        allowed[_from][msg.sender] = safeSub(_allowence, _value);
        Transfer(_from, owner, _value);
    }

    function emission() returns (bool success){
        if (msg.sender != owner) {
            return false;
        }
        totalSupply = safeAdd(totalSupply, EMISSION_RATE);
        balances[owner] = safeAdd(balances[owner], EMISSION_RATE);

        Emission(EMISSION_RATE);
    }

    function getOwner() returns (address){
        return owner;
    }

    function getTotalSupply() returns (uint){
        return totalSupply;
    }

    function getFreeToken() returns (uint){
        return balances[owner];
    }

}
