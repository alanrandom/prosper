'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import { MOCK_SLOT_DATA } from './models/mock-slot-data';
import { AssessmentSlot, MOCK_ASSESSMENT_SLOTS } from './models/assessment-slot';
import { psychologist, psychologist2, therapist } from './models/mock-clinician';
import styles from './EventModal.module.css';
import { patient } from './models/mock-patient';
import { Appointment, AvailableAppointmentSlot } from './models/appointment';
import Dropdown from './dropdown';
import { getPsychologistSlots } from './utils/assessment-slots';
import DatePicker from './dropdown';
import DateDropdown from './dropdown';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type EventType = {
  title: string,
  start: Date,
  end: Date,
  id: string;
  clinicianId: string;
  clinicianName: string;
  length: number;
  createdAt: Date;
  updatedAt: Date;
}

//defaults that are configurable like user or day offset.
const user = patient;
const doctors = [psychologist2, therapist];


function eventToAvailSlot(event: EventType | null): AvailableAppointmentSlot | null {
  if (!event) {
    return null
  } else {
    return {
      id: event.id,
      clinicianId: event.clinicianId,
      date: event.start,
      length: event.length,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }
  }
}

// Transformer to get mock dummy data set in psychologists into a usable state for the project.
function startToEvent(slot: Date): EventType {
  const minutesMultiplier = 60 * 1000

  return {
    title: "available",
    start: new Date(slot.getTime()),
    end: new Date(slot.getTime() + 90 * minutesMultiplier),
    id: "randomId",
    clinicianId: ( //arbitrary setting of clinicians. Of course we would just get this data from the DB normally.
      slot.getMinutes() == 15 || slot.getMinutes() == 45 
      ? therapist.id 
      : psychologist2.id
    ),
    clinicianName: (
      slot.getMinutes() == 15 || slot.getMinutes() == 45 
      ? therapist.firstName 
      : psychologist2.firstName
    ),
    length: 90,
    createdAt: slot,
    updatedAt: slot,
  }
}


export default function MyCalendar() {
  const [checked, setChecked] = useState<boolean>(true); //true means therapist
  const [events, setEvents] = useState<EventType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [selectedFollowup, setSelectedFollowup] = useState<Date | null>(null);
  const [followupOptions, setFollowupOptions] = useState<Date[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  useEffect(() => {
      async function loadEvents() {
        // Normally would load from the availableSlots DB.
          const availableSlots = getPsychologistSlots(psychologist2.availableSlots, psychologist2, true)
          const uniqueStartsOnly = Array.from(new Set(availableSlots.map((dates) => dates[0])))
          const starts = uniqueStartsOnly.map((date) => startToEvent(date))
          setEvents(starts)
      }

      loadEvents()
  }, [])
  
  // Clicking an existing event.
  const handleEventClick = async (event: EventType) => {
      setShowModal(true);
      setSelectedEvent(event);
  };

  const closeModal = () => {
      setShowModal(false);
      setShowSecondModal(false);
      setSelectedEvent(null);
      setSelectedFollowup(null);
  }

  // Select an existing slot and try to book appointment.
  const handleSave = async (selectedSlot: EventType) => {
    // Normally after we select a slot, we would want to retrieve all clinicians associated with the slot, run our availability code from task 1 on them 
    // (keeping in mind the selected first slot), and combine all the results. 
    // Something like newSlots = AvailableAppointmentSlotDB.get().where(start = slot.date, clinician_type = checked ? "THERAPIST" : "PSYCHOLOGIST")

    if (checked) {
      // Therapist path is the easy one.
      const now = new Date(Date.now())
      const newAppointment: Appointment = {
        id: "newAptId",
        patientId: patient.id,
        clinicianId: therapist.id,
        scheduledFor: selectedSlot.start,
        appointmentType: "THERAPY_INTAKE",
        status: "UPCOMING",
        createdAt: now,
        updatedAt: now,
      }
      therapist.appointments = [...therapist.appointments, newAppointment]
      closeModal()

    } else {
      //Psychologist path is a bit harder. Need to schedule followup and append 2 appointments. We will do that on separate modal.
      const psychologistOptions = getPsychologistSlots(psychologist2.availableSlots, psychologist2, true, eventToAvailSlot(selectedEvent))
      const followupOptions = psychologistOptions.map((slot) => slot[1])
      setFollowupOptions(followupOptions)
      setShowSecondModal(true);
    }
  };

  const handleSaveFollowup = async (followup: Date | null) => {
    console.log("huh why broken")
    console.log(followup)
    const now = new Date(Date.now())
    const newAppointment: Appointment = {
      id: "newAptId",
      patientId: patient.id,
      clinicianId: psychologist2.id,
      scheduledFor: selectedEvent?.start || now,
      appointmentType: "THERAPY_INTAKE",
      status: "UPCOMING",
      createdAt: now,
      updatedAt: now,
    }
    const secondAppointment: Appointment = {
      id: "newAptId",
      patientId: patient.id,
      clinicianId: psychologist2.id,
      scheduledFor: followup || now,
      appointmentType: "THERAPY_INTAKE",
      status: "UPCOMING",
      createdAt: now,
      updatedAt: now,
    }
    psychologist2.appointments = [...psychologist2.appointments, newAppointment, secondAppointment]
    psychologist2.availableSlots = psychologist2.availableSlots.filter((slot) => slot.date != followup && slot.date != selectedEvent?.start)
    const availableSlots = getPsychologistSlots(psychologist2.availableSlots, psychologist2, true)
    const uniqueStartsOnly = Array.from(new Set(availableSlots.map((dates) => dates[0])))
    const starts = uniqueStartsOnly.map((date) => startToEvent(date))
    setEvents(starts)
    closeModal()
  }

  return (
    <div style={{ height: '80vh', padding: '2rem' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      therapist
      <input
        type="checkbox"
        checked={!checked}
        onChange={(e) => setChecked(!e.target.checked)}
      />
      psychologist
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectEvent={(event) => handleEventClick(event)}
        style={{ height: '100%' }}
    />
    {/* Popup modal for when a thing is selected. */}
    {showModal && selectedEvent && (
      <div className={styles.backdrop}>
        <div className={styles.modal}>
          <h2>Confirm: </h2>

          <label>{selectedEvent.start.toDateString()} {selectedEvent.start.getHours().toString().padStart(2, '0')}:{selectedEvent.start.getMinutes().toString().padStart(2, '0')} </label>
          <div/>
          to 
          <div/>
          <label>{selectedEvent.end.toDateString()} {selectedEvent.end.getHours().toString().padStart(2, '0')}:{selectedEvent.end.getMinutes().toString().padStart(2, '0')}</label>

          <div className="modal-buttons">
              <button onClick={() => handleSave(selectedEvent)}>Confirm</button>
              <button onClick={() => closeModal()}>Cancel</button>
          </div>
        
          </div>
      </div>
    )}
    {showModal && showSecondModal && selectedEvent && (
      <div className={styles.backdrop}>
        <div className={styles.modal}>
          <h2>Confirm follow-up appointment as well: </h2>

          <DateDropdown
            label="follow-up date:"
            options={followupOptions}
            value={selectedFollowup}
            onChange={setSelectedFollowup}
          />

          <div className="modal-buttons">
              <button onClick={() => handleSaveFollowup(selectedFollowup)}>Confirm</button>
              <button onClick={() => closeModal()}>Cancel</button>
          </div>
        
          </div>
      </div>
    )}
    </div>
  );
}
