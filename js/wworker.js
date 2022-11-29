function handleMessageEvent(event) {
	self.postMessage(haversineDistance(event.data));
}

// Register the message event handler.
self.addEventListener('message', handleMessageEvent);

function haversineDistance(coordinates) {
  
  function toRad(x) {
    return x * Math.PI / 180;
  }
  
  let lat1 = coordinates[0][0];
  let lon1 = coordinates[0][1];

  let lat2 = coordinates[1][0];
  let lon2 = coordinates[1][1]

  let earthRadius = 6371;
  
  let dLat = toRad(lat2 - lat1);
  let dLon = toRad(lon2 - lon1);
  
  let distance = earthRadius * 2 * Math.atan2(Math.sqrt(Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)), Math.sqrt(1 - (Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2))));
  
  return Math.round(distance * 1000) / 1000;

}