export const holderInitialPosInfo = {
  0 : {
    startPoint : 48.28,
    endPoint : 58.8
  },
  1 : {
    startPoint : 47
  },
  2 : {
    startPoint : 43
  },
  3 : {
    startPoint : 42
  }
}

export const holder2ndPosInfo = {
  0 : {
    startPoint : .2
  },
  1 : {
    startPoint : .14
  },
  2 : {
    startPoint : .071
  },
  3 : {
    startPoint : .0
  }
}

export const holderLastPosInfo = {
  0 : {
    startPoint : -30
  },
  1 : {
    startPoint : -100
  },
  2 : {
    startPoint : -200
  },
  3 : {
    startPoint : -280
  }
}

//left
export const road1CoordinatesPct = {
  x1: -.2,
  y1: 1.00926,
  x2: 3.28125,
  y2: 1,
  x3: .58333,
  y3: .50926,
  x4: .48385,
  y4: .51203
}

//inner left
export const road2CoordinatesPct = {
  x1: -0.88542,
  y1: 1,
  x2: 2.73437,
  y2: 1,
  x3: .5813,
  y3: .5105,
  x4: .46354,
  y4: .51018
}

//inner right
export const road3CoordinatesPct = {
  x1: -1.82292, //bot left
  y1: 1,
  x2: 1.85417, //bot right
  y2: 1,
  x3: .53542, //top right
  y3: .51111,
  x4: .44010, //top left
  y4: .51018
}

export const road4CoordinatesPct = {
  x1: -2.44270, //bot left
  y1: 1,
  x2: 1.2, //bot right
  y2: 1,
  x3: .51406, //top right
  y3: .51389,
  x4: .42968, //top left
  y4: .50926
}

export const r1LeftStripeContainerCoordsPct = {
  x1: 0,
  y1: 0,
  x2: road1CoordinatesPct.x1,
  y2: road1CoordinatesPct.y1,
  x3: .4839,
  y3: .5120,
  x4: 0,
  y4: 0
}

export const r2LeftStripeContainerCoordsPct = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: .679,
  x3: .4635,
  y3: .5102,
  x4: 0,
  y4: 0
}

export const r3LeftStripeContainerCoordsPct = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: .6044,
  x3: .44010,
  y3: .51018,
  x4: 0,
  y4: 0
}

export const r4LeftStripeContainerCoordsPct = {
  x1: 0, //bot left
  y1: 0,
  x2: 0, //bot right
  y2: .582,
  x3: .42968, //top right
  y3: .50926,
  x4: 0, //top left
  y4: 0
}

//right stripe container
export const r1RightStripeContainerCoordsPct = {
  x1: 1, //bot left
  y1: .585,
  x2: 0, //bot right
  y2: 0,
  x3: 0, //top right
  y3: 0,
  x4: road1CoordinatesPct.x3, //top left
  y4: road1CoordinatesPct.y3
};

export const r2RightStripeContainerCoordsPct = {
  x1: 1, //bot left
  y1: .61,
  x2: 0, //bot right
  y2: 0,
  x3: 0, //top right
  y3: 0,
  x4: road2CoordinatesPct.x3, //top left
  y4: road2CoordinatesPct.y3
};

export const r3RightStripeContainerCoordsPct = {
  x1: 1, //bot left
  y1: .685,
  x2: 0, //bot right
  y2: 0,
  x3: 0, //top right
  y3: 0,
  x4: road3CoordinatesPct.x3, //top left
  y4: road3CoordinatesPct.y3
};

export const r4RightStripeContainerCoordsPct = {
  x1: road4CoordinatesPct.x2, //bot left
  y1: road4CoordinatesPct.y2,
  x2: 0, //bot right
  y2: 0,
  x3: 0, //top right
  y3: 0,
  x4: road4CoordinatesPct.x3, //top left
  y4: road4CoordinatesPct.y3
}

//right container width info
export const r1RightStripeContainerWidthPct = {
  topWidth : .016,
  bottomWidth : .1
}

export const r2RightStripeContainerWidthPct = {
  topWidth :.016,
  bottomWidth :.094
  
}

export const r3RightStripeContainerWidthPct = {
  topWidth : .016,
  bottomWidth : .113
}

export const r4RightStripeContainerWidthPct = {
  topWidth : .016,
  bottomWidth : .192
}

//left container width info
export const r1LeftStripeContainerWidthPct = {
  topWidth : .013,
  bottomWidth : .1927
}

export const r2LeftStripeContainerWidthPct = {
  topWidth : .013,
  bottomWidth : .1094
}

export const r3LeftStripeContainerWidthPct = {
  topWidth :.024,
  bottomWidth : .10
}

export const r4LeftStripeContainerWidthPct = {
  topWidth : .035,
  bottomWidth : .11
}

