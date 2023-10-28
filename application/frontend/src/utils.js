function fetchData(service, urli) {
  const url = urli + "/mindmaps/" + service;
  console.log(url)
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

function areaSelector(newX, newY, oldX, oldY) {
  var check_1 = isBelowDiagonalLine(newX, newY, oldX, oldY, -1);
  var check_2 = isBelowDiagonalLine(newX, newY, oldX, oldY, 1);

  var type = "main";
  if ("below" === check_1) {
    if ("below" === check_2) {
      type = "bottom";
    } else {
      type = "right";
    }
  } else {
    if ("above" === check_2) {
      type = "top";
    } else {
      type = "left";
    }
  }

  return type;
}

function isBelowDiagonalLine(pointX, pointY, oldX, oldY, slope, def = 2) {
  // Calculate the y-intercept of the diagonal line using the old coordinates
  var yIntercept = oldY - slope * oldX;
  // Calculate the y-value on the diagonal line for the given x-value of the point
  var lineY = slope * pointX + yIntercept;

  // Compare the y-value of the point to the y-value on the line
  if (pointY < lineY) {
    return "above"; // Point is below the diagonal line
  } else {
    return "below"; // Point is above or on the diagonal line
  }
}

export { areaSelector, fetchData };
