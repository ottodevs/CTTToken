pragma solidity ^0.4.4;

import "./zeppelin/token/StandardToken.sol";


contract CTTToken is StandardToken{
    string public name = "CTTToken";
    string public symbol = "CTT";
    uint public decimals = 18;
    uint public INITIAL_SUPPLY = 10000;
    uint public EMISSION_RATE = 1000;
    address owner;

    event Emission(uint value);

    function SKLToken(){
        totalSupply = INITIAL_SUPPLY;
        owner = msg.sender;
        balances[msg.sender] = INITIAL_SUPPLY;
    }

    function buyToken(address _to, uint _value) returns (bool success){
        var _allowence = allowed[owner][msg.sender];
        balances[owner] = safeSub(balances[owner], _value);
        balances[_to] = safeAdd(balances[_to], _value);
        allowed[owner][msg.sender] = safeSub(_allowence, _value);
        Transfer(owner, _to, _value);
    }

    function sellToken(address _from, uint _value) returns (bool success){
        var _allowence = allowed[_from][msg.sender];
        balances[owner] = safeAdd(balances[owner], _value);
        balances[_from] = safeSub(balances[_from], _value);
        allowed[_from][msg.sender] = safeSub(_allowence, _value);
        Transfer(_from, owner, _value);
    }

    function emission() returns (bool success){
        if(msg.sender != owner){
            return false;
        }

        totalSupply = safeAdd(totalSupply, EMISSION_RATE);
        balances[owner] = safeAdd(balances[owner], EMISSION_RATE);

        Emission(EMISSION_RATE);
    }
}
