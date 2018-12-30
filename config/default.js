'use strict';

const path = require("path");

module.exports = {
  secure: {
    ssl: true,
    privateKey: '',
    certificate: ''
  },
  port: process.env.PORT || 3002,
  mongoConnectionString :'mongodb://***********/*********',
  PRIVATE_KEY : "Axxxxxxx",
  EMAIL_FROM: "xxxxxx",
  EMAIL_FROM_PASS : "xxxxxxxxxx",
  HOST: process.env.HOST || 'http://localhost:3000',
  AWS: {
      'REGION': '***************',
      'ACCESS_KEY_ID': '***************',
      'SECRET_ACCESS_KEY': '****************'
  },
  AGRI_PROD_BUCKET : '*****************',
  DEALSTICK_CATEGORY_BUCKET : '***************'
  
};
