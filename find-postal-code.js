'use strict';

const scraperjs = require('scraperjs'),
      flags = require('flags'),
      prompt = require('prompt');

let url = 'http://www.correos.cl/SitePages/codigo_postal/codigo_postal.aspx?';

let schema = {
  properties: {
    street: {
      description: 'Street',
      type: 'string',
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Street must be only letters, spaces, or dashes',
      required: true
    },
    street_number: {
      description: 'Street number',
      type: 'integer',
      message: 'Street number must be an integer',
      required: true
    },
    commune: {
      description: 'Commune',
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Commune must be only letters, spaces, or dashes',
      required: true
    }
  }
};

let args = process.argv.slice(2);

if(args.length === 0) {
  prompt.start();

  prompt.get(schema, function (err, result) {
    scrape(result.street, result.street_number, result.commune);
  });
} else {
  flags.defineString('street', 'Suecia', 'A street name');
  flags.defineInteger('street_number', 2970, 'A street number');
  flags.defineString('commune', 'Nunoa', 'A valid chilean commune name');

  flags.parse();

  scrape(flags.get('street'), flags.get('street_number'), flags.get('commune'));
}

function scrape(street, street_number, commune) {
  scraperjs.StaticScraper.create(url +
    'calle='+ street + '&' +
    'numero=' + street_number + '&' +
    'comuna=' + commune
  )
  .scrape($ => {
      return $(".tu_codigo span").text();
  })
  .then( postal_code => {
    if(postal_code) {
      console.log(postal_code);
    } else {
      console.log('Postal code not found. Please double check the address and try again.');
    }
  })
  .catch(error => {
    console.error('Error!');
  });
}
