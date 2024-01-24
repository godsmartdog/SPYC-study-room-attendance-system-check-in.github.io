//import { createClient } from '@supabase/supabase-js';
//const { createClient} = supabase
//const supabaseUrl = 'https://puisbpdboykphyeexnrh.supabase.co'
//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aXNicGRib3lrcGh5ZWV4bnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTUwMDEsImV4cCI6MjAyMTIzMTAwMX0.Sl_aehSlK5xgim5BoGfD4IAezVMuKEi77XmUW2_yRWw'

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://puisbpdboykphyeexnrh.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aXNicGRib3lrcGh5ZWV4bnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTUwMDEsImV4cCI6MjAyMTIzMTAwMX0.Sl_aehSlK5xgim5BoGfD4IAezVMuKEi77XmUW2_yRWw')





(async () => {
  console.log('Supabase Instance: ', supabase)
  checkInForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const attendeeIdInput = document.getElementById('attendeeId');
    const attendeeId = attendeeIdInput.value;
    const attendanceTime = new Date().toISOString(); // Get current time in ISO 8601 format

    // Insert record
    const { data, error } = await supabase
      .from('check_ins')
      .insert([
        {
          attendee_id: attendeeId,
          attendance_time: attendanceTime
        }
      ]);

    if (error) {
      console.error(error);
      return;
    }

    //clear input field
    attendeeIdInput.value = '';

    //useless, for me to check
    //console.log('Check-in successful!');
  });
})();
