import React, { useState, useEffect } from "react";

import AreaChart from "./AreaChart";
import SetupChart from "./SetupChart";
import HoldChart from "./HoldChart";
import PowerChart from "./PowerChart";


export const MainCharts = ({ dataVersionTwo }) => {
  const labels = dataVersionTwo.stages;

  console.log(dataVersionTwo)

  // ****** Area ********
  const areaInstCounts = dataVersionTwo.area.InstCount.map(Number);
  const areaTotalAreas = dataVersionTwo.area.TotalArea.map(Number);

  // ******* Setup **********
  const setupReg2RegWNS = dataVersionTwo.setup;

  const holdReg2RegWNSConvert = dataVersionTwo.hold

  const listOfData = Object.values(setupReg2RegWNS);
  const listOfDataHold = Object.values(holdReg2RegWNSConvert);

  // Convert the setup data arrays to numbers using map
  const setupReg2RegWNSNumbers = listOfData[0].map(Number);
  const setupReg2RegTNSNumbers = listOfData[1].map(Number);
  const setupReg2RegNVPNumbers = listOfData[2].map(Number);
  const setupIOWNSNumbers = listOfData[3].map(Number);
  const setupIOTNSNumbers = listOfData[4].map(Number);
  const setupIONVPNumbers = listOfData[5].map(Number);

  // Now, you have the setup data arrays as numbers

  // ******* Hold ***************
  const holdReg2RegWNS = listOfDataHold[0];
  const holdReg2RegTNS = listOfDataHold[1];
  const holdReg2RegNVP = listOfDataHold[2];
  const holdIOWNS = listOfDataHold[3];
  const holdIOTNS = listOfDataHold[4];
  const holdIONVP = listOfDataHold[5];

  // ****** Power *******
  const powerInternal = dataVersionTwo.power.internalPower.map(Number);
  const powerSwitching = dataVersionTwo.power.switchingPower.map(Number);
  const powerLeakage = dataVersionTwo.power.leakagePower.map(Number);
  const powerTotal = dataVersionTwo.power.totalPower.map(Number);
  return (
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridGap: "10px",
      }}
    >
      <div>
        <AreaChart
          labels={labels}
          areaInstCounts={areaInstCounts}
          areaTotalAreas={areaTotalAreas}
        />
      </div>
      <div>
        <SetupChart
          labels={labels}
          setupReg2RegWNS={setupReg2RegWNSNumbers}
          setupReg2RegTNS={setupReg2RegTNSNumbers}
          setupReg2RegNVP={setupReg2RegNVPNumbers}
          setupIOWNS={setupIOWNSNumbers}
          setupIOTNS={setupIOTNSNumbers}
          setupIONVP={setupIONVPNumbers}
        />
      </div>
      <div>
        <PowerChart
          labels={labels}
          internalPower={powerInternal}
          switchingPower={powerSwitching}
          leakagePower={powerLeakage}
          totalPower={powerTotal}
        />
      </div>
      <div>
        <HoldChart
          labels={labels}
          holdReg2RegWNS={holdReg2RegWNS}
          holdReg2RegTNS={holdReg2RegTNS}
          holdReg2RegNVP={holdReg2RegNVP}
          holdIOWNS={holdIOWNS}
          holdIOTNS={holdIOTNS}
          holdIONVP={holdIONVP}
        />
      </div>
    </div>
  );
};
