import { getUserIDs } from './data.mjs';


export function createUserDropdown () {
    // create the dropdown elements
    const userSelection = document.getElementById("userSelect");

    const defaultOption = document.createElement("option");
    defaultOption.value = ""
    defaultOption.text = "--Please select a user--";
    userSelect.appendChild(defaultOption);
    

    // get the user Ids array
    const userIds = getUserIDs();

    // iterate through each user ID and create an option element for it
    userIds.forEach((userID) => {
        const userOption = document.createElement("option");
        userOption.value = userID;
        userOption.text = `User ${userID}`;
        userSelect.appendChild(userOption);
    });
}

