import isEmpty from 'lodash/isEmpty';
import {
  camelize,
  normalizeError,
  getPartyPermissionsWildcards,
} from '../src/utils';

describe('helpers', () => {
  describe('camelize', () => {
    it('should generate camelCase word', () => {
      expect(camelize(['plan'])).toBe('plan');
      expect(camelize('get', 'activity')).toBe('getActivity');
      expect(camelize('get', 'incidentType')).toBe('getIncidentType');
    });
  });

  describe('normalizeError', () => {
    it('should normalize errors message to have name and message', () => {
      const error = {
        status: 400,
        code: 400,
        name: 'Error',
        message: 'Bad Request',
        description: 'Bad Request',
        errors: {
          name: {
            message: 'Path `name` (John Doe) is not unique',
            name: 'ValidatorError',
            type: 'unique',
            kind: 'unique',
            path: 'name',
            value: 'John Doe',
          },
          details: {
            message: 'Path `details` (John Doe) is not unique',
            name: 'ValidatorError',
            type: 'unique',
            kind: 'unique',
            path: 'name',
            value: 'John Doe',
          },
        },
      };

      const normalizedError = normalizeError(error);

      expect(typeof normalizedError).toBe('object');
      expect(typeof normalizedError.errors).toBe('object');
      expect(normalizedError.errors.name).toBe(
        `${error.errors.name.name} : ${error.errors.name.message}`
      );
      expect(normalizedError.errors.details).toBe(
        `${error.errors.details.name} : ${error.errors.details.message}`
      );
    });

    it('should continue to work even when there is no errors', () => {
      const error = {
        status: 400,
        code: 400,
        name: 'Error',
        message: 'Bad Request',
        description: 'Bad Request',
      };

      const normalizedError = normalizeError(error);
      expect(typeof normalizedError).toBe('object');
      expect(error).toEqual(normalizedError);
    });
  });

  describe('extractPermissionsWildcards', () => {
    it('should return empty array when no permissions', () => {
      expect(getPartyPermissionsWildcards()).toBeInstanceOf(Array);
      expect(isEmpty(getPartyPermissionsWildcards({}))).toBe(true);
    });

    it('should return an array of strings', () => {
      const party = {
        role: {
          relations: {
            permissions: [
              {
                resource: 'Setting',
                action: 'create',
                wildcard: 'setting:create',
                _id: '5e5d4478ed296e002b81b98f',
              },
              {
                resource: 'Setting',
                action: 'view',
                wildcard: 'setting:view',
                _id: '5e5d4478ed296e002b81b990',
              },
              {
                resource: 'Setting',
                action: 'edit',
                wildcard: 'setting:edit',
                _id: '5e5d4478ed296e002b81b991',
              },
            ],
          },
        },
      };

      expect(getPartyPermissionsWildcards(party)).toEqual([
        'setting:create',
        'setting:view',
        'setting:edit',
      ]);
      expect(getPartyPermissionsWildcards(party)).toHaveLength(3);
    });
  });
});
