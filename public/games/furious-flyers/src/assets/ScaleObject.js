const ScaleObject = (gameObject, screenWidth, screenHeight, percent) => {

	const scaleX = screenWidth * percent / gameObject.width;

  const scaleY = screenHeight * percent / gameObject.height;

  gameObject.setScale(scaleX, scaleY);

}

export default ScaleObject;