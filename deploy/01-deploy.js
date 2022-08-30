const { network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    console.log("------------- Deploying Shushi Token --------------------")
    const ShushiToken = await deploy("Shushi", {
        from: deployer,
        log: true,
        waitConfirmations: 1
    })
    console.log(`------------- Deployed Shushi Token at ${ShushiToken.address} --------------------`)
}

module.exports.tags = ["all", "ContractDeploy1"]