import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DGIIR API Documentation',
      version: '1.0.0',
      description: 'API documentation for Delhi Governance Intelligence & Incident Response Platform',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Current server',
      },
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);
console.log(JSON.stringify(specs.servers, null, 2));
