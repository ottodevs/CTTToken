pragma solidity ^0.4.4;


import "./zeppelin/token/StandardToken.sol";


contract CTTToken is StandardToken {
    string public name = "CTTToken";

    string public symbol = "CTT";

    uint public decimals = 18;

    uint public INITIAL_SUPPLY = 10000;
    uint public INITIAL_EXCHANGE_RATE = 1000;

    uint public EMISSION_RATE = 1000;

    address owner;

    event Emission(uint value);

    event ChangingRate(uint rate);

    uint exchangeRate;

    function CTTToken(address initialAccount){
        totalSupply = INITIAL_SUPPLY;
        owner = msg.sender;
        balances[msg.sender] = INITIAL_SUPPLY;
        exchangeRate = INITIAL_EXCHANGE_RATE;
    }

    function changeExchangeRate(uint _rate) returns (bool success){
        if (msg.sender != owner) throw;
        exchangeRate = _rate;
        ChangingRate(exchangeRate);
    }

    function buyCoin(address _to, uint _value) returns (bool success){
        if (balances[owner] < _value) throw;
        balances[owner] = safeSub(balances[owner], _value);
        balances[_to] += _value;
        Transfer(owner, _to, _value);
    }

    function buyToken(address _to) public payable returns (bool success){
        if (msg.value == 0) return false;
        uint _coinCount = msg.value * exchangeRate;
        if (balances[owner] < _coinCount) {
            totalSupply = safeAdd(totalSupply, _coinCount);
            balances[owner] = safeAdd(balances[owner], _coinCount);
        }
        balances[owner] = safeSub(balances[owner], _coinCount);
        balances[msg.sender] += _coinCount;
        Transfer(owner, msg.sender, _coinCount);
    }

    function sellCoin(address _from, uint _value) returns (bool success){
        if (balances[_from] < _value) throw;
        balances[owner] = safeAdd(balances[owner], _value);
        balances[_from] -= _value;
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

    function getTotalSupply() returns (uint){
        return totalSupply;
    }

    function getFreeToken() returns (uint){
        return balances[owner];
    }

    function getExchangeRate() returns (uint){
        return exchangeRate;
    }

    function getBalance() returns (uint){
        return this.balance;
    }

}
