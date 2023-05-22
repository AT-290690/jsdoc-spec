/**
 * Get the current group meters (of type)
 * that still don't are on the queue to get reads
 * If all meters have reads then start from
 * the first meter type in the group
 * @example
 * meterGroup([{type:'Generation'}, {type:'Export'}])
 * // [{type:'Generation'}]
 * meterGroup([{type:'Generation'}, {type:'Generation'}])
 * // [{type:'Generation'}, {type:'Generation'}]
 * meterGroup([{type:'Export'}, {type:'Export'}])
 * // [{type:'Export'}, {type:'Export'}]
 * meterGroup([{type:'Generation', currentPeriodRead: {} }, {type:'Generation', currentPeriodRead: {}}, {type:'Export'}])
 * // [{type:'Export'}]
 * meterGroup([{type:'Generation', currentPeriodRead: {} }, {type:'Generation', currentPeriodRead: {}}, {type:'Export', currentPeriodRead: {}}])
 * // [{type:'Generation',  currentPeriodRead: {}}, {type:'Generation',  currentPeriodRead: {}}]
 *  * meterGroup([{type:'Generation', currentPeriodRead: {id: 5} }, {type:'Generation', currentPeriodRead: {id:6}}, {type:'Export', currentPeriodRead: {id:4}}])
 * // [{"type": "Export", "currentPeriodRead": { "id": 4 } }]
 *  meterGroup([{type:'Generation', currentPeriodRead: { isOutOfTolerance: true} }, {type:'Export'}])
 * // [{"type":"Generation","currentPeriodRead":{"isOutOfTolerance":true}}]
 * meterGroup([{"type":"Generation"}] | [{"type":"Export"}] | [{"type":"Generation"}, {"type":"Export"}] | [{"type":"Generation"}, {"type":"Generation"}, {"type":"Export"}] | [{"type":"Generation"}, {"type":"Export"}, {"type":"Export"}] | [{"type":"Generation"}, {"type":"Generation"}, {"type":"Export"}, {"type":"Export"}] | [{"type":"Generation"}, {"type":"Export", "currentPeriodRead": {"id":1}}] | [{"type":"Generation", "currentPeriodRead": {"id":1}}, {"type":"Export"}] | [{"type":"Generation","currentPeriodRead": {"id":1}}, {"type":"Generation","currentPeriodRead": {"id":2}}, {"type":"Export"}] | [{"type":"Generation"}, {"type":"Generation"}, {"type":"Export", "currentPeriodRead": {"id":1}}] | [{"type":"Generation"}, {"type":"Export","currentPeriodRead": {"id":1}}, {"type":"Export","currentPeriodRead": {"id":2}}] | [{"type":"Export"}, {"type":"Export"}, {"type":"Generation","currentPeriodRead": {"id":3}}] | [{"type":"Generation", "currentPeriodRead": {"id":1}}, {"type":"Export", "currentPeriodRead": {"id":2}}] | [{"type":"Generation", "currentPeriodRead": {"id":2}}, {"type":"Export", "currentPeriodRead": {"id":1}}] | [{"type":"Generation","currentPeriodRead": {"id":1}}, {"type":"Generation","currentPeriodRead": {"id":2}}, {"type":"Export", "currentPeriodRead": {"id":3}}] | [{"type":"Generation","currentPeriodRead": {"id":3}}, {"type":"Generation","currentPeriodRead": {"id":2}}, {"type":"Export", "currentPeriodRead": {"id":1}}] | [{"type":"Generation", "currentPeriodRead": {"id":3}}, {"type":"Export","currentPeriodRead": {"id":1}}, {"type":"Export","currentPeriodRead": {"id":2}}] | [{"type":"Export","currentPeriodRead": {"id":4}}, {"type":"Export", "currentPeriodRead": {"id":5}}, {"type":"Generation","currentPeriodRead": {"id":3}}])
 * // [{"type":"Generation"}] | [{"type":"Export"}] | [{"type":"Generation"}] | [{"type":"Generation"},{"type":"Generation"}] | [{"type":"Generation"}] | [{"type":"Generation"},{"type":"Generation"}] | [{"type":"Generation"}] | [{"type":"Export"}] | [{"type":"Export"}] | [{"type":"Generation"},{"type":"Generation"}] | [{"type":"Generation"}] | [{"type":"Export"},{"type":"Export"}] | [{"type":"Generation","currentPeriodRead":{"id":1}}] | [{"type":"Export","currentPeriodRead":{"id":1}}] | [{"type":"Generation","currentPeriodRead":{"id":1}},{"type":"Generation","currentPeriodRead":{"id":2}}] | [{"type":"Export","currentPeriodRead":{"id":1}}] | [{"type":"Export","currentPeriodRead":{"id":1}},{"type":"Export","currentPeriodRead":{"id":2}}] | [{"type":"Generation","currentPeriodRead":{"id":3}}]
 */
module.exports.meterGroup = (meters) => {
  const a = meters[0] // get first meter
  const b = meters[meters.length - 1] // get last meter
  return a && b && a.type === b.type // are meters of the same type
    ? meters // then don't filter because meters are the same type
    : // if every meter has no reads submitted
    meters.every((meter) => !meter.currentPeriodRead)
    ? meters.filter((meter) => meter.type === a.type) // then go to the first meter type (Generation)
    : // if every meter has read submitted we have to cycle through them for additional submissions
    meters.every((meter) => meter.currentPeriodRead) &&
      a?.currentPeriodRead &&
      b?.currentPeriodRead // if every meter has reads submitted
    ? a.currentPeriodRead?.id > b.currentPeriodRead?.id // check which meter has the latest read
      ? meters.filter((meter) => meter.type === b.type) // if A has recenlty submitted it is B turn
      : meters.filter((meter) => meter.type === a.type) // if B has recently submitted it's A turn again
    : meters.some((meter) => meter.currentPeriodRead?.isOutOfTolerance) // if some meters are out of tolerance
    ? meters.filter(
        (meter) =>
          meter.currentPeriodRead && meter.currentPeriodRead.isOutOfTolerance
      ) // go back to the out of tolerence ones
    : meters.filter((meter) => !meter.currentPeriodRead) // otherwise get only the meters that don't have reads submitted
}
