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
  PRIVATE_KEY : "Agri@321",
  EMAIL_FROM: "oapporg@gmail.com",
  EMAIL_FROM_PASS : "dealstick@123",
  HOST: process.env.HOST || 'http://localhost:3000'


  
};