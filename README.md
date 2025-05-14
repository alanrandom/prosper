# Prosper Health Takehome

This project handles the prosper health takehome project to set up a scheduling tool for appointments. It is a next.js project created with
`npx craete-next-app`. I opted to use react-big-calendar for this because I have non-zero experience with that, and it's a calendar component. 
The frontend is initialized in `calendar.tsx` and the component is defined in `components/BigCalendar.tsx`.


## Running and usage
To run the project, run `npm run dev`. This starts the app on `localhost:3000`.

As the data is mocked, the behavior will be fixed in each session, and values will be adjusted in memory instead of being persisted to a DB. I am using the provided `slots.json` as the initial set of `AvailableAppointmentSlot`, 
and integrated that with BigCalendar to let users select these available slots, and it gets altered dynamically. 



### explanation of general flow:

The app will show a big calendar. All the data is from 2024, so unfortunately every time you refresh the page, you will need to scroll back to
August 2024 with the back button on the top left. There is a checkbox for therapist or psychologist, which would reflect if you are choosing 
the availabilities for a therapist or psychologist visit. The mock data is only set up right now to work with the psychologist flow, as the therapist flow
is easier and mocking that data too then setting up the logic to switch dynamically would have taken a bit too long. For a psychologist, you can click on 
any `available` slot on the calendar, which will open a modal for confirmation. When confirming for therapists, it just closes and adds the appointment to 
the therapist. For psychologists, it will prompt you to select a followup time from a dropdown of available followup times, and doing so will add both to
the appointments of the psychologist. 

Everything is in memory, so refreshing the page will undo any changes made in your session. 

### Testing
Just run `npx jest`. This handles all unit testing for the backend functions for all 3 tasks.

