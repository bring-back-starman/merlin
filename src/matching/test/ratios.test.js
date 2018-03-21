import { vehicleRatio, missionNumberRatio, launchNumberRatio, nameRatio, dateRatio, iridiumData } from '../ratios';

const m = (field, v1, v2) => [{ [field]: v1 }, { [field]: v2 }];

test('vehicleRatio', () => {
  expect(vehicleRatio(...m('vehicle', 'F9', 'FH'))).toBe(0);
  expect(vehicleRatio(...m('vehicle', 'F9', 'F9'))).toBe(1);
  expect(vehicleRatio(...m('vehicle', 'F9', null))).toBe(.5);
});

test('missionNumberRatio', () => {
  expect(missionNumberRatio(...m('missionNumber', '4', '6'))).toBe(0);
  expect(missionNumberRatio(...m('missionNumber', '8', '8'))).toBe(1);
  expect(missionNumberRatio(...m('missionNumber', '3', null))).toBe(.5);
});

test('launchNumberRatio', () => {
  expect(launchNumberRatio(...m('launchNumber', '2', '3'))).toBe(0);
  expect(launchNumberRatio(...m('launchNumber', '4', '4'))).toBe(1);
  expect(launchNumberRatio(...m('launchNumber', '5', null))).toBe(.5);
});

describe('dateRatio', () => {
  test('one null', () => {
    expect(dateRatio(...m('date', '2030', null))).toBe(.5);
  });

  test('same', () => {
    expect(dateRatio(...m('date', '10 Apr 2030 15:16', '10 Apr 2030 15:16'))).toBe(1);
    expect(dateRatio(...m('date', '10 Apr 2030', '10 Apr 2030'))).toBe(1);
    expect(dateRatio(...m('date', 'Apr 2030', 'Apr 2030'))).toBe(1);
    expect(dateRatio(...m('date', 'Q3 2030', 'Q3 2030'))).toBe(1);
    expect(dateRatio(...m('date', 'H1 2030', 'H1 2030'))).toBe(1);
    expect(dateRatio(...m('date', '2030', '2030'))).toBe(1);
  });

  test('different', () => {
    expect(dateRatio(...m('date', '2030', '2031'))).toBeCloseTo(1 / 3, 1);
    expect(dateRatio(...m('date', 'H1 2030', 'H2 2029'))).toBeCloseTo(1 / 3, 1);
    expect(dateRatio(...m('date', 'Q4 2030', 'Q1 2031'))).toBeCloseTo(1 / 3, 1);

    expect(dateRatio(...m('date', 'Apr 2030', 'Feb 2030'))).toBeCloseTo(1 / 3, 1);
    expect(dateRatio(...m('date', 'Apr 2030', 'March 2030'))).toBeCloseTo(2 / 3, 1);

    expect(dateRatio(...m('date', '10 Apr 2030', '12 Apr 2030'))).toBeCloseTo(5 / 7, 1);
    expect(dateRatio(...m('date', '3 Jan 2030', '28 Dec 2029'))).toBeCloseTo(1 / 7, 1);

    expect(dateRatio(...m('date', '10 Apr 2030 16:10', '10 Apr 2030 18:10'))).toBeCloseTo(46 / 48, 1);
    expect(dateRatio(...m('date', '10 Apr 2030 03:00', '8 Apr 2030 20:00'))).toBeCloseTo(17 / 48, 1);
  });

  test('past', () => {
    expect(dateRatio(...m('date', '10 Jan 2018', '10 Jan 2018'))).toBe(1);
    expect(dateRatio(...m('date', '10 Jan 2018 15:30', '10 Jan 2018'))).toBe(1);
    expect(dateRatio(...m('date', '10 Jan 2018', '11 Jan 2018'))).toBe(0);
  });

  test('hour in day', () => {
    expect(dateRatio(...m('date', '12 May 2030', '12 May 2030 16:30'))).toBe(1);
  });

  test('hour next to day', () => {
    expect(dateRatio(...m('date', '12 May 2030', '13 May 2030 01:00'))).toBeCloseTo(23 / 24, 5);
    expect(dateRatio(...m('date', '12 May 2030', '11 May 2030 18:00'))).toBeCloseTo(18 / 24, 2);
  });

  test('day in month', () => {
    expect(dateRatio(...m('date', 'May 2030', '12 May 2030'))).toBe(.95);
    expect(dateRatio(...m('date', 'May 2030', '12 May 2030 16:30'))).toBe(.95);
    expect(dateRatio(...m('date', 'May 2030', '1 Jun 2030'))).toBe(.95);
    expect(dateRatio(...m('date', 'May 2030', '30 Apr 2030'))).toBe(.95);
  });

  test('day next to month', () => {
    expect(dateRatio(...m('date', 'May 2030', '6 Jun 2030'))).toBeCloseTo(.95 * 2 / 7, 5);
    expect(dateRatio(...m('date', 'May 2030', '29 Apr 2030'))).toBeCloseTo(.95 * 6 / 7, 5);
  });
});

