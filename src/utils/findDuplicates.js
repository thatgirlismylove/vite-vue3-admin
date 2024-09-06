// 找出 visitedViews 中重复的视图
function findDuplicates(array) {
  const map = new Map()
  const duplicates = []
  array.forEach((val) => {
    if (map.has(val.name)) {
      duplicates.push(val.name)
    } else {
      map.set(val.name, 1)
    }
  })
  return duplicates
}

export default findDuplicates
