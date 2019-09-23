import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { pluralize, singularize } from 'inflection';
import forEach from 'lodash/forEach';
import upperFirst from 'lodash/upperFirst';
/* eslint import/namespace: [2, { allowComputed: true }] */
import * as lib from '../src/index';

describe('Library Index', () => {
  it('should expose actions from resources', () => {
    const resources = [
      'activity',
      'adjustment',
      'agency',
      'alert',
      'alertSource',
      'assessment',
      'campaign',
      'district',
      'feature',
      'incident',
      'incidentType',
      'indicator',
      'item',
      'itemCategory',
      'itemUnit',
      'message',
      'plan',
      'procedure',
      'question',
      'questionnaire',
      'region',
      'resource',
      'role',
      'focalPerson',
      'stock',
      'warehouse',
    ];

    forEach(resources, resource => {
      const pluralName = upperFirst(pluralize(resource));
      const singularName = upperFirst(singularize(resource));

      expect(typeof lib[`clear${singularName}Filters`]).toBe('function');
      expect(typeof lib[`clear${pluralName}Sort`]).toBe('function');
      expect(typeof lib[`close${singularName}Form`]).toBe('function');
      expect(typeof lib[`delete${singularName}`]).toBe('function');
      expect(typeof lib[`filter${pluralName}`]).toBe('function');
      expect(typeof lib[`get${pluralName}`]).toBe('function');
      expect(typeof lib[`get${singularName}`]).toBe('function');
      expect(typeof lib[`select${singularName}`]).toBe('function');
      expect(typeof lib[`open${singularName}Form`]).toBe('function');
      expect(typeof lib[`paginate${pluralName}`]).toBe('function');
      expect(typeof lib[`post${singularName}`]).toBe('function');
      expect(typeof lib[`put${singularName}`]).toBe('function');
      expect(typeof lib[`refresh${pluralName}`]).toBe('function');
      expect(typeof lib[`search${pluralName}`]).toBe('function');
      expect(typeof lib[`set${singularName}Schema`]).toBe('function');
      expect(typeof lib[`sort${pluralName}`]).toBe('function');
    });

    expect(typeof lib.signin).toBe('function');
    expect(typeof lib.signout).toBe('function');
  });

  it('should expose connect function', () => {
    expect(typeof lib.Connect).toBe('function');
  });

  it('should expose StoreProvider as a function', () => {
    expect(typeof lib.StoreProvider).toBe('function');
  });
});

describe('Component Connect', () => {
  afterEach(cleanup);

  // eslint-disable-next-line
  const TestComponent = ({ alerts, total, page }) => (
    <div>
      <p data-testid="alerts-count">{typeof alerts}</p>
      <p data-testid="alerts-total">{total}</p>
      <p data-testid="alerts-page">{page}</p>
    </div>
  );

  it('should render component with states using object accessor', () => {
    const ConnectedComponent = lib.Connect(TestComponent, {
      alerts: 'alerts.list',
      total: 'alerts.total',
      page: 'alerts.page',
    });
    const { StoreProvider } = lib;

    const { getByTestId } = render(
      <StoreProvider>
        <ConnectedComponent />
      </StoreProvider>
    );

    expect(getByTestId('alerts-count').textContent).toBe('object');
    expect(getByTestId('alerts-total').textContent).toBe('0');
    expect(getByTestId('alerts-page').textContent).toBe('1');
  });

  it('should render component with states using functional accessor', () => {
    const ConnectedComponent = lib.Connect(TestComponent, state => ({
      alerts: state.alerts.list,
      total: state.alerts.total,
      page: state.alerts.page,
    }));

    const { StoreProvider } = lib;

    const { getByTestId } = render(
      <StoreProvider>
        <ConnectedComponent />
      </StoreProvider>
    );

    expect(getByTestId('alerts-count').textContent).toBe('object');
    expect(getByTestId('alerts-total').textContent).toBe('0');
    expect(getByTestId('alerts-page').textContent).toBe('1');
  });

  it('should not subscribe to store when accessor is undefined', () => {
    const ConnectedComponent = lib.Connect(TestComponent);

    const { StoreProvider } = lib;

    const { getByTestId } = render(
      <StoreProvider>
        <ConnectedComponent />
      </StoreProvider>
    );

    expect(getByTestId('alerts-count').textContent).toBe('undefined');
    expect(getByTestId('alerts-total').textContent).toBe('');
    expect(getByTestId('alerts-page').textContent).toBe('');
  });
});
