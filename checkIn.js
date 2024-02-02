import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

//do not write anything outside async

(async () => {

  const supabase = createClient('https://puisbpdboykphyeexnrh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aXNicGRib3lrcGh5ZWV4bnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTUwMDEsImV4cCI6MjAyMTIzMTAwMX0.Sl_aehSlK5xgim5BoGfD4IAezVMuKEi77XmUW2_yRWw') 
  const checkInForm = document.getElementById('checkInForm');
  let attendeeId = document.getElementById('attendeeId') //the input (add .value if you need to use the value inside the input)
  let attendanceTime = new Date().toISOString(); // Get current time in ISO 8601 format
  let input_valid = true; //for status message
  
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
      .upsert([
        {
          Attendee_Id: attendeeId.value,
          attendance_time: attendanceTime
        }
      ])
      console.log('Record insert in check_ins');
    //check is there the record exist in room status for checking he is entering or leaving
    const { data: existingRecords, fetch_error } = await supabase
      .from('roomStatus')
      .select()
      .eq('attendee_id', attendeeId.value)

    let checkInTime =null //for calculate the total time

    if (existingRecords && existingRecords.length > 0) {

      checkInTime = new Date(existingRecords[0].check_in_time);

      // If record exists, delete it, so it won't show in roomStatus
      const { fetch_error: deleteError } = await supabase
        .from('roomStatus')
        .delete()
        .eq('attendee_id', attendeeId.value)

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
      .eq('attendee_Id', attendeeId.value)

    let previousTotalTime = 0;

    if (rankingData && rankingData.length > 0) {
      previousTotalTime = rankingData[0].total_time || 0;

      // Update total time in ranking table
      const { error: updateError } = await supabase
        .from('ranking')
        .update({ total_time: previousTotalTime + totalTime })
        .eq('attendee_Id', attendeeId.value)

    } 


    console.log('Check-in successful!');
    

  };
  
  function showStatusMessage(message, valid) {
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.style.display = 'block';
  statusMessage.textContent = message;

  if (valid) {
    statusMessage.style.color = 'green';
  } else {
    statusMessage.style.color = 'red';
  }

  // After a second, hide the status message
  setTimeout(() => {
    statusMessage.style.display = 'none';
  }, 3000);
}
//each half year refresh the total time, I am not sure will it works

function clearRanking(){
  (async () => {
    const {error} =await supabase
    .from(ranking)
    .delete()
  })
    
}
  
  function checkRewardEligibility() {
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
  // Check if it's the 1st of February or the 1st of September
    if ((currentMonth === 1 && currentDate === 1) || (currentMonth === 8 && currentDate === 1)) {
      // Clear the ranking records
      clearRanking();
  }}

  function timeLimitCheckIn(){
      (async () => {
        console.log("hihihi")
        const currentDate = new Date();
        const startTime = new Date();
        startTime.setHours(8, 15, 0); // Set the start time to 08:15:00
        const endTime = new Date();
        endTime.setHours(16, 30, 0); // Set the end time to 18:30:00
        
        if (currentDate <= startTime || currentDate >= endTime) {
          let { data: roomStatus, error } = await supabase
          .from('roomStatus')
          .select('attendee_id')
          let num_of_loop =roomStatus.length

          for (let i=0;i<=num_of_loop;i++); {
          let { data: roomStatus, error } = await supabase
          .from('roomStatus')
          .select('attendee_id')
        
         
          
          roomStatus.forEach(async (attendee) => {
            const tmp_time = new Date();
            attendanceTime = new Date(timestamp).toISOString();
            attendeeId.value = attendee.attendee_id;
            document.getElementById("attendeeId").click();
            console.log("hi3");
            await handleFormSubmit();
            console.log("hi4");
        }
        )
        } }
        
      })();
    }

    

  
  checkInForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const currentDate = new Date();
    const startTime = new Date();
    startTime.setHours(8, 15, 0); // Set the start time to 08:15:00
    const endTime = new Date();
    endTime.setHours(18, 30, 0); // Set the end time to 18:30:00
     if (currentDate >= startTime && currentDate <= endTime) {
      
      await handleFormSubmit();
      }
    else{
      input_valid = false;
    }
    if ( input_valid == true) {
      showStatusMessage("success", true);}
    else{
      showStatusMessage("invalid", false);}
    
      
    //clear input field
    attendeeId.value = '';


  })
  setInterval(checkRewardEligibility, 1000 * 60 * 60 * 24 ); 
  setInterval(timeLimitCheckIn, 1000*60); 
})();
