# EMIS API States

[![Build Status](https://travis-ci.org/CodeTanzania/emis-api-states.svg?branch=develop)](https://travis-ci.org/CodeTanzania/emis-api-states)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Simplify API calls and state management on top of redux and others.

## Installation

Using npm

```sh
npm install @codetanzania/emis-api-states
```

Using yarn

```sh
yarn add @codetanzania/emis-api-states
```

## Usage

All actions exposed by `emis-api-states` are wrapped with dispatch function, so the is no need to dispatch them again just invoke them.

The following is the list of all resources exposed by this library.

- activity
- adjustment
- agency
- alert
- alertSource
- assessment
- district
- feature
- focalPerson
- incident
- incidentType
- indicator
- item
- itemCategory
- itemUnit
- plan
- procedure
- question
- questionnaire
- region
- resource
- role
- stock
- warehouse

  For each resource you can get it's exposed actions as follows;

  > Replace activities/activity with the name of the module you want

```js
import {
  clearActivityFilters,
  clearActivitiesSort,
  closeActivityForm,
  deleteActivity,
  filterActivities,
  getActivities,
  getActivity,
  selectActivity,
  openActivityForm,
  paginateActivities,
  postActivity,
  putActivity,
  refreshActivities,
  searchActivities,
  sortActivities,
} from '@codetanzania/emis-api-states';
```

### Store Structure

The structure of the store for each resource is

```js
const store = {
  activities: {
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
import { StoreProvider } from '@codetanzania/emis-api-states';

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
import {Connect} from '@codetanzania/emis-api-states';

// for component
function ActivityList({ activities }){
  return(
    // jsx stuff
  );
}

// connect AlertList component to store
export Connect(AlertList, {
    activities: 'activities.list'
});

```

### How to use exposed actions

Some of these actions accepts two callback functions which will be executed on Success and Error scenarios as shown below;

#### Fetch Data

```js
import { getActivities, getActivity } from '@codetanzania/emis-api-states';

getActivities();

getActivity(activityId);
```

#### Create Data

```js
import { postActivity } from '@codetanzania/emis-api-states';

postActivity(activity, onSuccess, onError);
```

#### Update Data

> Note the `activity` here should have a valid `_id` property

```js
import { putActivity } from '@codetanzania/emis-api-states';

putActivity(activity, onSuccess, onError);
```

#### Archive/Delete Data

```js
import { deleteActivity } from '@codetanzania/emis-api-states';

deleteActivity(activityId, onSuccess, onError);
```

#### Searching

```js
import { searchActivities } from '@codetanzania/emis-api-states';

searchActivities(searchQueryString);
```

#### Filtering

```js
import {
  filterActivities,
  clearActivityFilters,
} from '@codetanzania/emis-api-states';

filterActivities({ plan: planId }, onSuccess, onError);

// clearing filters
clearActivityFilters(onSuccess, onError);

//  keep some filters from being cleared. This won't reset plan field in filter object
clearActivityFilters(onSuccess, onError, ['plan']);
```

#### Pagination

```js
import { paginateActivities } from '@codetanzania/emis-api-state';

paginateActivity(pageNumber);
```

#### Sorting

```js
import {
  sortActivities,
  clearActivitiesSort,
} from '@codetanzania/emis-api-state';

sortActivities({ name: 1 }, onSuccess, onError);

// clear sort

clearActivitiesSort(onSuccess, onError);
```

> Note: This library depends on [emis-api-client](https://github.com/CodeTanzania/emis-api-client) to work, so in order to specify API URL add `.env` file on your project root folder and specify your API URL under `REACT_APP_EMIS_API_URL=[specify API BASE URL here]`

### LICENSE

MIT License

Copyright (c) 2018 - present Code Tanzania & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
