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
- event
- eventAction
- eventFunction
- eventGroup
- eventType
- focalPerson
- partyRole

  For each resource you can get it's exposed actions as follows;

  > Replace events with the name of the module you want

```js
import {
  clearEventFilters,
  clearEventsSort,
  closeEventForm,
  deleteEvent,
  filterEvents,
  getEvents,
  getEvent,
  selectEvent,
  openEventForm,
  paginateEvents,
  postEvent,
  putEvent,
  refreshEvents,
  searchEvents,
  sortEvents,
} from '@codetanzania/ewea-api-states';
```

### Store Structure

The structure of the store for each resource is

```js
const store = {
 events: {
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
function EventList({ events }){
  return(
    // jsx stuff
  );
}

// connect EventList component to store
export Connect(EventList, {
    events: 'events.list'
});

```

### How to use exposed actions

Some of these actions accepts two callback functions which will be executed on Success and Error scenarios as shown below;

#### Fetch Data

```js
import { getEvents, getEvent } from '@codetanzania/ewea-api-states';

getEvents();

getEvents(eventId);
```

#### Create Data

```js
import { postEvent } from '@codetanzania/ewea-api-states';

postEvent(event, onSuccess, onError);
```

#### Update Data

```js
import { putEvent } from '@codetanzania/ewea-api-states';

putEvent(event, onSuccess, onError);
```

#### Archive/Delete Data

```js
import { deleteEvent } from '@codetanzania/ewea-api-states';

deleteEvent(eventId, onSuccess, onError);
```

#### Searching

```js
import { searchEvents } from '@codetanzania/ewea-api-states';

searchEvents(searchQueryString);
```

#### Filtering

```js
import { filterEvents, clearEventFilters } from '@codetanzania/ewea-api-states';

filterEvents({ eventType: eventTypeId }, onSuccess, onError);

// clearing filters
clearEventFilters(onSuccess, onError);

//  keep some filters from being cleared. This won't reset plan field in filter object
clearEventFilters(onSuccess, onError, ['eventType']);
```

#### Pagination

```js
import { paginateEvents } from '@codetanzania/ewea-api-state';

paginateEvents(pageNumber);
```

#### Sorting

```js
import { sortEvents, clearEventsSort } from '@codetanzania/ewea-api-state';

sortEvents({ name: 1 }, onSuccess, onError);

// clear sort

clearEventsSort(onSuccess, onError);
```

> Note: This library depends on [ewea-api-client](https://github.com/CodeTanzania/ewea-api-client) to work, so in order to specify API URL add `.env` file on your project root folder and specify your API URL under `REACT_APP_EWEA_API_URL=[specify API BASE URL here]`

### LICENSE

MIT License

Copyright (c) 2019 - present Code Tanzania & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
