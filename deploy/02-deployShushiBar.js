const { network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const ShushiToken = await ethers.getContract("Shushi")
    console.log("------------- Deploying ShushiBar Contract --------------------")
    const args = [ShushiToken.address]
    const ShushiBar = await deploy("SushiBar", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: 1
    })
    console.log(`------------- Deployed ShushiBar Contract at ${ShushiBar.address} --------------------`)

}

module.exports.tags = ["all", "ContractDeploy2"]