import EventEmitter from 'events';

const OPTIONS = {
    listClass:           'pagination-list',
    summaryClass:        'pagination-summary',
    summaryCurrentClass: 'pagination-summary-current',
    summaryOfClass:      'pagination-summary-text',
    summaryTotalClass:   'pagination-summary-total',
    itemClass:           'pagination-item',
    separatorClass:      'pagination-separator',
    prevClass:           'pagination-prev',
    nextClass:           'pagination-next',
    activeClass:         'active',
    disabledClass:       'disabled',

    showSummary:     true,
    showPages:       true,
    showPrevNext:    true,
    truncateList:    true,
    adjacentNumbers: 6,
    outerNumbers:    2,
    summaryOfText:   'of',
    prevText:        'Previous',
    nextText:        'Next',
    separatorText:   '&hellip;'
}

/**
 * Pagination class
 */
export default class Pagination extends EventEmiter {
    // region Constructor

    /**
     * Constructor
     *
     * @param {HTMLElement|String} container Container to insert pagination into
     * @param {Number}             pages     Total number of pages to render
     * @param {Number}             current   Current page
     * @param {Object}             options   Options
     */
    constructor (container, pages = 0, current = 1, options = {}) {
        super()

        this.current           = current
        this.hasUserInteracted = false
        this.pages             = pages
        this.pageArray         = []
        this.options           = Object.assign({}, OPTIONS, options)

        this.container = (typeof container === 'string')
            ? document.querySelector(container)
            : container

        this.definePageArray()
        this.render()
    }

    // endregion Construct

    // region Helpers

    /**
     * Define array of pages to render
     */
    definePageArray () {
        let i,
            pages         = [],
            adjacentTotal = (this.options.adjacentNumbers * 2),
            outerTotal    = (this.options.outerNumbers * 2)

        if (
            !this.options.truncateList ||
            (this.pages < (adjacentTotal + outerTotal))
        ) {
            // Don't truncate page list
            for (i = 1; i <= this.pages; i += 1) {
                pages.push(i)
            }
        } else if (this.pages > (adjacentTotal + outerTotal + 1)) {
            // Truncate page list
            if (this.current < (adjacentTotal + 1)) {
                // Truncate the end of the list
                for (i = 1; i < (adjacentTotal + outerTotal); i += 1) {
                    pages.push(i)
                }

                pages.push(this.options.separatorText)

                for (i = (this.pages - (this.options.outerNumbers - 1)); i <= this.pages; i += 1) {
                    pages.push(i)
                }
            } else if (
                (this.current < (this.pages - adjacentTotal)) &&
                (this.current > adjacentTotal)
            ) {
                // Truncate both ends of the list
                for (i = 1; i <= this.options.outerNumbers; i += 1) {
                    pages.push(i)
                }

                pages.push(this.options.separatorText)

                for (i = (this.current - this.options.adjacentNumbers); i <= (this.current + this.options.adjacentNumbers); i += 1) {
                    pages.push(i)
                }

                pages.push(this.options.separatorText)

                for (i = (this.pages - (this.options.outerNumbers - 1)); i <= this.pages; i += 1) {
                    pages.push(i)
                }
            } else {
                // Truncate the start of the list
                for (i = 1; i <= this.options.outerNumbers; i += 1) {
                    pages.push(i)
                }

                pages.push(this.options.separatorText)

                for (i = (this.pages - (this.options.outerNumbers + adjacentTotal)); i <= this.pages; i += 1) {
                    pages.push(i)
                }
            }
        }

        this.pageArray = pages
    }

    // endregion Helpers

    // region Event handlers

    /**
     * Handle page element click event
     *
     * @param {Number}     page Page number
     * @param {MouseEvent} evt  Event
     */
    handlePageClick (page, evt) {
        let direction = (page > this.current)
            ? 'forward'
            : 'backward'

        this.emit('pageclick:pre', {
            page: page
        })

        this.hasUserInteracted = true
        this.goTo(page, direction)

        this.emit('pageclick:post', {
            page: page
        })
    }

    /**
     * Handle previous element click event
     *
     * @param {MouseEvent} evt Event
     */
    handlePrevClick (evt) {
        this.emit('prevclick:pre', {
            page: this.current
        })

        this.hasUserInteracted = true
        this.prev()

        this.emit('prevclick:post', {
            page: this.current
        })
    }

