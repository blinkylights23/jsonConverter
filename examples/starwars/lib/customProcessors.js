function cm2ft(cm) {
  var floatFeet = (cm * 0.3937) / 12
  var feet = Math.floor(floatFeet)
  var inches = Math.round((floatFeet - feet) * 12)
  return `${feet}'${inches}"`
}

function kg2lbs(kg) {
  var floatPounds = kg * 2.20462
  var pounds = Math.floor(floatFeet)
  return pounds
}

export default { cm2ft, kg2lbs }
