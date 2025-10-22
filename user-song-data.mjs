import { getSong } from "./data.mjs";
import { getUserListenEvents, getMostBy, } from "./src/utils/utils.mjs";



/**
 * Returns a list of questions paired with their corresponding answer functions.
 *
 * @returns {Array<[string, Function]>} - an array of [question, function] tuples.
 *
 * Each function takes a `userID` and returns the answer to the question based on the user's listening data.
 * This structure is used to dynamically generate results for a user.
 */
export function questionsAndAnswerFns() {
  return [
    ["What was the user's most often listened to song",
    getMostOftenSongTitle
    ],
    [
    "What was the user's most often listened to artist?",
    getMostOftenArtist
    ],
    ["What was the user's most often listened to song on Friday nights (between 5pm and 4am)",
    getMostOftenSongFriday
    ],
    [
    "What was the user's most often listened to song by listening time (not number of listens)",
    getMostListenedSongByTime
    ],
    // [
    // "What was the user's most often listened to Artist by listening time (not number of listens)",
    // getMostListenedMinutesArtist
    // ],
    // ["What song did the user listen to the most times in a row (i.e. without any other song being listened to in between)?",
    // getMostConsecutiveSong
    // ],
    // ["How many times was most consecutive song listened to?",
    // getMostConsecutiveSongTimes   
    // ],
    // ["Are there any songs that, on each day the user listened to music, they listened to every day? Which ones(s)",
    // songListenedEveryDay
    // ],
    // ["What were the user's top three genres to listen to by number of listens?",
    // userTopThreeGenres
    // ]
]
};


/**
 * Retrieves the most frequently listened to song for a given user.
 *
 * @param {string} userID - tehe ID of the user.
 * @returns {string} - a formatted string of the artist and song title (e.g., "Artist - Title"),
 *                     or an empty string if no data is available.
 *
 * This function analyzes all listening events, counts frequency by song ID,
 * and returns the song with the highest play count an empty string ("") if there's no countable data.
 */
export function getMostOftenSongTitle(userID) {
    // get all listen events for the user by calling the helper function
    const events = getUserListenEvents(userID);
    if (!events.length) return "";

    // get the song ID with the highest listen count 
    const mostListenedSongID = getMostBy(events, event => event.song_id);

    // retrieve the song details for song ID
    const mostListenedSong = getSong(mostListenedSongID);

    // return the formatted string with artist and title, or an empty string if no song was found
    return mostListenedSong ? `${mostListenedSong.artist} - ${mostListenedSong.title}` : "";
};

/**
 * Retrieves the most frequently listened-to artist for a given user.
 *
 * @param {string} userID - the ID of the user.
 * @returns {string} - the name of the most listened-to artist,
 *                     or an empty string if no data is available.
 *
 * This function counts how often each artist appears in the user's listening history
 * and returns teh artist with the highest count or an empty string ("") if there's no countable data.
 */
export function getMostOftenArtist(userID) { 
    const events = getUserListenEvents(userID)
    if (!events.length) return "";

    // get the artist  with the highest listen count
    const mostListenedArtist = getMostBy(events, event => getSong(event.song_id).artist)
  
    return mostListenedArtist ? mostListenedArtist: "";
};


/**
 *  Retrieves the most frequently listened to song on Firday nights for a given user.
 *
 * @param {string} userID - the ID of the user.
 * @returns {string} - a formatted string of the artist and song title (e.g., "Artist - Title"),
 *                     or an empty string if no data is available.
 *
 * This function retrieves all listening events for the given user,
 * then filters events that occur on a Friday where the time is between 5pm (17*3600) and 4am (4 *3600) the next day (Saturday),
 * then counts frequency of listens by song ID, and retreives the song with the highest frequency,
 * and returns the artist and song title or an empty string ("") if there's no countable data.
 */
export function getMostOftenSongFriday(userID) {
  const events = getUserListenEvents(userID);
  if (!events.length) return "";

  // check for the 'friday night' window
  const filteredEvents = events.filter(event  => {

    // get the timestamp data for an event
    const date = new Date(event.timestamp);

    // get the day from the date using getDay() method
    const day = date.getDay();

    // convert the timestamp to seconds (for total accuracy )
    const seconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();

    // total seconds for Friday 5pm - Midnight = 61200 + 0 + 0 = 61200 seconds.
    if (day === 5 && seconds >= 61200) return true;

    // total seconds for Midnight to Saturday 4am = 14400 + 0 + 0 = 14400 seconds
    if (day === 6 && seconds < 14400) return true

    return false
  });

    // get the song ID with the highest listen count 
    const mostListenedSongFridayID = getMostBy(filteredEvents, event => event.song_id);

    // retrieve the song details for song ID
    const mostListenedSongFriday = getSong(mostListenedSongFridayID);

  return mostListenedSongFriday  ? `${mostListenedSongFriday .artist} - ${mostListenedSongFriday.title}` : "";
}


/**
 * Retrieves the song that a user has listened to for the longest total time.
 *
 * @param {string} userID - the ID of the user whose listening history is being analyzed.
 * @returns {string} - a formatted string of the artist and song title (e.g., "Artist - Title"),
 *                     or an empty string ("") if teh user has no listening data.
 *
 * This function sums the total listening time (duration in seconds, looked up from the song data) for each song
 * for each song in the user's listening history and returns the song with the highest total duration.
 * It uses `getMostBy` to group by song ID and sum the durations.
 */
export function getMostListenedSongByTime(userID) {
  const events = getUserListenEvents(userID);
  if (!events.length) return "";

  // use getMostBy to group events by song_id and sum of total listening time for each song
  const mostListenedSongID = getMostBy(
    events,
    event => event.song_id,
    event => {
      //get the song’s duration using the song id from the event data
      const song = getSong(event.song_id);
    return song ? song.duration_seconds : 0
    });

  // retrieve the song details using song ID and duration
  const getMostListenedSongByTime = getSong(mostListenedSongID);
  
  return getMostListenedSongByTime ? `${getMostListenedSongByTime.artist} - ${getMostListenedSongByTime.title}` : "";

};


/**
 * Retrieves the artist that a user has listened to for the longest total time.
 *
 * @param {string} userID - the ID of the user.
 * @returns {string} - the name of the most listened to artist by total listening time (in minutes),
 *                     or an empty string ("") if no data is available.
 *
 * This function sums the total listening time (in seconds) of each artist based on the user's
 * listening history, and returns the artist with the highest total listening time.
 */