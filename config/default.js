'use strict';

const path = require("path");

module.exports = {
  secure: {
    ssl: true,
    privateKey: '',
    certificate: ''
  },
  port: process.env.PORT || 3002,
  mongoConnectionString :'mongodb://127.0.0.1/agriData',
  PRIVATE_KEY : "Axxxxxxx",
  EMAIL_FROM: "************",
  EMAIL_FROM_PASS : "***********",
  HOST: process.env.HOST || 'http://localhost:3000',
  AWS: {
      'REGION': '***************',
      'ACCESS_KEY_ID': '***************',
      'SECRET_ACCESS_KEY': '****************'
  },
  AGRI_PROD_BUCKET : '*****************',
  DEALSTICK_CATEGORY_BUCKET : '***************',
  S3_ENDPOINT : "https://s3.ap-south-1.amazonaws.com/"
  
};
