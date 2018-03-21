import { similarity, containsInOrder, getSlices, containsSlices } from '../helpers';

describe('similarity', () => {
  test('should be same', () => {
    expect(similarity('hello', 'hello')).toBe(1);
    expect(similarity('hEllo', 'hello')).toBe(1);
    expect(similarity('hello', 'hellox')).toBe(1);
    expect(similarity('hello1', 'hellox1')).toBe(1);
    expect(similarity('12', '12')).toBe(1);
  });

  test('should be different', () => {
    expect(similarity('hello', 'hell')).toBe(0);
    expect(similarity('123456', '12345')).toBe(0);
    expect(similarity('hello12', 'hell12')).toBe(0);
    expect(similarity('117W', '115W')).toBe(0);
    expect(similarity('2A', '3A')).toBe(0);
  });

  test('should be similar', () => {
    expect(similarity('hello world!', 'hell word!')).toBeCloseTo((10/12)**2, 5);
    expect(similarity('spaceship', 'sacehip')).toBeCloseTo((7/9)**2, 5);
  });
});

describe('containsInOrder', () => {
  test('should not work', () => {
    expect(containsInOrder(['a'], ['a', 'b'])).toBe(0);
    expect(containsInOrder(['a'], ['b'])).toBe(0);
    expect(containsInOrder(['a', 'b', 'c', 'd'], ['a', 'c'])).toBe(0);
    expect(containsInOrder(['a', 'b', 'c', 'd'], ['c', 'b'])).toBe(0);
  });

  test('should match', () => {
    expect(containsInOrder(['a'], ['a'])).toBe(1);
    expect(containsInOrder(['a', 'b'], ['a'])).toBe(1);
    expect(containsInOrder(['a', 'b'], ['a', 'b'])).toBe(1);
    expect(containsInOrder(['a', 'b', 'c', 'd'], ['b', 'c'])).toBe(1);
    expect(containsInOrder(['a', 'b', 'c', 'd'], ['c', 'd'])).toBe(1);
    expect(containsInOrder(['hEllo', 'world'], ['hello', 'worldx'])).toBe(1);
  });

  test('should pretty much match', () => {
    expect(containsInOrder(['hello world!', 'spaceship'], ['hell word!', 'sacehip'])).toBeCloseTo((10/12)**2 * (7/9)**2, 5);
  });

  test('should not match mission and number', () => {
    expect(containsInOrder(['a', 'hello', '3', 'b'], ['hello', '4'])).toBe(0);
  });
});

describe('getSlices', () => {
  test('empty', () => {
    expect(getSlices([])).toEqual([
      []
    ]);
  });

  test('one element', () => {
    expect(getSlices(['a'])).toEqual([
      [['a']],
    ]);
  });

  test('two elements', () => {
    expect(getSlices(['a', 'b'])).toEqual([
      [['a', 'b']],
      [['a'], ['b']],
    ]);
  });

  test('three elements', () => {
    expect(getSlices(['a', 'b', 'c'])).toEqual([
      [['a', 'b', 'c']],
      [['a', 'b'], ['c']],
      [['a'], ['b', 'c']],
      [['a'], ['b'], ['c']],
    ]);
  });

  test('mission with number', () => {
    expect(getSlices(['CRS', '12'])).toEqual([
      [['CRS', '12']],
    ]);
  });
});

describe('containsSlices', () => {
  test('empty', () => {
    expect(containsSlices([], [])).toBe(0);
  });

  test('same', () => {
    expect(containsSlices(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(1);
  });

  test('sub set', () => {
    expect(containsSlices(['a', 'b', 'c'], ['b', 'c'])).toBe(1);
  });

  test('one group', () => {
    expect(containsSlices(['a', 'b', 'c'], ['b', 'c', 'd'])).toBe(.8);
  });

  test('two groups', () => {
    expect(containsSlices(['a', 'b', 'c'], ['c', 'b', 'd'])).toBeCloseTo(.67, 2);
  });
});