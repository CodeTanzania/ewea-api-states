import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { pluralize, singularize } from 'inflection';
import forEach from 'lodash/forEach';
import upperFirst from 'lodash/upperFirst';
import {
  reduxActions,
  signIn,
  signOut,
  Connect,
  StoreProvider,
} from '../src/index';

import { REPORTS, resources } from '../src/store';

describe('Library Index', () => {
  it('should expose actions from resources', () => {
    forEach(resources, (resource) => {
      const pluralName = upperFirst(pluralize(resource));
      const singularName = upperFirst(singularize(resource));
      expect(typeof reduxActions[`clear${singularName}Filters`]).toBe(
        'function'
      );
      expect(typeof reduxActions[`clear${pluralName}Sort`]).toBe('function');
      expect(typeof reduxActions[`close${singularName}Form`]).toBe('function');
      expect(typeof reduxActions[`delete${singularName}`]).toBe('function');
      expect(typeof reduxActions[`filter${pluralName}`]).toBe('function');
      expect(typeof reduxActions[`get${pluralName}`]).toBe('function');
      expect(typeof reduxActions[`get${singularName}`]).toBe('function');
      expect(typeof reduxActions[`select${singularName}`]).toBe('function');
      expect(typeof reduxActions[`open${singularName}Form`]).toBe('function');
      expect(typeof reduxActions[`paginate${pluralName}`]).toBe('function');
      expect(typeof reduxActions[`post${singularName}`]).toBe('function');
      expect(typeof reduxActions[`put${singularName}`]).toBe('function');
      expect(typeof reduxActions[`refresh${pluralName}`]).toBe('function');
      expect(typeof reduxActions[`search${pluralName}`]).toBe('function');
      expect(typeof reduxActions[`set${singularName}Schema`]).toBe('function');
      expect(typeof reduxActions[`sort${pluralName}`]).toBe('function');
      expect(typeof reduxActions[`loadMore${pluralName}`]).toBe('function');
    });

    expect(typeof signIn).toBe('function');
    expect(typeof signOut).toBe('function');
  });

  it('should expose all reports actions', () => {
    forEach(REPORTS, (report) => {
      const pluralName = upperFirst(pluralize(report));
      expect(typeof reduxActions[`get${pluralName}Report`]).toBe('function');
    });
  });

  it('should expose connect function', () => {
    expect(typeof Connect).toBe('function');
  });

  it('should expose StoreProvider as a function', () => {
    expect(typeof StoreProvider).toBe('function');
  });
});

describe.skip('Component Connect', () => {
  afterEach(cleanup);

  // eslint-disable-next-line
  const TestComponent = ({ focalPeople, total, page }) => (
    <div>
      <p data-testid="focalPeople-count">{typeof focalPeople}</p>
      <p data-testid="focalPeople-total">{total}</p>
      <p data-testid="focalPeople-page">{page}</p>
    </div>
  );

  it('should render component with states using object accessor', () => {
    const ConnectedComponent = Connect(TestComponent, {
      focalPeople: 'focalPeople.list',
      total: 'focalPeople.total',
      page: 'focalPeople.page',
    });

    const { getByTestId } = render(
      <StoreProvider>
        <ConnectedComponent />
      </StoreProvider>
    );

    expect(getByTestId('focalPeople-count').textContent).toBe('object');
    expect(getByTestId('focalPeople-total').textContent).toBe('0');
    expect(getByTestId('focalPeople-page').textContent).toBe('1');
  });

  it('should render component with states using functional accessor', () => {
    const ConnectedComponent = Connect(TestComponent, (state) => ({
      focalPeople: state.focalPeople.list,
      total: state.focalPeople.total,
      page: state.focalPeople.page,
    }));

    const { getByTestId } = render(
      <StoreProvider>
        <ConnectedComponent />
      </StoreProvider>
    );

    expect(getByTestId('focalPeople-count').textContent).toBe('object');
    expect(getByTestId('focalPeople-total').textContent).toBe('0');
    expect(getByTestId('focalPeople-page').textContent).toBe('1');
  });

  it('should not subscribe to store when accessor is undefined', () => {
    const ConnectedComponent = Connect(TestComponent);

    const { getByTestId } = render(
      <StoreProvider>
        <ConnectedComponent />
      </StoreProvider>
    );

    expect(getByTestId('focalPeople-count').textContent).toBe('undefined');
    expect(getByTestId('focalPeople-total').textContent).toBe('');
    expect(getByTestId('focalPeople-page').textContent).toBe('');
  });
});
