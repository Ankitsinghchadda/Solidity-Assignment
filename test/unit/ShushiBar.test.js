const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")


describe("SushiBar Unit Tests", function () {
    let ShushiTokenContract, ShushiToken, ShushiBarContract, ShushiBar

    beforeEach(async () => {
        accounts = await ethers.getSigners() // could also do with getNamedAccounts
        deployer = accounts[0]
        user = accounts[1]
        await deployments.fixture(["all"])
        ShushiTokenContract = await ethers.getContract("Shushi")
        ShushiToken = ShushiTokenContract.connect(deployer)
        ShushiBarContract = await ethers.getContract("SushiBar")
        ShushiBar = ShushiBarContract.connect(deployer)
    })

    describe("enter", function () {
        it("Shushi Token goes to deployer while deploying", async function () {
            assert.equal(parseInt(await ShushiToken.balanceOf(deployer.address)).toString(), (10 ** 28).toString(), "Tokens are not equall")
        })
        it("Maintains a mapping of Address to LastEntered", async function () {
            await ShushiToken.approve(ShushiBar.address, ethers.utils.parseEther("10"))
            await ShushiBar.enter(ethers.utils.parseEther("10"))
            const mapping = parseInt(await ShushiBar.s_addressToLastentered(deployer.address))
            assert.notEqual(mapping, "0", "Doesn't maintain mapping of Address to LastEntered")
        })

        it("Time Updates to latest if someone enters twice", async function () {
            await ShushiToken.approve(ShushiBar.address, ethers.utils.parseEther("10"))
            await ShushiBar.enter(ethers.utils.parseEther("5"))
            const mapping1 = await ShushiBar.s_addressToLastentered(deployer.address)
            await ShushiBar.enter(ethers.utils.parseEther("5"))
            const mapping2 = await ShushiBar.s_addressToLastentered(deployer.address)

            assert.notEqual(mapping1, mapping2, "Time did'nt updated")
        })
    })

    describe("leave", function () {
        beforeEach(async () => {
            await ShushiToken.approve(ShushiBar.address, ethers.utils.parseEther("10"))
            await ShushiBar.enter(ethers.utils.parseEther("10"))
        })
        it("Can not Unstake if time is less then 2 days", async function () {
            const amount = await ShushiBar.balanceOf(deployer.address)
            await expect(ShushiBar.leave(amount)).to.be.revertedWith("Tokens are locked")
        })
        it("Can Unstake 25% if time is between 2 days or 4days", async function () {
            // Increasing time to 2 days
            await network.provider.send("evm_increaseTime", [2 * 86400])
            await network.provider.send("evm_mine")
            const amount = parseInt(await ShushiBar.balanceOf(deployer.address))
            const precAmount = (amount * 0.25).toString()
            await ShushiBar.leave(precAmount)
        })
        it("Can not Unstake more than 25% if time is between 2 days or 4days", async function () {
            // Increasing time to 2 days
            await network.provider.send("evm_increaseTime", [2 * 86400])
            await network.provider.send("evm_mine")
            const amount = parseInt(await ShushiBar.balanceOf(deployer.address))
            const precAmount = (amount * 0.30).toString()
            await expect(ShushiBar.leave(precAmount)).to.be.revertedWith("Tokens are locked")
        })
        it("Can Unstake 50% if time is between 4 days or 6days", async function () {
            // Increasing time to 2 days
            await network.provider.send("evm_increaseTime", [5 * 86400])
            await network.provider.send("evm_mine")
            const amount = parseInt(await ShushiBar.balanceOf(deployer.address))
            const precAmount = (amount * 0.50).toString()
            await ShushiBar.leave(precAmount)
        })
        it("Can not Unstake more than 50% if time is between 4 days or 6days", async function () {
            // Increasing time to 2 days
            await network.provider.send("evm_increaseTime", [5 * 86400])
            await network.provider.send("evm_mine")
            const amount = parseInt(await ShushiBar.balanceOf(deployer.address))
            const precAmount = (amount * 0.60).toString()
            await expect(ShushiBar.leave(precAmount)).to.be.revertedWith("Tokens are locked")
        })
        it("Can Unstake 75% if time is between 6 days or 8days", async function () {
            // Increasing time to 2 days
            await network.provider.send("evm_increaseTime", [7 * 86400])
            await network.provider.send("evm_mine")
            const amount = parseInt(await ShushiBar.balanceOf(deployer.address))
            const precAmount = (amount * 0.75).toString()
            await ShushiBar.leave(precAmount)
        })
        it("Can not Unstake more than 75% if time is between 6 days or 8days", async function () {
            // Increasing time to 2 days
            await network.provider.send("evm_increaseTime", [7 * 86400])
            await network.provider.send("evm_mine")
            const amount = parseInt(await ShushiBar.balanceOf(deployer.address))
            const precAmount = (amount * 0.80).toString()
            await expect(ShushiBar.leave(precAmount)).to.be.revertedWith("Tokens are locked")
        })
        it("Can Unstake 100% after 8 dyas", async function () {
            // Increasing time to 2 days
            await network.provider.send("evm_increaseTime", [8 * 86400])
            await network.provider.send("evm_mine")
            const amount = parseInt(await ShushiBar.balanceOf(deployer.address))
            const precAmount = (amount).toString()
            await ShushiBar.leave(precAmount)
        })
    })



})