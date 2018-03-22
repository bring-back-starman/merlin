export const vehicleParser = (value) => {
  if (value.includes('9')) {
    return 'F9';
  }

  if (value.includes('5')) {
    return 'F5';
  }

  if (value.includes('1')) {
    return 'F1';
  }

  if (value.match(/h/i)) {
    return 'FH';
  }
};

export const altitudeParser = (altitude) => {
  if (altitude === 'N/A') {
    return null;
  }

  altitude = altitude.replace(/[^0-9>-]/g, '');

  if (altitude.match(/^\d+$/)) {
    return { min: parseInt(altitude), max: parseInt(altitude) };
  }

  if (altitude.match(/^\d+-\d+$/)) {
    const [min, max] = altitude.split('-').map(a => parseInt(a));
    return { min, max };
  }

  if (altitude.match(/^>\d+$/)) {
    return { min: parseInt(altitude.substr(1)), max: null };
  }

  return null;
};

export const yesNoParser = (value) => {
  if (value.match(/yes/i)) {
    return true;
  }

  if (value.match(/no/i)) {
    return false;
  }

  return null;
};