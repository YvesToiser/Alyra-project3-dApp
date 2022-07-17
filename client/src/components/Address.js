import React from 'react';

export default class Address extends React.Component {

    state = {
        balance: null,
        network: null,
    };

    componentDidMount = async () => {
        this.getBalance();
        this.getNetwork();
    };

    async getBalance() {
        const result = await this.props.web3.eth.getBalance(this.props.address.toString());
        let balance = this.props.web3.utils.fromWei(result, "ether") + " ETH";
        balance = this.roundBalance(balance);
        this.setState({ balance });
    }

    async getNetwork() {
        const result = await this.props.web3.eth.getChainId();
        const network = this.switchNetwork(result.toString());
        this.setState({ network });
    }

    roundBalance(_balance) {
        const dotPosition = _balance.indexOf('.');
        return _balance.slice(0, dotPosition + 4);
    }

    shortenAddress(_address) {
        if (_address) {
            const beginning = _address.substr(0, 7);
            const ending = _address.substr(35, 5);
            return beginning + '...' + ending;
        }
    }

    switchNetwork(networkId) {
        switch (networkId) {
            case '1' :
                return 'Ethereum Mainnet';
            case '3' :
                return 'Ropsten';
            case '5' :
                return 'Görli';
            case '42' :
                return 'Kovan';
            case '1337' :
                return 'LocalHost';
            default:
                return 'Wrong Network';
        }
    }

    render(){
        return(
            <div id='addressBlock'>
                <div id='addressBox'>
                    <span id='balance'>
                        {this.state.balance}
                    </span>
                    <span id='address'>
                        {this.shortenAddress(this.props.address.toString())}
                    </span>
                </div>
                <div id='networkBox'>
                    {this.state.network}
                </div>
            </div>
        )
    }
}