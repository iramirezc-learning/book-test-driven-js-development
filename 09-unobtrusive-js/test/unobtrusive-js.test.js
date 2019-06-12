/* globals describe it beforeEach */

const assert = require('assert')
const { JSDOM } = require('jsdom')

const { assertIsObject } = require('../../lib/assertions')
const tddjs = require('../../lib/tddjs')

describe('Chapter 09', () => {
  describe('9.1 The goal of unobtrusive JavaScript', () => {
    it('should have nothing to test', () => {
      assert.strictEqual(true, true)
    })
  })

  describe('9.2 The rules of unobtrusive JavaScript', () => {
    it('should have nothing to test', () => {
      assert.strictEqual(true, true)
    })
  })

  describe('9.3 Do not make assumptions', () => {
    it('should have nothing to test', () => {
      assert.strictEqual(true, true)
    })
  })

  describe('9.4 When do the rules apply?', () => {
    it('should have nothing to test', () => {
      assert.strictEqual(true, true)
    })
  })

  describe('9.5 Unobtrusive tabbed panel example', () => {
    let dom
    let tabs
    let links
    let lis

    beforeEach(() => {
      dom = new JSDOM('<ol id="tabs">\
          <li><a href="#news">News</a></li>\
          <li><a href="#sports">Sports</a></li>\
          <li><a href="#economy">Economy</a></li>\
        </ol>')
      tabs = dom.window.document.getElementById('tabs')
      links = tabs.getElementsByTagName("a")
      lis = tabs.getElementsByTagName("li")
    })

    describe('Tab Controller create test', () => {
      const tabController = tddjs.ui.tabController

      it('should fail without element', () => {
        assert.throws(() => {
          tabController.create()
        }, /TypeError/)
      })

      it('should fail without element class', () => {
        assert.throws(() => {
          tabController.create({})
        }, /TypeError/)
      })

      it('should fail without element string class', () => {
        assert.throws(() => {
          tabController.create({ className: 1 })
        }, /TypeError/)
      })

      it('should return object', () => {
        const controller = tabController.create(tabs)
        assertIsObject(controller)
        assert.strictEqual(typeof controller.create, 'function')
        assert.strictEqual(typeof controller.handleTabClick, 'function')
      })

      it('should add js-tabs className to element', () => {
        assert.strictEqual(tabs.className, '')
        tabController.create(tabs)
        assert.strictEqual(tabs.className, 'js-tab-controller')
      })
    })

    describe('Tabbed Controller activateTab test', () => {
      const tabController = tddjs.ui.tabController
      let controller

      beforeEach(() => {
        controller = tabController.create(tabs)
      })

      it('should not fail without anchor', () => {
        assert.doesNotThrow(() => {
          controller.activateTab()
        })
      })

      it('should mark anchor as active', () => {
        assert.strictEqual(links[0].className, '')
        controller.activateTab(links[0])
        assert.strictEqual(links[0].className, 'active-tab')
      })

      it('should deactivate previous tab', () => {
        controller.activateTab(links[0])
        controller.activateTab(links[1])
        assert.strictEqual(links[0].className, '')
        assert.strictEqual(links[1].className, 'active-tab')
      })

      it('should not activate unsupported element types', () => {
        controller.activateTab(links[0])
        controller.activateTab(lis[0])
        assert.strictEqual(links[0].className, 'active-tab')
        assert.strictEqual(lis[0].className, '')
      })

      it('should fire onTabChange', () => {
        let actualPrevious
        let actualCurrent

        controller.activateTab(links[0])
        controller.onTabChange = function (curr, prev) {
          actualPrevious = prev
          actualCurrent = curr
        }
        controller.activateTab(links[1])
        assert.strictEqual(actualPrevious, links[0])
        assert.strictEqual(actualCurrent, links[1])
      })
    })

    describe('Using the Tab Controller', () => {
      const tabController = tddjs.ui.tabController

      const markup = `
        <div class="tabbed-panel">
        <ol id="news-tabs" class="nav">
          <li><a href="#news">Latest news</a></li>
          <li><a href="#sports">Sports</a></li>
          <li><a href="#economy">Economy</a></li>
        </ol>
        <div class="section">
            <h2><a name="news">Latest news</a></h2>
            <p>Latest news contents [...]</p>
          </div>
          <div class="section">
            <h2><a name="sports">Sports</a></h2>
            <p>Sports contents [...]</p>
          </div>
          <div class="section">
            <h2><a name="economy">Economy</a></h2>
            <p>Economy contents [...]</p>
          </div>
        </div>`

      let dom
      let ol
      let getPanel

      beforeEach(() => {
        dom = new JSDOM(markup)
        ol = dom.window.document.getElementById('news-tabs')

        /**
         * Returns the div element that contains an anchor with
         * the name provided by another anchor as href
         */
        getPanel = (element) => {
          if (!element || typeof element.href !== 'string') return null

          const target = element.href.replace(/.*#/, '')

          let panel = dom.window.document.getElementsByName(target)[0]

          while (panel && panel.tagName.toLowerCase() !== 'div') {
            panel = panel.parentNode
          }

          return panel
        }
      })

      it('activate and deactivate a section panel', () => {
        const controller = tabController.create(ol)

        assert.strictEqual(ol.parentNode.className, 'tabbed-panel')
        tddjs.ui.dom.addClassName(ol.parentNode, 'js-tabs')
        assert.strictEqual(ol.parentNode.className, 'tabbed-panel js-tabs')

        let previous
        let current

        controller.onTabChange = function (curr, prev) {
          previous = getPanel(prev)
          current = getPanel(curr)
          tddjs.ui.dom.removeClassName(previous, 'active-panel')
          tddjs.ui.dom.addClassName(current, 'active-panel')
        }

        // click the 'news' tab
        const newsTab = ol.getElementsByTagName('a')[0]
        const newsSection = getPanel(newsTab)

        assert.strictEqual(newsTab.className, '', 'news tab should not be active')
        controller.activateTab(newsTab)
        assert.strictEqual(newsTab.className, 'active-tab', 'news tab now should be active')

        assert.strictEqual(previous, null, 'there should not be a previous tab selected')
        assert.strictEqual(current, newsSection, 'the news section should be the current selected section')
        assert.strictEqual(current.className, 'section active-panel', 'the news section should be the active panel')


        // click the 'economy' tab
        const economyTab = ol.getElementsByTagName('a')[2]
        const economySection = getPanel(economyTab)

        assert.strictEqual(economyTab.className, '', 'economy tab should not be active')
        controller.activateTab(economyTab)
        assert.strictEqual(newsTab.className, '', 'news tab should be inactive')
        assert.strictEqual(economyTab.className, 'active-tab', 'economy tab should now be active')

        assert.strictEqual(previous, newsSection, 'the previous section will be the news section')
        assert.strictEqual(previous.className, 'section', 'the previous section should be inactive')
        assert.strictEqual(current, economySection, 'the current section will economy section')
        assert.strictEqual(current.className, 'section active-panel', 'the current section should be active')
      })
    })
  })
})