export const road1LeftBlackStripesInfoPct = [
  [.1775, .1123, .0514, .0282, .0181, .0109, .0087, .0058],
  [.2305, .1283, .0609, .0326, .0196, .0109, .0080, .0058], 
  [.2718, .1420, .0761, .0406, .0217, .0152, .0080, .0058], 
  [.1558, .1595, .0870, .0464, .0254, .0159, .0094, .0058]
];


export const road2LeftBlackStripesInfoPct = [
  [0.2185, 0.1167, 0.0907, 0.06204, 0.03518, 0.02315, 0.01481, 0.0083],
  [0.1546, 0.1342, 0.1083, 0.0694, 0.03889, 0.02407, 0.0139, 0.0111],
  [0.1463, 0.1157, 0.0787, 0.0454, 0.0287, 0.0157, 0.0102],
  [0.1574, 0.1222, 0.0796, 0.05, 0.0342, 0.0167, 0.0139]
];

export const road3LeftBlackStripesInfoPct = [
  [0.0996, 0.0847, 0.0647, 0.0528, 0.0508, 0.0378, 0.0300, 0.0250, 0.0200],
  [0.1056, 0.0916, 0.0677, 0.0618, 0.0508, 0.0378, 0.0320, 0.0270, 0.0220],
  [0.0996, 0.0996, 0.0767, 0.0598, 0.0498, 0.0398, 0.0330, 0.0280, 0.0230],
  [0.1295, 0.0926, 0.0797, 0.0647, 0.0528, 0.0428, 0.0350, 0.0300, 0.0250],
];

export const road4LeftBlackStripesInfoPct = [ 
  [0.1286, 0.0977, 0.0926, 0.0874, 0.0566, 0.0360, 0.0275, 0.0195, 0.0130],
  [0.0566, 0.0977, 0.0946, 0.0905, 0.0545, 0.0360, 0.0280, 0.0200, 0.0140],
  [0.1080, 0.0926, 0.0895, 0.0820, 0.0432, 0.0216, 0.0175, 0.0135, 0.0100], // Increased 4th stripe height slightly
  [0.0998, 0.0926, 0.0905, 0.0800, 0.0442, 0.0309, 0.0235, 0.0170, 0.0125]  // Increased 4th stripe height slightly
];

export const road1RightBlackStripesInfoPct = [ 
  [0.1286, 0.0977, 0.0926, 0.0874, 0.0566, 0.0360, 0.0275, 0.0195, 0.0130],
  [0.0566, 0.0977, 0.0946, 0.0905, 0.0545, 0.0360, 0.0280, 0.0200, 0.0140],
  [0.1080, 0.0926, 0.0895, 0.0820, 0.0432, 0.0216, 0.0175, 0.0135, 0.0100], // Increased 4th stripe height slightly
  [0.0998, 0.0926, 0.0905, 0.0800, 0.0442, 0.0309, 0.0235, 0.0170, 0.0125]  // Increased 4th stripe height slightly
];

export const road2RightBlackStripesInfoPct = [
  [0.0996, 0.0847, 0.0647, 0.0528, 0.0508, 0.0378, 0.0300, 0.0250, 0.0200],
  [0.1056, 0.0916, 0.0677, 0.0618, 0.0508, 0.0378, 0.0320, 0.0270, 0.0220],
  [0.0996, 0.0996, 0.0767, 0.0598, 0.0498, 0.0398, 0.0330, 0.0280, 0.0230],
  [0.1295, 0.0926, 0.0797, 0.0647, 0.0528, 0.0428, 0.0350, 0.0300, 0.0250],
]

export const road3RightBlackStripesInfoPct = [
  [0.22634, 0.11537, 0.0901, 0.05823, 0.03516, 0.02088, 0.01099, 0.01099],
  [0.15931, 0.12745, 0.10438, 0.06812, 0.03736, 0.02307, 0.00989, 0.00879],
  [0.14283, 0.11097, 0.07691, 0.04505, 0.02802, 0.01648, 0.01209],
  [0.15437, 0.11866, 0.07911, 0.05054, 0.03296, 0.01648, 0.01209, 0.00989]
]

export const road4RightBlackStripesInfoPct = [
  [.1775, .1123, .0514, .0282, .0181, .0109, .0087, .0058],
  [.2305, .1283, .0609, .0326, .0196, .0109, .0080, .0058], 
  [.2718, .1420, .0761, .0406, .0217, .0152, .0080, .0058], 
  [.1558, .1595, .0870, .0464, .0254, .0159, .0094, .0058]
];