test('iridiumData', () => {
  expect(iridiumData('Iridium NEXT Flight 5 (41 - 50)')).toEqual({flight: 5, range: [41, 50], satellites: 10});
  expect(iridiumData('Iridium 5 (10 Satellites)')).toEqual({flight: 5, range: [41, 50], satellites: 10});
  expect(iridiumData('Iridium Next 41-50')).toEqual({flight: 5, range: [41, 50], satellites: 10});
  expect(iridiumData('Iridium NEXT Constellation Mission 5')).toEqual({flight: 5, range: [41, 50], satellites: 10});

  expect(iridiumData('Iridium 6 (5 Satellites) / GRACE-FO 1-2')).toEqual({flight: 6, range: [51, 55], satellites: 5});
  expect(iridiumData('Iridium Next 51-55 & GRACE Follow-On')).toEqual({flight: 6, range: [51, 55], satellites: 5});

  expect(iridiumData('Iridium NEXT Flight 2 (10 sats)')).toEqual({flight: 2, range: [11, 20], satellites: 10});
});

const examples = [
  ['Iridium 5 (10 Satellites)', 'Iridium NEXT Flight 5 (41 - 50)', 'Iridium Next 41-50', 'Iridium NEXT Constellation Mission 5'],
  ['CRS-14', 'SpX CRS-14 & MISSE-FF, PFCS, ASIM', 'SpaceX CRS 14'],
  ['Bangabandhu-1', 'Bangabandhu 1'],
  ['Transiting Exoplanet Survey Satellite', 'TESS'],
  ['Iridium 6 (5 Satellites) / GRACE-FO 1-2', 'Iridium Next 51-55 & GRACE Follow-On'],
  ['SES-12', 'SES 12'],
  ['Telkom-4', 'Telkom 4'],
  ['SpX CRS-15 & ECOSTRESS', 'SpaceX CRS 15'],
  ['STP-2 (DCX, & 34 others)',],
  ['Telstar 19V',],
  ['Telstar 18V (APStar 5C)',],
  ['Iridium 7 (10 Satellites)',],
  ['Iridium 8 (10 Satellites)',],
  ['SSO-A',],
  ['CCtCap Demo Mission 1 (DM-1) (uncrewed)', 'Crew Dragon Demo 1'],
  ['RADARSAT C-1, C-2, C-3',],
  ['GPS IIIA-1', 'GPS 3-01'],
  ['SAOCOM 1A',],
  ['GTO-1',],
  ['PSN-6',],
  ['ArabSat 6A',],
  ['SpX CRS-16 & IDA-3',],
  ['Crew Dragon In Flight Abort Test',],
  ['Es’hail 2',],
  ['CCtCap Demo Mission 2 (DM-2) (crewed)', 'Crew Dragon Demo 2'],
  ['SpX CRS-17 & OCO 3, STP-H6',],
  ['GPS IIIA-2',],
  ['SAOCOM 1B',],
  ['SSO-B',],
  ['USCV-1 (NASA Crew Flight 1)',],
  ['SpX CRS-18 & GEDI',],
  ['Amos-17',],
  ['SpX CRS-19 & Bartolomeo, CEPHFISS',],
  ['SSO-C',],
  ['JCSat 18 / Kacific 1', 'Kacific 1 JCSat 18'],
  ['4G Lunar Network',],
  ['GTO-2',],
  ['GiSAT-1',],
  ['SXM-7',],
  ['SARah 1',],
  ['SARah 2/3',],
  ['GPS IIIA-4',],
  ['GPS IIIA-5',],
  ['SpX CRS-20 & GEROS',],
  ['USCV-3 (NASA Crew Flight 2)',],
  ['GPS IIIA-6',],
  ['SSO-D',],
  ['GTO-C',],
  ['Sentinel-6A',],
  ['KPLO (Korea Pathfinder Lunar Orbiter)', 'KPLO', 'Korea Pathfinder Lunar Orbiter'],
  ['Amos-8',],
  ['Turksat 5A',],
  ['ViaSat-3',],
  ['SXM-8',],
  ['CRS-21',],
  ['CRS-22',],
  ['CRS-23',],
  ['CRS-24',],
  ['USCV-5 (NASA Crew Flight 3)',],
  ['SWOT (Surface Water & Ocean Topography)', 'SWOT', 'Surface Water & Ocean Topography'],
  ['Turksat 5B',],
  ['WorldView Legion constellation 1',],
  ['WorldView Legion constellation 2',],
  ['CRS-25',],
  ['CRS-26',],
  ['CRS-27',],
  ['USCV-7 (NASA Crew Flight 4)',],
  ['CRS-28',],
  ['CRS-29',],
  ['CRS-30',],
  ['USCV-9 (NASA Crew Flight 5)',],
  ['CRS-31',],
  ['CRS-32',],
  ['CRS-33',],
  ['USCV-11 (NASA Crew Flight 6)',],
  ['Inmarsat I-6 F2 ?',],
  ['Hispasat 30W-6', 'Hispasat 30W-6'],
  ['Paz / Starlink', 'Paz / Starlink prototype satellites (Microsat-2a, Microsat-2b)', 'Paz & Microsat-2a, -2b'],
  ['GovSat-1 (SES-16)', 'GovSat-1'],
  ['Zuma',],
  ['Iridium NEXT Flight 4 (10 sats)', 'Iridium 4 (10 Satellites)'],
  ['CRS-13', 'SpX CRS-13 & SDS, TSIS'],
  ['Koreasat 5A',],
  ['SES-11/Echostar 105', 'SES-11 (EchoStar 105)'],
  ['Iridium NEXT Flight 3 (10 sats)', 'Iridium 3 (10 Satellites)',],
  ['X-37B OTV-5',],
  ['FORMOSAT-5', 'FORMOSAT 5'],
  ['CRS-12', 'SpX CRS-12 & CREAM, ELaNa XXII'],
  ['Intelsat 35e',],
  ['Iridium NEXT Flight 2 (10 sats)', 'Iridium 2 (10 Satellites)'],
  ['BulgariaSat-1',],
  ['CRS-11', 'SpX CRS-11 & ROSA, MUSES, NICER'],
  ['Inmarsat-5 F4', 'Inmarsat 5-F4'],
  ['NROL-76',],
  ['SES-10', 'SES-10'],
  ['Echostar 23',],
  ['CRS-10', 'SpX CRS-10 & STP-H5, SAGE III, SAGE NVP'],
  ['Iridium NEXT Flight 1 (10 sats)', 'Iridium 1 (10 Satellites)'],
  ['Amos-6',],
  ['JCSAT-16',],
  ['CRS-9', 'SpX CRS-9 & IDA-2'],
  ['Eutelsat 117W B & ABS 2A', 'ABS 2A / Eutelsat 117W B (Satmex9)'],
  ['Thaicom 8',],
  ['JCSAT-14',],
  ['CRS-8', 'SpX CRS-8 & BEAM'],
  ['SES-9',],
  ['Jason 3', 'Jason-3'],
  ['Orbcomm OG2 Launch 2', 'OG2 Launch 2 (11 OG2 sats)'],
  ['CRS-7', 'SpX CRS-7'],
  ['TurkmenÄlem 52E', 'TurkmenÄlem 52E (MonacoSat)'],
  ['CRS-6', 'SpX CRS-6'],
  ['Eutelsat 115W B & ABS-3A', 'Eutelsat 115W B & ABS-3A'],
  ['DSCOVR',],
  ['CRS-5', 'SpX CRS-5'],
  ['CRS-4', 'SpX CRS-4'],
  ['AsiaSat 6',],
  ['AsiaSat 8',],
  ['Orbcomm OG2 Launch 1', 'OG2 Launch 1 (6 OG2 sats)'],
  ['CRS-3', 'SpX CRS-3'],
  ['Thaicom 6', 'Thaicom 6 (AfriCom 1)'],
  ['SES-8',],
  ['CASSIOPE',],
  ['CRS-2', 'SpX CRS-2'],
  ['CRS-1', 'SpX CRS-1 & OG2 demo'],
  ['COTS 2',],
  ['COTS 1',],
  ['RazakSat',],
  ['RatSat',],
  ['Trailblazer / PRESat / NanoSail-D / Explorers',],
  ['DemoSat',],
  ['FalconSat',],
];

