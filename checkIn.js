import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://puisbpdboykphyeexnrh.supabase.co'
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aXNicGRib3lrcGh5ZWV4bnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTUwMDEsImV4cCI6MjAyMTIzMTAwMX0.Sl_aehSlK5xgim5BoGfD4IAezVMuKEi77XmUW2_yRWw
const supabase = createClient(supabaseUrl, supabaseKey)

document.addEventListener('DOMContentLoaded', () => {
  const checkInForm = document.getElementById('checkInForm');
  const attendeeIdInput = document.getElementById('attendeeId');

  
  function autoSubmitForm() {
    checkInForm.removeEventListener('submit', handleSubmit);
    checkInForm.submit();
    console.log('Form submitted automatically.');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const attendeeId = attendeeIdInput.value;
    // Delay the form submission by 5 seconds (5000 milliseconds)
    setTimeout(autoSubmitForm, 5000);
  }

  checkInForm.addEventListener('submit', handleSubmit);
});
const attendeeId = document.getElementById('attendeeId').value;
        const attendanceTime = new Date().getTime();

        const { data, error } = await supabase
          .from('check_ins')
          .insert([
            {
              attendee_id: attendeeId,
              attendance_time: attendanceTime
            }

            
          ])
          .select()

       

        document.getElementById('attendeeId').value = '';

        console.log('Check-in successful!');
      });
    });
