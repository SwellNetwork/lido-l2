import env from "../../utils/env";
import prompt from "../../utils/prompt";
import network from "../../utils/network";
import deployment from "../../utils/deployment";
import { BridgingManagement } from "../../utils/bridging-management";
import swellchain from "../../utils/swellchain";


async function main() {
  const networkName = env.network();
  const ethOptNetwork = network.multichain(["eth", "swe"], networkName);

  const [ethDeployer] = ethOptNetwork.getSigners(env.privateKey(), {
    forking: env.forking(),
  });
  const [, sweDeployer] = ethOptNetwork.getSigners(
    env.string("SWE_DEPLOYER_PRIVATE_KEY"),
    {
      forking: env.forking(),
    }
  );

  const deploymentConfig = deployment.loadMultiChainDeploymentConfig();

  const [l1DeployScript, l2DeployScript] = await swellchain
    .deployment(networkName, { logger: console })
    .erc20TokenBridgeDeployScript(
      deploymentConfig.token,
      {
        deployer: ethDeployer,
        admins: {
          proxy: deploymentConfig.l1.proxyAdmin,
          bridge: ethDeployer.address,
        },
      },
      {
        deployer: sweDeployer,
        admins: {
          proxy: deploymentConfig.l2.proxyAdmin,
          bridge: sweDeployer.address,
        },
      }
    );

  await deployment.printMultiChainDeploymentConfig(
    "Deploy Swellchain Bridge",
    ethDeployer,
    sweDeployer,
    deploymentConfig,
    l1DeployScript,
    l2DeployScript
  );

  await prompt.proceed();

  await l1DeployScript.run();
  await l2DeployScript.run();

  const l1ERC20TokenBridgeProxyDeployStepIndex = 1;
  const l1BridgingManagement = new BridgingManagement(
    l1DeployScript.getContractAddress(l1ERC20TokenBridgeProxyDeployStepIndex),
    ethDeployer,
    { logger: console }
  );

  const l2ERC20TokenBridgeProxyDeployStepIndex = 3;
  const l2BridgingManagement = new BridgingManagement(
    l2DeployScript.getContractAddress(l2ERC20TokenBridgeProxyDeployStepIndex),
    sweDeployer,
    { logger: console }
  );

  await l1BridgingManagement.setup(deploymentConfig.l1);
  await l2BridgingManagement.setup(deploymentConfig.l2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