    /**
     * Handle next element click event
     *
     * @param {MouseEvent} evt Event
     */
    handleNextClick (evt) {
        this.emit('nextclick:pre', {
            page: this.current
        })

        this.hasUserInteracted = true
        this.next()

        this.emit('nextclick:post', {
            page: this.current
        })
    }

    // endregion Event handlers

    // region Render

    /**
     * Render pagination summary
     */
    renderSummary () {
        this.summaryNode        = document.createElement('div')
        this.summaryCurrentNode = document.createElement('span')
        this.summaryOfNode      = document.createElement('span')
        this.summaryTotalNode   = document.createElement('span')

        this.summaryNode.className        = this.options.summaryClass
        this.summaryCurrentNode.className = this.options.summaryFromClass
        this.summaryOfNode.className      = this.options.summaryOfClass
        this.summaryTotalNode.className   = this.options.summaryTotalClass

        this.summaryCurrentNode.innerHTML = this.current
        this.summaryOfNode.innerHTML      = this.options.summaryOfText
        this.summaryTotalNode.innerHTML   = this.pages

        this.summaryNode.appendChild(this.summaryCurrentNode)
        this.summaryNode.appendChild(document.createTextNode(' '))
        this.summaryNode.appendChild(this.summaryOfNode)
        this.summaryNode.appendChild(document.createTextNode(' '))
        this.summaryNode.appendChild(this.summaryTotalNode)
        this.container.appendChild(this.summaryNode)
    }

    /**
     * Render page list
     */
    renderPages () {
        this.ul.innerHTML = ''

        this.pageArray.map((page) => {
            let pageNode = document.createElement('li')

            if (page === this.options.separatorText) {
                pageNode.className = this.options.separatorClass
            } else {
                pageNode.className    = this.options.itemClass
                pageNode.dataset.page = page

                pageNode.addEventListener('click', this.handlePageClick.bind(this, page))

                pageNode.classList.toggle(this.options.activeClass, (page === this.current))
            }

            pageNode.innerHTML = `<span>${page}</span>`

            this.ul.appendChild(pageNode)
        })
    }

    /**
     * Render previous and next elements
     */
    renderPrevNext () {
        this.prevNode = document.createElement('li')
        this.nextNode = document.createElement('li')

        this.prevNode.innerHTML = `<span>${this.options.prevText}</span>`
        this.nextNode.innerHTML = `<span>${this.options.nextText}</span>`

        this.prevNode.className = this.options.prevClass
        this.nextNode.className = this.options.nextClass

        this.prevNode.classList.toggle(this.options.disabledClass, ((this.current - 1) < 1))
        this.nextNode.classList.toggle(this.options.disabledClass, ((this.current + 1) > this.pages))

        this.prevNode.addEventListener('click', this.handlePrevClick.bind(this))
        this.nextNode.addEventListener('click', this.handleNextClick.bind(this))

        this.ul.appendChild(this.nextNode)
        this.ul.insertBefore(this.prevNode, this.ul.firstChild)
    }

    /**
     * Render pagination
     */
    render () {
        this.container.innerHTML = ''

        this.ul           = document.createElement('ul')
        this.ul.className = this.options.listClass

        if (this.options.showSummary) {
            this.renderSummary()
        }

        if (this.options.showPages) {
            this.renderPages()
        }

        if (this.options.showPrevNext) {
            this.renderPrevNext()
        }

        this.container.appendChild(this.ul)
    }

    // endregion Render

    // region Controls

    /**
     * Go to page
     *
     * @param {Number} page      Page number to go to
     * @param {String} direction Direction to go in (forward|backward)
     */
    goTo (page, direction = 'forward') {
        if (page === this.current) {
            return
        }

        let previousPage = this.current

        this.emit('goto:pre', {
            newPage:   page,
            direction: direction
        })

        if (page > this.pages) {
            page = this.pages
        } else if (page < 1) {
            page = 1
        }

        this.current = page

        this.definePageArray()
        this.render()

        this.emit('goto:post', {
            newPage:      this.current,
            previousPage: previousPage,
            direction:    direction
        })
    }

    /**
     * Go to previous page
     */
    prev () {
        if (this.current === 1) {
            return
        }

        this.emit('prev:pre')

        this.goTo(this.current - 1, 'backward')

        this.emit('prev:post')
    }

    /**
     * Go to next page
     */
    next () {
        if (this.current === this.pages) {
            return
        }

        this.emit('next:pre')

        this.goTo(this.current + 1, 'forward')

        this.emit('next:post')
    }

    // endregion Controls
}