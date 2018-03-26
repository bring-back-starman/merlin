import colors from 'colors';
import get from 'lodash/fp/get';
import { getTimeZone } from '../geo/timeZone';

export default async ($) => {
  const pads = [];
  const $titles = [];

  $('h3').each((_, h3) => {
    $titles.push($(h3));
  });

  for (let $title of $titles) {
    const [base, state, country] = $title.text().split(',').map(s => s.trim());

    let $padTitle = $title.next();

    while(get('[0].name', $padTitle) === 'p') {
      const description = $padTitle.next().find('li').text();

      const $status = $padTitle.find('[href=#red],[href=#green]');
      const status = $status.text();

      let $location = $padTitle.find('[href^="https://www.google.com/maps"]');
      const location = $location
        .attr('href')
        .match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
        .slice(1);

      $status.remove();
      $location.remove();
      const name = $padTitle.find('a').text() || base;

      const timeZone = await getTimeZone(location.join(','));

      const shortName = get(1, $padTitle.text().match(/\((.+)\)/)) || null;

      pads.push({
        name,
        shortName,
        base,
        state,
        country,
        status,
        location,
        timeZone,
        description,
      });

      $padTitle = $padTitle.next().next();
    }
  }

  console.log(' Found ' + (pads.length + ' pads').green);

  return Promise.resolve(pads);
};