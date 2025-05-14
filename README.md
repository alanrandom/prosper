# Prosper Health Takehome

This project handles the prosper health takehome project to set up a scheduling tool for appointments. It is a next.js project created with
`npx craete-next-app`. I opted to use react-big-calendar for this because I have non-zero experience with that, and it's a calendar component. 
The frontend is initialized in `calendar.tsx` and the component is defined in `components/BigCalendar.tsx`.


## Running and usage
To run the project, run `npm run dev`. 

As the data is mocked, the behavior will be fixed in each session, and values will be adjusted in memory instead of being persisted to a DB. I am using the provided `slots.json` as the initial set of `AvailableAppointmentSlot`, 
and integrated that with BigCalendar to let users select these available slots, and it gets altered dynamically. 

### Testing
Just run `npx jest`. This handles all unit testing for the backend functions for all 3 tasks.

