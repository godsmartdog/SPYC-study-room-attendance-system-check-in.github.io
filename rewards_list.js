import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'


// Fetch and display attendee IDs with total_time >= 6
async function fetchAttendeesWithTotalTime() {
  const supabaseUrl = 'https://puisbpdboykphyeexnrh.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aXNicGRib3lrcGh5ZWV4bnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTUwMDEsImV4cCI6MjAyMTIzMTAwMX0.Sl_aehSlK5xgim5BoGfD4IAezVMuKEi77XmUW2_yRWw';
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('ranking')
    .select('attendee_Id')
    .gte('total_time', 6);

  if (error) {
    console.error(error);
    return;
  }

  const attendeeSection = document.getElementById('attendeeSection');
  attendeeSection.innerHTML = '';

  if (data.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'No attendees with total time >= 6.';
    attendeeSection.appendChild(message);
  } else {
    const attendeeList = document.createElement('ul');
    data.forEach((attendee) => {
      const listItem = document.createElement('li');
      listItem.textContent = attendee.attendee_Id;
      attendeeList.appendChild(listItem);
    });
    attendeeSection.appendChild(attendeeList);
  }
}

// Fetch attendee data initially
fetchAttendeesWithTotalTime();

// Periodically update the attendee data (e.g., every 5 seconds)
setInterval(fetchAttendeesWithTotalTime, 5000);
