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
  EMAIL_FROM: "xxxxxx",
  EMAIL_FROM_PASS : "xxxxxxxxxx",
  HOST: process.env.HOST || 'http://localhost:3000',
  AWS: {
      'REGION': 'ap-south-1a',
      'ACCESS_KEY_ID': 'AKIAJ6BV23VQ5VVUWPIA',
      'SECRET_ACCESS_KEY': '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'
  },
  AGRI_PROD_BUCKET : 'devdealstick-agriproduct',
  DEALSTICK_CATEGORY_BUCKET : 'devdealstick-category'


  
};
