#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const API_BASE = 'https://backend.postsiva.com';
const CREDENTIALS = {
  email: 'test@gmail.com',
  password: '123123123'
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testAPI() {
  console.log('🚀 Testing PostSiva API...\n');
  
  try {
    // 1. Test authentication
    console.log('1. Testing Authentication...');
    const loginResponse = await makeRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(CREDENTIALS)
    });
    
    console.log(`Login Status: ${loginResponse.status}`);
    console.log('Login Response:', JSON.stringify(loginResponse.data, null, 2));
    
    if (loginResponse.status !== 200) {
      console.log('❌ Authentication failed. Trying alternative endpoints...\n');
      
      // Try different auth endpoints
      const altEndpoints = ['/api/auth/login', '/v1/auth/login', '/login'];
      for (const endpoint of altEndpoints) {
        console.log(`Trying: ${API_BASE}${endpoint}`);
        const altResponse = await makeRequest(`${API_BASE}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(CREDENTIALS)
        });
        console.log(`Status: ${altResponse.status}`);
        if (altResponse.status === 200) {
          console.log('✅ Found working auth endpoint!');
          break;
        }
      }
    }
    
    // 2. Try to get OpenAPI schema
    console.log('\n2. Fetching OpenAPI Schema...');
    const schemaEndpoints = [
      '/docs/openapi.json',
      '/openapi.json',
      '/api-docs/openapi.json',
      '/swagger.json',
      '/docs/swagger.json'
    ];
    
    for (const endpoint of schemaEndpoints) {
      console.log(`Trying: ${API_BASE}${endpoint}`);
      const schemaResponse = await makeRequest(`${API_BASE}${endpoint}`);
      console.log(`Status: ${schemaResponse.status}`);
      
      if (schemaResponse.status === 200 && typeof schemaResponse.data === 'object') {
        console.log('✅ Found OpenAPI schema!');
        fs.writeFileSync('./openapi-schema.json', JSON.stringify(schemaResponse.data, null, 2));
        console.log('📁 Schema saved to openapi-schema.json');
        
        // Extract endpoints
        if (schemaResponse.data.paths) {
          console.log('\n📋 Available Endpoints:');
          Object.keys(schemaResponse.data.paths).forEach(path => {
            const methods = Object.keys(schemaResponse.data.paths[path]);
            console.log(`  ${path} [${methods.join(', ').toUpperCase()}]`);
          });
        }
        break;
      }
    }
    
    // 3. Test common endpoints without auth
    console.log('\n3. Testing Common Endpoints...');
    const testEndpoints = [
      '/health',
      '/api/health',
      '/status',
      '/ping',
      '/users',
      '/posts',
      '/api/users',
      '/api/posts'
    ];
    
    for (const endpoint of testEndpoints) {
      try {
        const response = await makeRequest(`${API_BASE}${endpoint}`);
        console.log(`${endpoint}: ${response.status}`);
        if (response.status === 200) {
          console.log(`  ✅ ${endpoint} is accessible`);
        }
      } catch (error) {
        console.log(`${endpoint}: Error - ${error.message}`);
      }
    }
    
    // 4. Check documentation page
    console.log('\n4. Checking Documentation...');
    const docsResponse = await makeRequest(`${API_BASE}/docs`);
    console.log(`Docs Status: ${docsResponse.status}`);
    
    if (typeof docsResponse.data === 'string' && docsResponse.data.includes('swagger')) {
      console.log('✅ Swagger documentation detected');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

// Run the test
testAPI().then(() => {
  console.log('\n🏁 API testing completed!');
}).catch(console.error);
