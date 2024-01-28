import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

//do not write anything outside async

(async () => {

  const supabase = createClient('https://puisbpdboykphyeexnrh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aXNicGRib3lrcGh5ZWV4bnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTUwMDEsImV4cCI6MjAyMTIzMTAwMX0.Sl_aehSlK5xgim5BoGfD4IAezVMuKEi77XmUW2_yRWw') 
  const checkInForm = document.getElementById('checkInForm');
  const attendeeId = document.getElementById('attendeeId') //the input (add .value if you need to use the value inside the input)
  const attendanceTime = new Date().toISOString(); // Get current time in ISO 8601 format

  attendeeId.addEventListener('keydown', function (e) {
    if (e.key == "Enter") {
      console.log("HIHIHI")
      // only for check, not important
    }

  });
  const handleFormSubmit = async (event) => {

    // Insert record in check_ins, for the history
    const { data, error } = await supabase
      .from('check_ins')
      .insert([
        {
          attendeeId: attendeeId.value,
          attendance_time: attendanceTime
        }
      ]);
    //check is there the record exist in room status for checking he is entering or leaving
    const { data: existingRecords, fetch_error } = await supabase
      .from('roomStatus')
      .select()
      .eq('attendee_id', attendeeId.value);

    let checkInTime =null //for calculate the total time

    if (existingRecords && existingRecords.length > 0) {

      checkInTime = new Date(existingRecords[0].check_in_time);

      // If record exists, delete it, so it won't show in roomStatus
      const { fetch_error: deleteError } = await supabase
        .from('roomStatus')
        .delete()
        .eq('attendee_id', attendeeId.value);

      console.log('Record deleted from roomStatus');
    }


    else {
      // If record doesn't exist, insert it
      const { error: insertError } = await supabase
        .from('roomStatus')
        .insert([
          {
            attendee_id: attendeeId.value,
            status: 'checked-in',
            check_in_time : attendanceTime,
          }

        ])
      console.log('Record inserted into roomStatus');;
    }

    // Insert record into ranking table if it doesn't exist, for first time login
    const { data: existingRanking } = await supabase
    .from('ranking')
    .select('*')
    .eq('attendee_Id', attendeeId.value);

    if (!existingRanking || existingRanking.length === 0) { //same as roomStatus
    const { error: rankingInsertError } = await supabase
    .from('ranking')
    .insert([
      {
        attendee_Id: attendeeId.value,
        total_time: 0, // Set the current timestamp as total_time
      },
    ])};


    let totalTime = 0;
    if (checkInTime) {
      const currentTime = new Date();
      totalTime = (currentTime - checkInTime)/3600000; // get hour for total time
    }

    // Retrieve previous total time from ranking table, to add them up
    const { data: rankingData, error: rankingError } = await supabase
      .from('ranking')
      .select('total_time')
      .eq('attendee_Id', attendeeId.value);

    let previousTotalTime = 0;

    if (rankingData && rankingData.length > 0) {
      previousTotalTime = rankingData[0].total_time || 0;

      // Update total time in ranking table
      const { error: updateError } = await supabase
        .from('ranking')
        .update({ total_time: previousTotalTime + totalTime })
        .eq('attendee_Id', attendeeId.value);




    } 


    console.log('Check-in successful!');

  };
  checkInForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await handleFormSubmit();

    //clear input field
    attendeeId.value = '';


  })
})();
