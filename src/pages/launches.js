const colors = require('colors');
const DateRange = require('date-range');

const parser = ($) => {
  const launches = [];

  $('.wiki-page-content h4').each((_, h4) => {
    const $title = $(h4);
    const $data = $title.next();
    const $story = $data.next('ul');
    const $name = $data.find('strong a:nth-last-child(2)');
    const links = {};
    const title = $title.text().match(/Flight (\d+)/);

    $data.find('> a, em a').each((_, a) => {
      const $a = $(a);
      links[$a.text().replace(/ *\[PDF] *$/, '')] = $a.attr('href').replace(/^\//, 'https://www.reddit.com/');
    });

    launches.push({
      name: $name.text() || $data.find('strong').text().match(/\[(.+)]/)[1],
      flight: title && title[1] || $title.text(),
      vehicle: $title.prevAll('h3').first().text(),
      date: new DateRange($data.find('strong').text().match(/^[a-z0-9 ]+/i)[0]),
      status: $data.find('strong a').last().text(),
      youtube: $name.attr('href') || null,
      links,
      story: $story.find('li').text().replace("\n", ' '),
    });
  });

  console.log(' Found ' + (launches.length + ' launches').green);

  return Promise.resolve(launches);
};

module.exports = parser;