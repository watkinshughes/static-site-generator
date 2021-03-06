'use strict';
const fs = require('fs');
const fetch = require('fetch-static-data');
const config = require('../../config.js');
const length = config.endpoints.length;

module.exports = function fetchData(callback) {
  const locals = {};
  let count = 0;
  function saveData() {
    count++;
    if (count === length) {
      const file = `${config.data}locals.json`;
      const data = JSON.stringify(locals, null, ' ');
      fs.writeFile(file, data, (error)=> {
        if (error) throw error;
        console.log(`compiled data saved to ${file}`);
        if (callback) {
          callback();
        }
      });
    }
  }
  config.endpoints.forEach((endpoint)=> {
    fetch({
      api: config.api,
      format: 'json',
      endpoint
    }, (data)=> {
      locals[endpoint] = JSON.parse(data);
      saveData();
    });
  });
};
