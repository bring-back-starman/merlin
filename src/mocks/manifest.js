const fakeManifest = [{
  date: '2018 Mar 1 [05:35]',
  vehicle: 'Falcon 9',
  launch_site: 'SLC-40',
  orbit: 'GTO',
  payload_mass: '6092',
  payload: 'Hispasat 30W-6',
  customer: 'Hispasat (Spain)',
  notes: [
    {
      link: 'http://google.com',
    },
  ],
}, {
  date: '2018 Mar 29 [15:19]',
  vehicle: 'Falcon 9 ♺',
  launch_site: 'LC-4E',
  orbit: 'PO',
  payload_mass: '860 (x10)',
  payload: 'Iridium 5 (10 Satellites)',
  customer: 'Iridium Communications',
  notes: [{
    link: 'http://spacex.com',
  }],
}];

module.exports = {
  fakeManifest,
};
