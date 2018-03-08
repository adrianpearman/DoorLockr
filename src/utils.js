export const distance = (lat1, lat2, long1, long2) => {
  const EarthRadius = 6371
  const radianLat1 = lat1 * (Math.PI /180)
  const radianLat2 = lat2 * (Math.PI /180)
  const diffLatitude = (lat2 - lat1) * (Math.PI / 180)
  const diffLongitude = (long2 - long1) * (Math.PI / 180)
  const a = Math.sin(diffLatitude/2) * Math.sin(diffLatitude/2) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.sin(diffLongitude/2) * Math.sin(diffLongitude/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = EarthRadius * c
  return distance
}
