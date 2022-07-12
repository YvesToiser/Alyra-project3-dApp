import React from 'react';

export default class Address extends React.Component {

    state = {
        balance: null,
        network: null
    };

    componentDidMount = async () => {
        this.getBalance();
        this.getNetwork();
    };

    async getBalance() {
        const result = await this.props.web3.eth.getBalance(this.props.address.toString());
        const balance = this.props.web3.utils.fromWei(result, "ether") + " ETH";
        this.setState({ balance });
    }

    async getNetwork() {
        const result = await this.props.web3.eth.getChainId();

        const network = this.switchNetwork(result.toString());
        this.setState({ network });
    }

    switchNetwork(networkId) {
        switch (networkId) {
            case '1' :
                return 'Ethereum Mainnet';
            case '3' :
                return 'Ropsten';
            case '4' :
                return 'Rinkeby';
            case '5' :
                return 'Görli';
            case '10' :
                return 'Optimism';
            case '137' :
                return 'Polygon';
            default:
                return 'Wrong Network.';
        }
    }

    render(){
        return(
            <div className='header'>
                <p>Your address : </p>
                {this.props.address}
                <p>Your balance : </p>
                {this.state.balance}
                <p>Network : </p>
                {this.state.network}
            </div>
        )
    }

}