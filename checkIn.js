import { createClient } from '/@supabase/supabase-js@2'



const supabaseUrl = 'https://puisbpdboykphyeexnrh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aXNicGRib3lrcGh5ZWV4bnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTUwMDEsImV4cCI6MjAyMTIzMTAwMX0.Sl_aehSlK5xgim5BoGfD4IAezVMuKEi77XmUW2_yRWw'
const supabase = createClient('https://puisbpdboykphyeexnrh.supabase.co', 
                              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aXNicGRib3lrcGh5ZWV4bnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTUwMDEsImV4cCI6MjAyMTIzMTAwMX0.Sl_aehSlK5xgim5BoGfD4IAezVMuKEi77XmUW2_yRWw')


(async () => {
  checkInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

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

    //useless
    console.log('Check-in successful!');
  });
})();
