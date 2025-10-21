import { getListenEvents, getSong } from "./data.mjs";

// helper function to get all listen events for a user from the imported function
function getUserListenEvents(userID) {
    return getListenEvents(userID);
}

// helper function to count how many times each value appears in the events array (using the reduce() method),
function countBy(events, getKey) {
    // use a function to get the key (like song ID or artist name),
    return events.reduce((count, event) => {
        const key = getKey(event);
        // if the key has been counted before, add 1; if not, start from zero and add 1
        count[key] = (count[key] || 0) + 1;
        return count;
    }, {});
}

// helper function to get the key with the highest count (like a song ID or artist name)
function getMostListened(counts) {
    // Object.entries(counts) returns an array of [0] the song ID and [1] the song count, in an array itself
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]); // highest to lowest

    // get the key from the first entry in the sorted array (the one with the highest count)
    // if sorted is empty it returns null to avoid causing an error
    return sorted.length >0 ? sorted[0][0]:null;
}

//helper function to render the data response message in a results div
function renderResult(resultDivId, message) {
    const displayDiv = document.getElementById("displayData");
    // clear previous results
    displayDiv.innerHTML = "";
    let resultDiv = document.getElementById("resultDivId");
    //if there is no div, create one
    if (!resultDiv) {
        resultDiv = document.createElement("div");
        resultDiv.id = resultDivId;
        displayDiv.appendChild(resultDiv);
    }  
    resultDiv.innerHTML = message
}


// use an array for all the questions that the rubric wants answered where the answers are generated form their own functions
const questionsAndAnswerFns = [
    ["What was the user's most often listened to song",
    getMostOftenSongTitle
    ],
    [
    "What was the user's most often listened to artist?",
    getMostOftenArtist
    ],
    // ["What was the user's most often listened to song on Friday nights (between 5pm and 4am)",
    // getMostOftenSongFriday
    // ],
    // [
    // "What was the user's most often listened to song by listening time (not number of listens)",
    // getMostListenedMinutesSong
    // ],
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

// helper function to build the table results
function buildResultsTable(results) {
  return `
    <table style="border-collapse: collapse; width: 100%; margin: 1em 0;">
      <caption style="caption-side: top; font-weight: bold; text-align: left; margin-bottom: 0.5em;">
        User Music Data Results
      </caption>
      <thead>
        <tr>
          <th scope="col" style="border: 1px solid #333; padding: 0.5em; background: #f2f2f2;">Question</th>
          <th scope="col" style="border: 1px solid #333; padding: 0.5em; background: #f2f2f2;">Answer</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(([q, a]) => `
          <tr>
            <td style="border: 1px solid #333; padding: 0.5em;">${q}</td>
            <td style="border: 1px solid #333; padding: 0.5em;">${a}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// push the answers from the the functions to a results array and render the table
export function renderAllResults(userID){
    const results = []
    for (const [question, answerFn] of questionsAndAnswerFns) {
      const answer = answerFn(userID);
      if(answer) {
      results.push([question, answer])
      }
    }
    if (results.length > 0){
    const table = buildResultsTable(results);
    renderResult("allResults", table);
    } else {
      renderResult("allResults", "<p>This user hasn't listened to any songs yet.</p>")
    }
}


// function to get the data for the most listened to song title
export function getMostOftenSongTitle(userID) {
    // get all the events via the helper function 
    const events  = getUserListenEvents(userID)

    // use the helper function to count all the listen events per song id
    const songCounts = countBy(events, event => event.song_id);

    // use the helper function to sort the song counts - highest to lowest  
    const mostListenedSongID = getMostListened(songCounts); 

    // identify the song with the highest listen count and render in the browser
    const mostListenedSong = getSong(mostListenedSongID);
 
    // return the song title or leave the question empty
    return mostListenedSong ? mostListenedSong.title : "";
};


export function getMostOftenArtist(userID) { 
    const events = getUserListenEvents(userID)
    const artistCounts = countBy(events, event => getSong(event.song_id).artist)

    const mostListenedArtist = getMostListened(artistCounts); 
  
    return mostListenedArtist ? mostListenedArtist: "";
};
