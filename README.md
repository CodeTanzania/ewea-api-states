# EWEA API States

[![Build Status](https://travis-ci.org/CodeTanzania/ewea-api-states.svg?branch=develop)](https://travis-ci.org/CodeTanzania/ewea-api-states)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Simplify API calls and state management on top of redux and others.

## Installation

Using npm

```sh
npm install @codetanzania/ewea-api-states
```

Using yarn

```sh
yarn add @codetanzania/ewea-api-states
```

## Usage

All actions exposed by `ewea-api-states` are wrapped with dispatch function, so the is no need to dispatch them again just invoke them.

The following is the list of all resources exposed by this library.

- agency
- alert
- feature
- focalPerson
- incident
- incidentType
- indicator
- role

  For each resource you can get it's exposed actions as follows;

  > Replace alerts/activity with the name of the module you want

```js
import {
  clearAlertFilters,
  clearAlertsSort,
  closeAlertForm,
  deleteAlert,
  filterAlerts,
  getAlerts,
  getAlert,
  selectAlert,
  openAlertForm,
  paginateAlerts,
  postAlert,
  putAlert,
  refreshAlerts,
  searchAlerts,
  sortAlerts,
} from '@codetanzania/ewea-api-states';
```

### Store Structure

The structure of the store for each resource is

```js
const store = {
 alerts: {
    list: [],
    selected: null,
    page: 1,
    total: 0,
    size: 0,
    pages: 1,
    loading: false,
    posting: false,
    showForm: false,
    schema: null,
    filter: null,
    sort: null,
    q: undefined
  },
  ...
};
```

### StoreProvider

This is a wrapper around react-redux `Provider` component. You can use it as follows

```jsx
import { render } from 'react-dom';
import { StoreProvider } from '@codetanzania/ewea-api-states';

// store provider
render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById('root')
);
```

### Connect

This is a wrapper around react-redux `connect` HOC with little improvement over it. You can use it as follows

```js
import {Connect} from '@codetanzania/ewea-api-states';

// for component
function AlertList({ alerts }){
  return(
    // jsx stuff
  );
}

// connect AlertList component to store
export Connect(AlertList, {
    alerts: 'alerts.list'
});

```

### How to use exposed actions

Some of these actions accepts two callback functions which will be executed on Success and Error scenarios as shown below;

#### Fetch Data

```js
import { getAlerts, getAlert } from '@codetanzania/ewea-api-states';

getAlerts();

getAlerts(alertId);
```

#### Create Data

```js
import { postAlert } from '@codetanzania/ewea-api-states';

postAlert(alert, onSuccess, onError);
```

#### Update Data

> Note the `activity` here should have a valid `_id` property

```js
import { putAlert } from '@codetanzania/ewea-api-states';

putAlert(alert, onSuccess, onError);
```

#### Archive/Delete Data

```js
import { deleteAlert } from '@codetanzania/ewea-api-states';

deleteAlert(alertId, onSuccess, onError);
```

#### Searching

```js
import { searchAlerts } from '@codetanzania/ewea-api-states';

searchAlerts(searchQueryString);
```

#### Filtering

```js
import { filterAlerts, clearAlertFilters } from '@codetanzania/ewea-api-states';

filterAlerts({ alertType: alertTypeId }, onSuccess, onError);

// clearing filters
clearAlertFilters(onSuccess, onError);

//  keep some filters from being cleared. This won't reset plan field in filter object
clearAlertFilters(onSuccess, onError, ['alertType']);
```

#### Pagination

```js
import { paginateAlerts } from '@codetanzania/ewea-api-state';

paginateAlerts(pageNumber);
```

#### Sorting

```js
import { sortAlerts, clearAlertsSort } from '@codetanzania/ewea-api-state';

sortAlerts({ name: 1 }, onSuccess, onError);

// clear sort

clearAlertsSort(onSuccess, onError);
```

> Note: This library depends on [ewea-api-client](https://github.com/CodeTanzania/ewea-api-client) to work, so in order to specify API URL add `.env` file on your project root folder and specify your API URL under `REACT_APP_EWEA_API_URL=[specify API BASE URL here]`

### LICENSE

MIT License

Copyright (c) 2019 - present Code Tanzania & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
