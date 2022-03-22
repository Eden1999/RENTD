
const splitAvailabilities = (openingDays, openingHours, capacity, workspaceid) => {
    let availabilities = []

    // create generic availabilities for a day
    for(let i = openingHours.start; i < openingHours.end; i++) {
        let availability = {
            available: false,
            capacity,
            workspaceid,
            startHour: i,
            endHour: i+1,
        }

        availabilities.push(availability)
    }

    openingDays.forEach((isOpen, index) => {
        if (isOpen) {
            
        }
    })

    return availabilities
}

module.exports = {

}
  