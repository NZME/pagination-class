Pagination class
================
An ES6 class for pagination functionality and rendering.

Example
-------
This example shows how to create a pagination instance.
To integrate pagination with application logic, simply bind functionality to instance events.

### JavaScript
```javascript
import Pagination from 'pagination-class'

let pagination = new Pagination('#pagination-container', 50, 1)

pagination.on('goto:post', () => {
    // Application logic for navigation
})
```

### HTML
```html
<html>
  <head>
    <title>Pagination class example</title>
    <meta charset="utf-8" />
  </head>

  <body>
    <h1>Pagination class example</h1>

    <div id="pagination-container"></div>
  </body>
</html>
```

Parameters
----------
### `container`
Container to insert pagination elements into - can provide either an HTML node or a string to be used in `document.querySelector()`.

### `pages`
Total number of pages to render.

### `current`
Current page.

### `options`
Pagination instance options.

  - `listClass`: Class added to `<ul>` element
  - `summaryClass`: Class added to pagination summary container element
  - `summaryCurrentClass`: Class added to the `<span>` element containing the current page
  - `summaryOfClass`: Class added to the `<span>` element containing the 'of' text, defined in the `summaryOfText` option
  - `summaryTotalClass`: Class added to the `<span>` element containing the total number of pages
  - `itemClass`: Class added to page number elements
  - `separatorClass`: Class added to separator elements, between truncated points in the list
  - `prevClass`: Class added to previous element
  - `nextClass`: Class added to next element
  - `activeClass`: Class added to active page element
  - `disabledClass`: Class added to disabled elements
  - `showSummary`: Enable summary display
  - `showPages`: Enable pages display
  - `showPrevNext`: Enable previous and next display
  - `truncateList`: Enable truncated page list - if `false`, list will contain every page
  - `adjacentNumbers`: Number of pages to appear on either side of the current page
  - `outerNumbers`: Number of pages to appear on the outside of the truncated list - lists the first x pages and last x pages, depending where truncated
  - `summaryOfText`: Text to display in the summary, between the current page and total pages
  - `prevText`: Text to display in the previous element
  - `nextText`: Text to display in the next element
  - `separatorText`: Text to display in the page separator element

#### Defaults
```javascript
{
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
```

Controls
--------
Public control methods to be accessed on an instance are as follows:

### goTo
Go to page specified by `page` parameter.
Optionally, you can pass a `direction` parameter to determine if it is moving forwards or backwards - useful for integration with sliding animations.

### prev
Go to previous page - calls `goTo`.

### next
Go to next page - calls `goTo`.

Events
------
The class triggers the following events:

### pageclick:pre
Triggered before a page element is clicked.
#### Receives
```javascript
{
    page: page // New page to set
}
```

### pageclick:post
Triggered after a page element is clicked.
#### Receives
```javascript
{
    page: page // New page set
}
```

### prevclick:pre
Triggered before previous element is clicked.
#### Receives
```javascript
{
    page: page // Current page before being set
}
```

### prevclick:post
Triggered after previous element is clicked.
#### Receives
```javascript
{
    page: page // Current page after being set
}
```

### nextclick:pre
Triggered before next element is clicked.
#### Receives
```javascript
{
    page: page // Current page before being set
}
```

### nextclick:post
Triggered after next element is clicked.
#### Receives
```javascript
{
    page: page // Current page after being set
}
```

### goto:pre
Triggered before new page is set.
#### Receives
```javascript
{
    newPage:   newPage,  // New page to set
    direction: direction // Navigation direction
}
```

### goto:post
Triggered after new page is set.
#### Receives
```javascript
{
    newPage:      newPage,      // New page just set
    previousPage: previousPage, // Previous page before being set
    direction:    direction     // Navigation direction
}
```

### prev:pre
Triggered before navigating to previous page.

### prev:post
Triggered after navigating to previous page.

### next:pre
Triggered before navigating to next page.

### next:post
Triggered after navigating to next page.