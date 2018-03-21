import { vehicleParser } from '../parser/helpers';

const colors = require('colors');
const DateRange = require('date-range');

const parser = ($) => {
  const launches = [];

  $('.wiki-page-content h4').each((_, h4) => {
    const $title = $(h4);
    const $data = $title.next();
    const $story = $data.next('ul');
    const $name = $data.find('strong a:nth-last-child(2)');
    const links = [];
    const title = $title.text().match(/Flight (\d+)/);

    $data.find('> a, em a').each((_, a) => {
      const $a = $(a);
      links.push({ name: $a.text().replace(/ *\[PDF] *$/, ''), url: $a.attr('href').replace(/^\//, 'https://www.reddit.com/') });
    });

    launches.push({
      name: ($name.text() || $data.find('strong').text().match(/\[(.+)]/)[1]).replace(/^flight \d+ . /i, ''),
      launchNumber: title && parseInt(title[1]) || null,
      vehicle: vehicleParser($title.prevAll('h3').first().text()),
      date: new DateRange($data.find('strong').text().match(/^[a-z0-9 ]+/i)[0]),
      outcome: $data.find('strong a').last().text(),
      launchVideo: $name.attr('href') || null,
      links,
      description: $story.find('li').text().replace("\n", ' '),
    });
  });

  console.log(' Found ' + (launches.length + ' launches').green);

  return Promise.resolve(launches);
};

module.exports = parser;