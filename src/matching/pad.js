import find from 'lodash/fp/find';

export default (pads, pad) => {
  if (typeof pad === "object") {
    return find({ name: pad.name }, pads);
  }

  const padNumber = pad.match(/LC-([A-Z0-9]+)/);

  if (padNumber) {
    return find(p => p.shortName && p.shortName.match(new RegExp('LC-' + padNumber[1])), pads);
  }

  return find(p =>
    p.name.toLowerCase().includes(pad.toLowerCase()) ||
    p.base.toLowerCase().includes(pad.toLowerCase()) ||
    p.state.toLowerCase().includes(pad.toLowerCase()),
    pads);
};



