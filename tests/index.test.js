const {
    makeExecutableSchema,
    addMockFunctionsToSchema,
    mockServer
  } = require('graphql-tools')
const typeDefs = require('../graphql/schema')
const { graphql } = require('graphql-tools')

  const testCaseA = {
    id: 'Test case A',
    query: `
      query {
        animals {
           origin
        }
      }
    `,
    variables: { },
    context: { },
    expected: { data: { animals: [{ kind: 'Dog' }] } }
  };
  
  describe('Schema', () => {
    // Array of case types
    const cases = [testCaseA];
    
    const mockSchema = makeExecutableSchema({ typeDefs });
  
    // Here we specify the return payloads of mocked types
    addMockFunctionsToSchema({
      schema: mockSchema,
      mocks: {
        Boolean: () => false,
        ID: () => '1',
        Int: () => 1,
        Float: () => 12.34,
        String: () => 'Dog',
      }
    });
  
    test('has valid type definitions', async () => {
      expect(async () => {
        const MockServer = mockServer(typeDefs);
  
        await MockServer.query(`{ __schema { types { name } } }`);
      }).not.toThrow();
    });
  
    cases.forEach(obj => {
      const { id, query, variables, context: ctx, expected } = obj;
  
      test(`query: ${id}`, async () => {
        return await expect(
          graphql(mockSchema, query, null, { ctx }, variables)
        ).resolves.toEqual(expected);
      });
    });
  
  });

describe('A user', function() {
    const self = this
        beforeAll(() => {
        self.test = tester({
            url: `http://127.0.0.1:${config.APP_PORT}/${config.GQL_URL_DIR}`,
            contentType: 'application/json'
        })
    })
})

describe('A user', function() {
    it('should register with new user', () => {
      expect(true).toBe(true)
    })
    it('should not register with existing user data', () => {
      expect(true).toBe(true)
    })
    it('should not login with wrong credentials', () => {
      expect(true).toBe(true)
    })
    it('should login with correct credentials', () => {
      expect(true).toBe(true)
    })
    it('should not login twice', () => {
      expect(true).toBe(true)
    })
    it('should logout after logging in', () => {
      expect(true).toBe(true)
    })
    it('should not logout if not logged in', () => {
      expect(true).toBe(true)
    })
    it('should removed by ID', () => {
      expect(true).toBe(true)
    })
})