export const road1RightWhiteStripesInfoPct = [
  [0.0850, 0.0796, 0.0847, 0.0642, 0.0333, 0.0282, 0.0225, 0.017],
  [0.1337, 0.0823, 0.0854, 0.0648, 0.0463, 0.0257, 0.021, 0.0192],
  [0.0772, 0.0844, 0.0772, 0.0494, 0.0309, 0.0257, 0.0250, 0.0120],
  [0.0792, 0.0874, 0.0772, 0.0576, 0.0309, 0.0206, 0.0210, 0.0170],
];

export const road2RightWhiteStripesInfoPct = [
  [0.0946, 0.0747, 0.0598, 0.0448, 0.0369, 0.0299, 0.0250, 0.0200, 0.0150],
  [0.0946, 0.0747, 0.0598, 0.0448, 0.0369, 0.0299, 0.0250, 0.0200, 0.0150],
  [0.0867, 0.0767, 0.0598, 0.0468, 0.0408, 0.0349, 0.0300, 0.0250, 0.0200],
  [0.0897, 0.0797, 0.0598, 0.0548, 0.0428, 0.0369, 0.0300, 0.0250, 0.0200],
];

export const road3RightWhiteStripesInfoPct = [
  [0.14943, 0.11537, 0.07142, 0.04395, 0.02857, 0.01538, 0.01538],
  [0.14943, 0.11427, 0.07691, 0.05164, 0.03241, 0.02143, 0.01318],
  [0.12086, 0.0824, 0.05713, 0.03461, 0.02033, 0.01209],
  [0.13075, 0.09229, 0.06482, 0.03955, 0.02417, 0.01318, 0.01209]
];

export const road4RightWhiteStripesInfoPct = [
  [.1377, .0725, .0413, .0203, .0130, .0087, .0065],
  [.1536, .0884, .0471, .0254, .0152, .0080, .0065], 
  [.1783, .1036, .0507, .0290, .0167, .0094, .0072], 
  [.2320, .1217, .0616, .0326,.0188, .0109, .0087]
];

export const road1LeftWhiteStripesInfoPct = [
  [.1377, .0725, .0413, .0203, .0130, .0087, .0065],
  [.1536, .0884, .0471, .0254, .0152, .0080, .0065], 
  [.1783, .1036, .0507, .0290, .0167, .0094, .0072], 
  [.2320, .1217, .0616, .0326,.0188, .0109, .0087]
];



export const road2LeftWhiteStripesInfoPct = [
  [0.1537, 0.1176, 0.0704, 0.0444, 0.0278, 0.0130, 0.0130], 
  [0.1491, 0.1111, 0.0768, 0.05, 0.0324, 0.0185, 0.0111],
  [0.1213, 0.0833, 0.0574, 0.0333, 0.0222, 0.0120],
  [0.1315, 0.0954, 0.0667, 0.0398, 0.0231, 0.0148]
];

export const road3LeftWhiteStripesInfoPct = [
  [0.0946, 0.0747, 0.0598, 0.0448, 0.0369, 0.0299, 0.0250, 0.0200, 0.0150],
  [0.0946, 0.0747, 0.0598, 0.0448, 0.0369, 0.0299, 0.0250, 0.0200, 0.0150],
  [0.0867, 0.0767, 0.0598, 0.0468, 0.0408, 0.0349, 0.0300, 0.0250, 0.0200],
  [0.0897, 0.0797, 0.0598, 0.0548, 0.0428, 0.0369, 0.0300, 0.0250, 0.0200],
];

export const road4LeftWhiteStripesInfoPct = [
  [0.0850, 0.0796, 0.0847, 0.0642, 0.0333, 0.0282, 0.0225, 0.017],
  [0.1337, 0.0823, 0.0854, 0.0648, 0.0463, 0.0257, 0.021, 0.0192],
  [0.0772, 0.0844, 0.0772, 0.0494, 0.0309, 0.0257, 0.0250, 0.0120],
  [0.0792, 0.0874, 0.0772, 0.0576, 0.0309, 0.0206, 0.0210, 0.0170]
];

export const road4RightOffsetInfoPct = [
  .2899, .1558, .0181, 0
];

export const road3RightOffsetInfoPct =[
  0.0, 0.0, 0.23183, 0.15382
];

export const road2RightOffsetInfoPct = [
  0.1644, 0.1195, 0.0747, 0
];

export const road1RightOffsetInfoPct = [
  0.0, 0.0, 0.1337, 0.1029
];

//left offset info
export const road1LeftOffsetInfoPct = [
  .2899, .1558, .0181, 0
];

export const road2LeftOffsetInfoPct = [
  0, 0, 0.2315, 0.1537
];

export const road3LeftOffsetInfoPct = [
  0.1644, 0.1195, 0.0747, 0
];

export const road4LeftOffsetInfoPct = [
  0.0, 0.0, 0.1337, 0.1029
];










