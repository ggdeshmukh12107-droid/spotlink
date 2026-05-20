const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying SpotLinkLedger to", hre.network.name, "...");

  const SpotLinkLedger = await hre.ethers.getContractFactory("SpotLinkLedger");
  const ledger = await SpotLinkLedger.deploy();

  await ledger.waitForDeployment();
  const address = await ledger.getAddress();

  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║  ✅ SpotLinkLedger Deployed Successfully!            ║
  ║  Network: ${hre.network.name.padEnd(43)}║
  ║  Address: ${address}  ║
  ╚═══════════════════════════════════════════════════════╝
  `);

  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: address,
    deployer: (await hre.ethers.getSigners())[0].address,
    deployedAt: new Date().toISOString(),
    chainId: hre.network.config.chainId
  };

  fs.writeFileSync("./deployment.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("📁 Deployment info saved to deployment.json");

  if (hre.network.name === "sepolia") {
    console.log("⏳ Waiting 30s before Etherscan verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    try {
      await hre.run("verify:verify", { address, constructorArguments: [] });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("⚠️ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
