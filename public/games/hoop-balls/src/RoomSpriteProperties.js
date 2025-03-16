export const RoomSpriteProperties = (index) => {

  const questionHolders = [
    {xScale: .05, yScale: .15, xPosition: .8, yPosition: .82, sprite: "pencilcase"},
    {xScale: .05, yScale: .1, xPosition: .72, yPosition: .57, sprite: "penholder"},
    {xScale: .05, yScale: .1, xPosition: .365, yPosition: .615, sprite: "penholder"},
    {xScale: .05, yScale: .1, xPosition: .26, yPosition: .68, sprite: "penholder"},
    {xScale: .05, yScale: .15, xPosition: .75, yPosition: .75, sprite: "penholder"}
  ];

  const doorAccesses = [
    {scale: .025, xPosition: .175, yPosition: .38},
    {scale: .025, xPosition: .2, yPosition: .45},
    {scale: .025, xPosition: .735, yPosition: .35},
    {scale: .025, xPosition: .31, yPosition: .435},
    {scale: .025, xPosition: .755, yPosition: .35}
  ]

  const questionHolder = questionHolders[index];
  const doorAccess = doorAccesses[index];
    
  return {questionHolder, doorAccess}
    
};