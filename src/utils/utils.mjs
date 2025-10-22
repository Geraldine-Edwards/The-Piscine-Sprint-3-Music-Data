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
 * Counts the number of occurrences of items in an array, grouped by a key.
 *
 * @param {Array<Object>} events - an array of items to count (e.g. listen events).
 * @param {(item: Object) => string} getKey - a function that returns the key to group by (e.g. song ID or artist).
 * @returns {Object} - an object where keys are returned by `getKey`, and values are teh count of their occurrences.
 *
 * Example output: { a: 3, b: 2, c: 1 }
 */
export function countBy(events, getKey) {
    // set an empty object container
    const count = {}; 
    // loop over each event in events
    for (const event of events) {
        // get the key (e.g., song ID or artist) from the event 
        const key = getKey(event);
        // if the key has been counted before, add 1; if not, start from zero and add 1
        count[key] = (count[key] || 0) + 1;  
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
    let topResult= null; 
    // start highestCount with - infinity, the smallest number possible (setting to 0 may cause logic to break)
    let highestCount = -Infinity;

    // loop over each key in counts
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