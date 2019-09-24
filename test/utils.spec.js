import { camelize, normalizeError } from '../src/utils';

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
});
