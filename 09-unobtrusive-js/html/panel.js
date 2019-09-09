/* globals tddjs */

(function () {
  if (typeof document === 'undefined' || !document.getElementById) return

  var dom = tddjs.dom
  var ol = document.getElementById('news-tabs')

  function getPanel (element) {
    if (!element || typeof element.href !== 'string') return null

    const target = element.href.replace(/.*#/, '')

    let panel = document.getElementsByName(target)[0]

    while (panel && panel.tagName.toLowerCase() !== 'div') {
      panel = panel.parentNode
    }

    return panel
  }

  try {
    var controller = tddjs.ui.tabController.create(ol)
    dom.addClassName(ol.parentNode, 'js-tabs')
    controller.onTabChange = function (curr, prev) {
      dom.removeClassName(getPanel(prev), 'active-panel')
      dom.addClassName(getPanel(curr), 'active-panel')
    }
    controller.activateTab(ol.getElementsByTagName('a')[0])
  } catch (e) {
    console.error(e)
  }
}())
