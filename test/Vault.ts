import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {

  async function deployOneYearLockFixture() {

    const [owner, otherAccount] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy();

    const ONE_ETHER = ethers.parseEther("1")
    const Zero_ETHER = ethers.parseEther("0")

    const ZeroAddress = "0x0000000000000000000000000000000000000000"

    const TEN_ETHER = ethers.parseEther("10")

    return { vault, owner, otherAccount, ONE_ETHER, Zero_ETHER, ZeroAddress, TEN_ETHER };
  }

  describe("Deployment checker", function () {
    it("Should check if deployment exists", async function () {
      const { vault, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await vault.connect(owner)).to.exist;
    });

    it("should check if fund was donated",async () => {
      const { vault, owner, otherAccount, ONE_ETHER  } = await loadFixture(deployOneYearLockFixture);
      await vault.connect(owner).donate({value: ONE_ETHER })
      const bal = await vault.connect(owner).checkBalance(owner.address)

      expect(ONE_ETHER).to.equal(bal)


    })

    it("Should check if address is not zero address", async()=>{
      const { vault, owner, otherAccount, ZeroAddress  } = await loadFixture(deployOneYearLockFixture);
      await expect(ZeroAddress).to.not.eq(owner.address)

    })

    it("Should check if beneficiary has been added", async()=>{
      const { vault, owner, otherAccount, ZeroAddress  } = await loadFixture(deployOneYearLockFixture);

     const tx = await vault.connect(owner).addBeneficiary(otherAccount.address)
     expect (tx).to.exist

    })

    it("Should check if claim isnt by address zero", async()=>{
      const { vault, owner, otherAccount, ZeroAddress , ONE_ETHER } = await loadFixture(deployOneYearLockFixture);
      await vault.connect(owner).donate({value: ONE_ETHER })
     expect( await vault.connect(owner).claim()).to.not.eq(ZeroAddress)
      
    })

    it("Should check if balance can be claimed", async()=>{
      const { vault, owner, otherAccount, ONE_ETHER  } = await loadFixture(deployOneYearLockFixture);
      await vault.connect(owner).donate({value: ONE_ETHER })

      await vault.connect(owner).claim()

      expect( await vault.connect(owner).checkBalance(owner.address)).not.to.eq(ONE_ETHER)


    })

    it("Should check if owner exist", async()=>{
      const { vault, owner, otherAccount, ONE_ETHER  } = await loadFixture(deployOneYearLockFixture);
      

      await vault.connect(owner).donate({value: ONE_ETHER })
      await vault.connect(owner).duration
      await vault.connect(owner).claim()

      expect(await vault.connect(owner).checkBalance(owner.address)).not.to.eq(ONE_ETHER)



    })






















    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Lock = await ethers.getContractFactory("Lock");
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });


});
