import levenshtein from 'js-levenshtein';
import concat from 'lodash/fp/concat';
import sum from 'lodash/fp/sum';
import zip from 'lodash/fp/zip';
import last from 'lodash/fp/last';
import head from 'lodash/fp/head';

/**
 * Find a way to split elements in groups where all groups are present in target.
 * @param {array} target
 * @param {array} elements
 * @returns {number} between 0 and 1
 */
export function containsSlices(target, elements) {
  const slices = getSlices(elements);
  let max = 0;

  slices.forEach(groups => {
    // Longer groups have a much bigger weight
    let weights = groups.map(g => g.length**2 / elements.length);

    // Make sure sum of weight is 1
    const s = sum(weights);
    weights = weights.map(w => w / s);

    const weightedGroups = zip(groups, weights);
    let scoreOfSlice = sum(weightedGroups.map(([group, weight]) =>
      weight * containsInOrder(target, group)
    ));

    max = Math.max(max, scoreOfSlice);
  });

  return Math.min(1, max);
}

/**
 * Get all the possible ways to slice an array in pieces.
 * @param {array} elements
 * @returns {array}
 */
export function getSlices(elements) {
  if (!elements.length) {
    return [[]];
  }

  let slices = [];

  // Take all slices that start at the beginning of elements
  for (let i = elements.length; i > 0; --i) {
    // For each way to slice the rest we add this slice in front
    getSlices(elements.slice(i)).forEach(s =>
      slices.push(concat([elements.slice(0, i)], s))
    );
  }

  return slices.filter(slice =>
    // Skip slices with groups of only one element that starts with a number
    !slice.some(group => group.length === 1 && group[0].match(/^\d+/)) &&
    // Skip slices with two consecutive groups where the first ends with launch and the next starts with a number
    !slice.map(group => last(group).match(/^(launch|mission|crs|flight)$/i) && '>' || head(group).match(/^\d+$/) && '<' || '_').join('').includes('><')
  );
}

/**
 * Checks if any slice of target is equal to elements based on the `similarity` function.
 * @param {array} target
 * @param {array} elements
 * @returns {number} between 0 and 1
 */
export function containsInOrder(target, elements) {
  if (elements.length > target.length) {
    return 0;
  }

  let max = 0;

  // Check if elements fits anywhere in target
  for (let i = 0; i <= target.length - elements.length; ++i) {
    let containsAtI = target
      .slice(i, elements.length + i)
      .map((value, j) => similarity(value, elements[j])) // Check similarity of each element
      .reduce((a, b) => a * b, 1); // Multiply each one to have a single ratio

    max = Math.max(max, containsAtI);
  }

  return max;
}

/**
 * Checks how similar 2 strings are.
 * @param {string} str1
 * @param {string} str2
 * @returns {number} between 0 and 1
 */
export function similarity(str1, str2) {
  str1 = str1.trim().toLowerCase();
  str2 = str2.trim().toLowerCase();

  // A number must match a number
  if (str1.match(/^\d+$/) || str2.match(/^\d+$/)) {
    return parseInt(str1) === parseInt(str2) ? 1 : 0;
  }

  let distance = levenshtein(str1, str2);

  // Max length without numbers
  let maxLength = Math.max(
    str1.replace(/\d/g, '').length,
    str2.replace(/\d/g, '').length);

  // Only one "error" in a long word is ok
  if (distance === 1 && maxLength > 5) {
    return 1;
  }

  // Any "error" in a short word is not ok
  if (distance && maxLength <= 5) {
    return 0;
  }

  // Return the ratio squared otherwise
  return Math.max(0, 1 - distance / maxLength)**2;
}