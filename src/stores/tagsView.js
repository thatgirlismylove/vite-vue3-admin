export const useTagsViewStore = defineStore(
  'tags-view',
  () => {
    const visitedViews = ref([])
    const cachedViews = ref([])

    const addVisitedView = (view) => {
      //  如果已经存在于访问的视图列表中，则不再添加
      if (visitedViews.value.some((v) => v.path === view.path)) return
      // 如果视图是固定的(affix),则在已访问的视图列表的开头添加
      if (view.affix) {
        visitedViews.value.unshift(view)
      } else {
        visitedViews.value.push(
          Object.assign({}, view, {
            title: view.meta.title || 'no-name'
          })
        )
      }
    }

    const addCachedView = (view) => {
      // 如果已经存在于缓存的视图列表中，则不再添加
      if (cachedViews.value.includes(view.name)) return
      // 如果视图需要缓存(keepAlive),则将其路由名称添加到缓存视图列表中
      if (view.meta.keepAlive) {
        cachedViews.value.push(view.name)
      }
    }

    const delVisitedView = (view) => {
      return new Promise((resolve) => {
        for (const [i, v] of visitedViews.value.entries()) {
          // 找到与指定视图路径匹配的视图，在已访问视图列表中删除该视图
          if (v.path === view.path) {
            visitedViews.value.splice(i, 1)
            break
          }
        }
        resolve([...visitedViews.value])
      })
    }

    const delCachedView = (view) => {
      return new Promise((resolve) => {
        const index = cachedViews.value.indexOf(view.name)
        index > -1 && cachedViews.value.splice(index, 1)
        resolve([...cachedViews.value])
      })
    }

    const delOtherVisitedViews = (view) => {
      return new Promise((resolve) => {
        visitedViews.value = visitedViews.value.filter((v) => {
          return v?.affix || v.path === view.path
        })
        resolve([...visitedViews.value])
      })
    }

    const delOtherCachedViews = (view) => {
      return new Promise((resolve) => {
        const index = cachedViews.value.indexOf(view.name)
        if (index > -1) {
          cachedViews.value = cachedViews.value.slice(index, index + 1)
        } else {
          // if index = -1, there is no cached tags
          cachedViews.value = []
        }
        resolve([...cachedViews.value])
      })
    }

    const updateVisitedView = (view) => {
      for (let v of visitedViews.value) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    }

    const addView = (view) => {
      addVisitedView(view)
      addCachedView(view)
    }

    const delView = (view) => {
      return new Promise((resolve) => {
        delVisitedView(view)
        delCachedView(view)
        resolve({
          visitedViews: [...visitedViews.value],
          cachedViews: [...cachedViews.value]
        })
      })
    }

    const delOtherViews = (view) => {
      return new Promise((resolve) => {
        delOtherVisitedViews(view)
        delOtherCachedViews(view)
        resolve({
          visitedViews: [...visitedViews.value],
          cachedViews: [...cachedViews.value]
        })
      })
    }

    const delAllCachedViews = () => {
      return new Promise((resolve) => {
        cachedViews.value = []
        resolve([...cachedViews.value])
      })
    }

    const delAllVisitedViews = () => {
      return new Promise((resolve) => {
        const affixTags = visitedViews.value.filter((tag) => tag?.affix)
        visitedViews.value = affixTags
        resolve([...visitedViews.value])
      })
    }

    const delAllViews = () => {
      return new Promise((resolve) => {
        delAllCachedViews()
        delAllVisitedViews()
        resolve({
          visitedViews: [...visitedViews.value],
          cachedViews: [...cachedViews.value]
        })
      })
    }

    return {
      visitedViews,
      cachedViews,
      addVisitedView,
      addCachedView,
      delVisitedView,
      delCachedView,
      delOtherVisitedViews,
      delOtherCachedViews,
      updateVisitedView,
      addView,
      delView,
      delOtherViews,
      delAllCachedViews,
      delAllVisitedViews,
      delAllViews
    }
  },
  {
    persist: true
  }
)
