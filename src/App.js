import React, { Component } from 'react';
import { Button, Container, Divider, Flag, Header, Icon, Image, Input, Reveal } from 'semantic-ui-react';

import SimpleStorage from '../build/bolts/SimpleStorage.json';
import getWeb3 from './utils/getWeb3';
import { poll } from './utils/common';

import titanLogo from './assets/logo.svg';
import nbLogo from './assets/nb_logo.png';

class App extends Component {

  state = {
    storageValue: 0,
    web3: null,
    mainAccount: null,
  }
  componentDidMount() {

    getWeb3.then((results) => {

      this.setState({
        web3: results.web3,
        mainAccount: results.web3.personal.listAccounts[0]
      })

      this.instantiateContract()
    })
  }

  instantiateContract() {

    console.log("Simple Storage: " + SimpleStorage.deployed_address)

    const contractInstance = this.state.web3.eth.contract(SimpleStorage.abi).at(SimpleStorage.deployed_address)
    this.setState({ simpleStorageInstance: contractInstance })

    const res = this.state.simpleStorageInstance.get.call({ from: this.state.mainAccount, gas: 1500000 })
    this.setState({ storageValue: Number(res) })
  }

  setValue(e) {
    console.log("attempting to set", this.state.inputValue)
    this.state.simpleStorageInstance.set(
      this.state.inputValue,
      { from: this.state.mainAccount, gas: 1500000 },
      () => {
        this.getValue()
      })
  }

  getValue() {
    this.setState({ polling: true })

    poll(
      () =>
        this.state.simpleStorageInstance
          .get.call({ from: this.state.mainAccount, gas: 1500000 })
      ,
      (d) => Number(d) === Number(this.state.inputValue)
    ).then((result) =>
      this.setState({
        storageValue: Number(result),
        polling: false,
        edited: false
      })
    )
  }

  handleInputChange(e, data) {
    this.setState({ inputValue: data.value, edited: true })
  }

  render() {
    return (
      <Container text fluid textAlign='center'>

        <Reveal animated='rotate left' instant>
          <Reveal.Content visible>
            <Image src={titanLogo} size='small' />
          </Reveal.Content>
          <Reveal.Content hidden>
            <Image circular src={nbLogo} size='small' />
          </Reveal.Content>
        </Reveal>

        <Header as='h1' textAlign='center'>Titan React Pack</Header>
        <p>Your Titan Pack is installed and ready.</p>
        <h3>Smart Contract Example</h3>
        <p>The stored value is: {this.state.storageValue}</p>

        <Input onChange={this.handleInputChange.bind(this)} />
        <br /><br />
        <Button loading={this.state.polling} secondary onClick={this.setValue.bind(this)}>
          <Icon name="refresh" color={this.state.edited ? "yellow" : "grey"} />
          Update
        </Button>

        <Divider />

        <p>This Titan Pack was made with <Icon name="fire" /> by <a href="https://www.northernblock.ca" target="_blank">NorthernBlock</a> in <Flag name='ca' />!</p>

        <Button as="a" href={'https://www.github.com/titanpacks'} color='grey' rel="noopener noreferrer" target='_blank' icon='github' content='Source' />

      </Container>
    );
  }
}

export default App;
