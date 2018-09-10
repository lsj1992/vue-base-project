var BMap = require('bmaplib').BMap
var BMapLib = require('bmaplib').BMapLib

const ak = '2AzZMFXbazx9PusRVfmC7kGesTyuks8d'
/**
 * 异步加载百度地图
 * @returns {Promise}
 * @constructor
 */
function loadBaiDuMap() {
  return new Promise(function(resolve, reject) {
    try {
      console.log('BMap is defined:', BMap === undefined || BMap)
      resolve(BMap)
    } catch (e) {
      window.init = function() {
        resolve(BMap)
      }
      const script1 = document.createElement('script')
      script1.type = 'text/javascript'
      script1.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=init'
      script1.onerror = reject
      document.body.appendChild(script1)
    }
  })
}

export { loadBaiDuMap }
/**
 * 异步加载百度地图,以及绘制工具
 * @returns {Promise}
 * @constructor
 */
function loadBaiDuDrawMap() {
  return loadBaiDuMap().then(BMap => {
    let loaded = false
    try {
      loaded = (BMapLib && BMapLib.DrawingManager)
    } catch (e) {
      loaded = false
    }
    if (!loaded) {
      console.log('BMapLib.DrawingManager loading!')
      const script2 = document.createElement('script')
      script2.type = 'text/javascript'
      script2.src = 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js'
      document.body.appendChild(script2)
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css'
      document.body.appendChild(link)
    } else {
      console.log('BMapLib.DrawingManager is loaded!')
    }
    return BMap
  })
}

export { loadBaiDuDrawMap }