describe('nameRatio', () => {
  test('same', () => {
    expect(nameRatio(...m('name', 'hello', 'Hello'))).toBe(1);
    expect(nameRatio(...m('name', 'Telkom-4', 'Tekom-4'))).toBe(1);
    expect(nameRatio(...m('name', 'CRS-3', 'CRS 3'))).toBe(1);
  });

  test('acronym', () => {
    expect(nameRatio(...m('name', 'SWOT', 'Surface Water & Ocean Topography'))).toBe(1);
  });

  test('different number', () => {
    expect(nameRatio(...m('name', 'Telkom-4', 'Telkom-5'))).toBe(0);
    expect(nameRatio(...m('name', 'SES 12', 'SES 11'))).toBe(0);
  });

  describe('similar names', () => {
    for (let i = 0; i < examples.length; ++i) {
      examples[i].forEach((example) => {
        examples[i].forEach((other) => {
          if (example !== other) {
            test(example + ' === ' + other, () => {
              expect(nameRatio(...m('name', example, other))).toBeGreaterThan(.85);
            });
          }
        });
      });
    }
  });

  describe('different names', () => {
    for (let i = 0; i < examples.length; ++i) {
      examples[i].forEach((example) => {
        for (let j = i + 1; j < examples.length; ++j) {
          examples[j].forEach((other) => {
            test(example + ' !== ' + other, () => {
              expect(nameRatio(...m('name', example, other))).toBeLessThan(.6);
            });
          });
        }
      });
    }
  });
});

