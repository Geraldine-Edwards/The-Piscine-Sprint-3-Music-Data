import { getListenEvents } from "../../data.mjs";


/**
 * Retrieves all listening events for a given user ID.
 *
 * @param {string} userID - teh ID of the user whose listening events are requested.
 * @returns {Array<Object>} - an array of listen event objects for the user, or an empty array if none are found.
 *
 * This function wraps the imported `getListenEvents` function and ensures a consistent return type using [].
 */
export function getUserListenEvents(userID) {
    return getListenEvents(userID) || [];
}


/**
 * Counts the number of occurrences of items in an array, grouped by a key (artist or song ID).
 *
 * @param {Array<Object>} events - an array of items to count (e.g. listen events).
 * @param {(item: Object) => string} getKey - a function that returns the key to group by (e.g., song ID or artist).
 * @param {(item: Object) => number} [getValue=() => 1] - a function that returns the value to sum for each key (e.g., duration). 
 *  - defaults to `1` for simple counting. 
 * @returns {Object} - an object where keys are returned by `getKey`, and values are the sum counts or values
 *
 * Example:
 * Input: [{ song: 'a' }, { song: 'b' }, { song: 'a' }]
 * getKey: event => event.song
 * Output: { a: 2, b: 1 }
 */
export function countBy(events, getKey, getValue = () => 1) {
    // set an empty object container
    const count = {}; 
    
    for (const event of events) {
        const key = getKey(event);
        const value = getValue(event);

        // if the key (song or artist) has been counted before, add the value to it
        //  if not, start with the value
        count[key] = (count[key] || 0) + value;  
    }
    return count;
}


/**
 * Determines the key with the highest count from a count object.
 *
 * @param {Object} counts - an object with keys and numeric values (e.g., { song1: 3, song2: 5 }).
 * @returns {string|null} - tehe key with the highest value, or `null` if input is empty.
 *
 * This is used for identifying the most listened-to song or artist.
 */
export function getMostListened(counts) {
    let topResult = null; 
    // start highestCount with - infinity, the smallest number possible (setting to 0 may cause logic to break)
    let highestCount = -Infinity;

    for (const key in counts) {
      // if the count for the current key is greater than highestCount
      if (counts[key] > highestCount) {
        //update both highestCount and topResult 
        highestCount = counts[key];
        topResult = key;
      }
    }

  return topResult;
}

/**
 * Finds the key (e.g., song ID, artist) with the highest count or total value.
 *
 * @param {Array<Object>} events - An array of events to analyze.
 * @param {(item: Object) => string} getKey - Function to extract the key (e.g., song ID).
 * @param {(item: Object) => number} [getValue=() => 1] - Function to extract the value to sum (e.g., duration). Defaults to 1 for counting.
 * @returns {string|null} - The key with the highest value, or null if none found.
 */
export function getMostBy(events, getKey, getValue = () => 1) {

  // return the highest value (either a duration or count)
  const counts = countBy(events, getKey, getValue);
  return getMostListened(counts);
}