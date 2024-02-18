function fetchMindMap(service, urli, authToken) {
  const url = urli + "/mindmaps/" + service;

  const headers = new Headers();

  // Add the authorization header if the auth token is not null or empty
  if (authToken) {
      headers.append("Authorization", `Bearer ${authToken}`);
  }

  return fetch(url, { headers })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}


function fetchList(urli, authToken) {
  const url = urli + "/list";

  const headers = new Headers();

  // Add the authorization header if the auth token is not null or empty
  if (authToken) {
      headers.append("Authorization", `Bearer ${authToken}`);
  }

  return fetch(url, { headers })
    .then((response) => response.json())
    .then(data => {
      return data.map(item => ({ value: item, label: item }));
    })
    .catch((error) => console.error(error));
}

function deleteItem(urli, authToken, itemId) {
  const url = `${urli}/mindmaps/${itemId}`; // Assuming the item to be deleted is specified by itemId

  const headers = {
    Authorization: `Bearer ${authToken}`,
    // Add other headers if needed
  };

  return fetch(url, { 
    method: 'DELETE', 
    headers 
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
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

export { areaSelector, fetchMindMap, fetchList, deleteItem };
