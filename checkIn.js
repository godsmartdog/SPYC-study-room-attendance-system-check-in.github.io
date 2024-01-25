import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

//do not write anything outside async

(async () => {

  const supabase = createClient('https://puisbpdboykphyeexnrh.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aXNicGRib3lrcGh5ZWV4bnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTUwMDEsImV4cCI6MjAyMTIzMTAwMX0.Sl_aehSlK5xgim5BoGfD4IAezVMuKEi77XmUW2_yRWw')
  const { data, error } = await supabase.auth.signInWithPassword({
  email: 'godsmartdog@email.com',
  password: 'pyc18076',
})  
  const checkInForm = document.getElementById('checkInForm');
  const attendeeIdInput = document.getElementById('attendeeId');

  attendeeIdInput.addEventListener('input', function() {
  checkInForm.submit();
});
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
      //check is there the record exist
      const { data: existingRecords, fetch_error } = await supabase
      .from('roomStatus')
      .select()
      .eq('attendee_id', attendeeId);



      if (existingRecords.length > 0) {
        // If record exists, delete it
        const { fetch_error: deleteError } = await supabase
          .from('roomStatus')
          .delete()
          .eq('attendee_id', attendeeId);
    
          console.log('Record deleted from roomStatus');
        }
    
        
      else {
        // If record doesn't exist, insert it
          const { error: insertError } = await supabase
            .from('roomStatus')
            .insert([
            {
              attendee_id: attendeeId,
              status: 'checked-in'
            }

            ])
            console.log('Record inserted into roomStatus');;}







    //clear input field
    attendeeIdInput.value = '';

    //useless, for me to check
    console.log('Check-in successful!');
  });
})();
