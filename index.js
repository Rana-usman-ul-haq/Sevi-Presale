import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress, } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const showAccount = document.getElementById('showAccount')
const purchaseButton = document.getElementById('purchaseButton')

connectButton.onclick = connect
purchaseButton.onclick = purchaseTokens



async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.log(error)
    }
    connectButton.innerHTML = "Connected"
    const accounts = await ethereum.request({ method: "eth_accounts" })
    console.log(accounts)
    showAccount.innerHTML = accounts
}
   else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}



async function purchaseTokens() {
  const amount = document.getElementById("amount").value
  if (amount >= 0.01 && 2 >= amount) {
  console.log(`Funding with ${amount}...`)
  alert("Please wait for wallet confirmation")
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.buyTokens({
        value: ethers.utils.parseEther(amount),
      })
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done")
      alert("Tokens Bought!")
    } catch (error) {
      console.log(error)
    }
  } else {
    purchaseButton.innerHTML = "Please install MetaMask"
  } 
} else {
  alert("Enter amount more than 0.01 and less than 2 BNB!")
}
}


function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}

