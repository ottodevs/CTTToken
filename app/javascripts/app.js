// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import {default as Web3} from 'web3';
import {default as contract} from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);

import ctttoken_artifact from '../../build/contracts/CTTToken.json'
var CTTToken = contract(ctttoken_artifact);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var Daccount1;
var Daccount2;

var gasAmount = 3000000;
var gasPrice = 20000000000;

window.App = {
    start: function () {
        var self = this;

        CTTToken.setProvider(web3.currentProvider);

        // Get the initial account balance so it can be displayed.
        web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }

            accounts = accs;
            account = accounts[0];

            Daccount1 = accounts[1];
            Daccount2 = accounts[2];

            // self.refreshBalance();
            self.refreshCTT();
            self.loadFirstBalance();
            self.loadSecondBalance();
            self.refreshExchangeRate();
            self.refreshETH();
        });
    },

    setStatus: function (message) {
        $("#status").html(message);
    },

    changeExchangeRate: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            var newRate = $('#newRate').val();
            console.log(newRate);
            return token.changeExchangeRate.call(newRate, {from: account})
        })
            .then(function () {
                console.log('success changing rate');
                self.refreshExchangeRate();
            })
            .catch(function (e) {
                self.setStatus('Error during change rate; see log;');
                console.log(e);
            })
    },

    refreshBalance: function () {
        var self = this;

        var meta;
        MetaCoin.deployed().then(function (instance) {
            meta = instance;
            return meta.getBalance.call(account, {from: account});
        }).then(function (value) {
            var balance_element = document.getElementById("balance");
            balance_element.innerHTML = value.valueOf();
        }).catch(function (e) {
            console.log(e);
            self.setStatus("Error getting balance; see log.");
        });
    },

    refreshCTT: function () {
        this.refreshCTTFree();
        this.refreshCTTSupply();
    },

    refreshCTTSupply: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.getTotalSupply.call({from: account})
        })
            .then(function (value) {
                $("#allAmount").html(value.valueOf());
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus("Error getting totalSupply; see log.")
            })
    },

    refreshCTTFree: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.getFreeToken.call({from: account})
        })
            .then(function (value) {
                console.log(value.valueOf());
                $('#freeAmount').html(value.valueOf());
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus("Error getting CTTFree; see log;")
            })
    },

    refreshExchangeRate: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.getExchangeRate.call({from: account})
        })
            .then(function (value) {
                console.log(value.valueOf());
                $('#exchangeRate').html(value.valueOf());
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus("Error getting exchange rate; see log;")
            })
    },

    refreshETH: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.getBalance.call({from: account})
        })
            .then(function (value) {
                console.log(value.valueOf());
                $('#eth').html(value.valueOf());
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus("Error getting ETH; see log;")
            })
    },

    emission: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.emission({from: account})
        })
            .then(function () {
                self.refreshCTT();
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus('Error during emisson; see log;')
                self.refreshCTT();
            })
    },

    sendCoin: function () {
        var self = this;

        var amount = parseInt(document.getElementById("amount").value);
        var receiver = document.getElementById("receiver").value;

        this.setStatus("Initiating transaction... (please wait)");

        var meta;
        MetaCoin.deployed().then(function (instance) {
            meta = instance;
            return meta.sendCoin(receiver, amount, {from: account});
        }).then(function () {
            self.setStatus("Transaction complete!");
            self.refreshBalance();
        }).catch(function (e) {
            console.log(e);
            self.setStatus("Error sending coin; see log.");
        });
    },


    // test appeareance

    firstBuy: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.buyCoin(Daccount1, 100, {from: Daccount1, gasPrice: gasPrice, gas: gasAmount})
        })
            .then(function () {
                self.refreshCTT();
                self.loadFirstBalance();
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus('Error during buying; see log;');
                self.refreshCTT();
                self.loadFirstBalance();
            })

    },

    firstSell: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.sellCoin(Daccount1, 100, {from: Daccount1, gasPrice: gasPrice, gas: gasAmount})
        })
            .then(function () {
                self.refreshCTT();
                self.loadFirstBalance();
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus('Error during buying; see log;');
                self.refreshCTT();
                self.loadFirstBalance();
            })
    },

    firstBuyToken: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.buyToken(Daccount1, {value: 1, from: Daccount1, gasPrice: gasPrice, gas: gasAmount})
        })
            .then(function () {
                self.refreshCTT();
                self.loadFirstBalance();
                self.refreshETH();
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus('Error during buying; see log;');
                self.refreshCTT();
                self.loadFirstBalance();
                self.refreshETH();
            })
    },

    firstTransfer: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.transfer(Daccount2, 1000, {from: Daccount1, gasPrice: gasPrice, gas: gasAmount})
        })
            .then(function () {
                self.refreshCTT();
                self.loadFirstBalance();
                self.loadSecondBalance();
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus('Error during buying; see log;');
                self.refreshCTT();
                self.loadFirstBalance();
                self.loadSecondBalance();
            })
    },

    loadFirstBalance: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.balanceOf.call(Daccount1, {from: account})
        })
            .then(function (balance) {
                console.log(balance.valueOf());
                $('#first-balance').html(balance.valueOf());
            })
    },

    secondBuy: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.buyCoin(Daccount2, 1000, {from: Daccount1, gasPrice: gasPrice, gas: gasAmount})
        })
            .then(function () {
                self.refreshCTT();
                self.loadSecondBalance();
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus('Error during buying; see log;');
                self.refreshCTT();
                self.loadSecondBalance();
            })
    },

    secondBuyToken: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.buyCoin(Daccount2, 1000, {from: Daccount1, gasPrice: gasPrice, gas: gasAmount})
        })
            .then(function () {
                self.refreshCTT();
                self.loadSecondBalance();
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus('Error during buying; see log;');
                self.refreshCTT();
                self.loadSecondBalance();
            })
    },

    secondSell: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.sellCoin(Daccount2, 1000, {from: Daccount1, gasPrice: gasPrice, gas: gasAmount})
        })
            .then(function () {
                self.refreshCTT();
                self.loadSecondBalance();
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus('Error during buying; see log;');
                self.refreshCTT();
                self.loadSecondBalance();
            })
    },

    secondTransfer: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.transfer(Daccount1, 1000, {from: Daccount2, gasPrice: gasPrice, gas: gasAmount})
        })
            .then(function () {
                self.refreshCTT();
                self.loadFirstBalance();
                self.loadSecondBalance();
            })
            .catch(function (e) {
                console.log(e);
                self.setStatus('Error during buying; see log;');
                self.refreshCTT();
                self.loadFirstBalance();
                self.loadSecondBalance();
            })
    },

    loadSecondBalance: function () {
        var self = this;
        var token;
        CTTToken.deployed().then(function (instance) {
            token = instance;
            return token.balanceOf.call(Daccount2, {from: account})
        })
            .then(function (balance) {
                $('#second-balance').html(balance.valueOf());
            })
    },
};

window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    App.start();
});
