import createSliceFor, {
  getDefaultInitialState,
  getDefaultReducers,
} from '../src/factories/slice';

function createAction(actionType, payload) {
  return { type: actionType, payload };
}

describe('Slice Factory', () => {
  const defaultState = {
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
    q: undefined,
  };

  it('should create a slice provided slice name', () => {
    const resources = createSliceFor('resources');

    expect(resources.actions).toBeDefined();
    expect(resources.reducer).toBeDefined();
    expect(resources.selectors).toBeDefined();
  });

  it('should create common actions for each resource', () => {
    const todos = createSliceFor('todo');

    const actions = Object.keys(todos.actions);

    expect(actions.length).toBeGreaterThan(0);
    expect(actions).toEqual([
      'selectTodo',
      'filterTodos',
      'sortTodos',
      'searchTodos',
      'clearTodosFilters',
      'clearTodosSort',
      'getTodosRequest',
      'getTodosSuccess',
      'getTodosFailure',
      'getTodoRequest',
      'getTodoSuccess',
      'getTodoFailure',
      'postTodoRequest',
      'postTodoSuccess',
      'postTodoFailure',
      'putTodoRequest',
      'putTodoSuccess',
      'putTodoFailure',
      'deleteTodoRequest',
      'deleteTodoSuccess',
      'deleteTodoFailure',
      'openTodoForm',
      'closeTodoForm',
      'setTodoSchema',
    ]);
  });

  describe('Generated Reducer', () => {
    it('should handle select action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;
      const selectTodoAction = createAction('todos/selectTodo', {
        name: 'Todo',
      });
      expect(reducer(defaultState, selectTodoAction)).toEqual({
        ...defaultState,
        selected: selectTodoAction.payload,
      });
    });

    it('should handle filter action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;
      const filterTodosAction = createAction('todos/filterTodos', {
        name: 'Todo',
      });
      expect(reducer(defaultState, filterTodosAction)).toEqual({
        ...defaultState,
        filter: filterTodosAction.payload,
      });
    });

    it('should handle sort action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;
      const sortTodosAction = createAction('todos/sortTodos', {
        name: -1,
      });
      expect(reducer(defaultState, sortTodosAction)).toEqual({
        ...defaultState,
        sort: sortTodosAction.payload,
      });
    });

    it('should handle clear sort action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;
      const clearSortAction = createAction('todos/clearTodosSort');
      expect(reducer({ ...defaultState, sort: {} }, clearSortAction)).toEqual({
        ...defaultState,
        sort: null,
      });
    });

    it('should handle search action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;
      const searchTodosAction = createAction('todos/searchTodos', {
        q: 'Test query string',
      });
      expect(reducer(defaultState, searchTodosAction)).toEqual({
        ...defaultState,
        q: searchTodosAction.payload,
      });
    });

    it('should handle get resources request action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const getTodosRequestAction = createAction('todos/getTodosRequest');

      expect(reducer(defaultState, getTodosRequestAction)).toEqual({
        ...defaultState,
        loading: true,
      });
    });

    it('should handle get resources success action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const getTodosSuccessAction = createAction('todos/getTodosSuccess', {
        data: [{ name: 'todos' }],
        size: 1,
        page: 1,
        total: 1,
      });

      expect(reducer(defaultState, getTodosSuccessAction)).toEqual({
        ...defaultState,
        list: [...getTodosSuccessAction.payload.data],
        page: getTodosSuccessAction.payload.page,
        total: getTodosSuccessAction.payload.total,
        size: getTodosSuccessAction.payload.size,
        loading: false,
      });
    });

    it('should handle get resource failure action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const getTodosFailureAction = createAction(
        'todos/getTodosFailure',
        new Error()
      );

      expect(reducer(defaultState, getTodosFailureAction)).toEqual({
        ...defaultState,
        error: getTodosFailureAction.payload,
        loading: false,
      });
    });

    it('should handle post resource request action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const postTodoRequestAction = createAction('todos/postTodoRequest');

      expect(reducer(defaultState, postTodoRequestAction)).toEqual({
        ...defaultState,
        posting: true,
      });
    });

    it('should handle post request success action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const postTodoSuccessAction = createAction('todos/postTodoSuccess');

      expect(
        reducer(
          { ...defaultState, posting: true, showForm: true },
          postTodoSuccessAction
        )
      ).toEqual({
        ...defaultState,
        posting: false,
      });
    });

    it('should handle post request failure action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const postTodoFailureAction = createAction(
        'todos/postTodoFailure',
        new Error()
      );

      expect(
        reducer(
          { ...defaultState, posting: true, showForm: true },
          postTodoFailureAction
        )
      ).toEqual({
        ...defaultState,
        posting: false,
        showForm: true,
        error: postTodoFailureAction.payload,
      });
    });

    it('should handle put request action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const putTodoRequestAction = createAction('todos/putTodoRequest');

      expect(reducer(defaultState, putTodoRequestAction)).toEqual({
        ...defaultState,
        posting: true,
      });
    });

    it('should handle put success action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const putTodoSuccessAction = createAction('todos/putTodoSuccess');

      expect(
        reducer(
          { ...defaultState, posting: true, showForm: true },
          putTodoSuccessAction
        )
      ).toEqual({
        ...defaultState,
        posting: false,
        showForm: false,
      });
    });

    it('should handle put failure action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const putTodoFailureAction = createAction(
        'todos/putTodoFailure',
        new Error()
      );

      expect(
        reducer(
          { ...defaultState, posting: true, showForm: true },
          putTodoFailureAction
        )
      ).toEqual({
        ...defaultState,
        showForm: true,
        posting: false,
        error: putTodoFailureAction.payload,
      });
    });

    it('should handle delete request action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const deleteTodoAction = createAction('todos/deleteTodoRequest');

      expect(
        reducer({ ...defaultState, posting: false }, deleteTodoAction)
      ).toEqual({
        ...defaultState,
        posting: true,
      });
    });

    it('should handle delete success action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const deleteTodoAction = createAction('todos/deleteTodoSuccess');

      expect(
        reducer({ ...defaultState, posting: true }, deleteTodoAction)
      ).toEqual({
        ...defaultState,
        posting: false,
      });
    });

    it('should handle delete failure action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const deleteTodoAction = createAction(
        'todos/deleteTodoFailure',
        new Error()
      );

      expect(
        reducer({ ...defaultState, posting: true }, deleteTodoAction)
      ).toEqual({
        ...defaultState,
        posting: false,
        error: deleteTodoAction.payload,
      });
    });

    it('should handle open resource form action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const openTodoFormAction = createAction('todos/openTodoForm');

      expect(reducer(defaultState, openTodoFormAction)).toEqual({
        ...defaultState,
        showForm: true,
      });
    });

    it('should handle close resource form action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const closeTodoFormAction = createAction('todos/closeTodoForm');

      expect(
        reducer({ ...defaultState, showForm: true }, closeTodoFormAction)
      ).toEqual({
        ...defaultState,
        showForm: false,
      });
    });

    it('should handle set resource schema action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      const setTodoSchemaAction = createAction('todos/setTodoSchema', {
        name: 'Todo Schema',
      });

      expect(reducer(defaultState, setTodoSchemaAction)).toEqual({
        ...defaultState,
        schema: setTodoSchemaAction.payload,
      });
    });

    it('should handle invalid action', () => {
      const todos = createSliceFor('todos');

      const { reducer } = todos;

      expect(typeof reducer).toBe('function');
      expect(reducer(undefined, {})).toEqual(defaultState);
    });
  });

  describe('getDefaultInitialState', () => {
    it('should generate default initial default state', () => {
      expect(getDefaultInitialState()).toEqual(defaultState);
    });
  });

  describe('getDefaultReducers', () => {
    it('should generate default initial reducers object', () => {
      expect(typeof getDefaultReducers('todo').getTodosSuccess).toBe(
        'function'
      );
      expect(typeof getDefaultReducers('todo').getTodosFailure).toBe(
        'function'
      );
      expect(typeof getDefaultReducers('todo').getTodosSuccess).toBe(
        'function'
      );
      expect(typeof getDefaultReducers('todo').postTodoRequest).toBe(
        'function'
      );
      expect(typeof getDefaultReducers('todo').postTodoSuccess).toBe(
        'function'
      );
      expect(typeof getDefaultReducers('todo').postTodoFailure).toBe(
        'function'
      );
      expect(typeof getDefaultReducers('todo').putTodoRequest).toBe('function');
      expect(typeof getDefaultReducers('todo').putTodoSuccess).toBe('function');
      expect(typeof getDefaultReducers('todo').putTodoFailure).toBe('function');
      expect(typeof getDefaultReducers('todo').openTodoForm).toBe('function');
      expect(typeof getDefaultReducers('todo').closeTodoForm).toBe('function');
      expect(typeof getDefaultReducers('todo').setTodoSchema).toBe('function');
    });
  });
});
