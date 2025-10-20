import { getUserIDs } from './data.mjs';


export function createUserDropdown () {
    // get the user Ids array
    const userIds = getUserIDs();

    // create the dropdown elements
    const userSelection = document.getElementById("userSelect");

    const defaultOption = document.createElement("option");
    defaultOption.value = ""
    defaultOption.text = "--Please select a user--";
    userSelect.appendChild(defaultOption);
    
    // iterate through each user ID and create an option element for it
    userIds.forEach((userId) => {
        const userOption = document.createElement("option");
        userOption.value = userId;
        userOption.text = `User ${userId}`;
        userSelect.appendChild(userOption);
    });
}

createUserDropdown()
