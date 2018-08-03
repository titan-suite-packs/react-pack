import Web3 from 'aion-web3'

let getWeb3 = new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
        let results
        let web3
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')

        web3 = new Web3(provider)

        results = {
            web3: web3
        }

        resolve(results)
    })
})

export default getWeb3