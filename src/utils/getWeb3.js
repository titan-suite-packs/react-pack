import Web3 from 'aion-web3'
import { host, port } from '../../titanrc'

let getWeb3 = new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
        let results
        let web3
        const provider = new Web3.providers.HttpProvider(`${host}:${port}`)

        web3 = new Web3(provider)

        results = {
            web3: web3
        }

        resolve(results)
    })
})

export default getWeb3