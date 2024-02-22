import { ethers } from "hardhat";

async function main() {

  const lockedAmount = ethers.parseEther("0.001");

  const lock = await ethers.deployContract("Vault");

  await lock.waitForDeployment();


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
