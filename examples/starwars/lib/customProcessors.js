function cm2ft(cm) {
  var floatFeet = (cm * 0.3937) / 12
  var feet = Math.floor(floatFeet)
  var inches = Math.round((floatFeet - feet) * 12)
  if (isNaN(feet) || isNaN(inches)) return 'unknown'
  return `${feet}'${inches}"`
}

function kg2lbs(kg) {
  var floatPounds = kg * 2.20462
  var pounds = Math.floor(floatPounds)
  if (isNaN(pounds)) return 'unknown'
  return pounds
}

export default { cm2ft, kg2lbs }
