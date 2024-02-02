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
  //the main function
  const FormSubmit = async (event) => {

    // upsert record in check_ins, for the history
    const { data, error } = await supabase
      .from('check_ins')
      .upsert([
        {
          Attendee_Id: attendeeId.value,
          attendance_time: attendanceTime
        }
      ])
      console.log('Record insert in check_ins');//just for check
    
    //check is there the record exist in room status for checking he is entering or leaving
    const { data: existingRecords, fetch_error } = await supabase
      .from('roomStatus')
      .select()
      .eq('attendee_id', attendeeId.value)//the conditional

    let checkInTime =null //for calculate the total time

    if (existingRecords && existingRecords.length > 0) {
      //get the time
      checkInTime = new Date(existingRecords[0].check_in_time);

      // If record exists, delete it, so it won't show in roomStatus
      const { fetch_error: deleteError } = await supabase
        .from('roomStatus')
        .delete()
        .eq('attendee_id', attendeeId.value)

      console.log('Record deleted from roomStatus');//just for check
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
      console.log('Record inserted into roomStatus');;//just for check
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
        total_time: 0, // Set 0 as total_time for ppl first login
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
    console.log('Check-in successful!');//just for check
  };
  //to show success or invalid in web
  function showStatusMessage(message, valid) {
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.style.display = 'block';
  statusMessage.textContent = message;

  if (input_valid) {
    statusMessage.style.color = 'green';
  } else {
    statusMessage.style.color = 'red';
  }

  // After 3 seconds, hide the status message
  setTimeout(() => {
    statusMessage.style.display = 'none';
  }, 3000);
}
//each half year refresh the total time
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
//if it is before 08:15 or after 18:30 then delete all record in roomStatus and calucate the total time by calling FormSubmit()
  function timeLimitCheckIn(){
      (async () => {
        console.log("hihihi")//for check
        const currentDate = new Date();
        const startTime = new Date();
        startTime.setHours(8, 15, 0); // Set the start time to 08:15:00
        const endTime = new Date();
        endTime.setHours(18, 30, 0); // Set the end time to 18:30:00
        
        if (currentDate <= startTime || currentDate >= endTime) {
          //get ppl in room
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
            attendeeId.value = attendee.attendee_id;//input the data in to input box
            document.getElementById("attendeeId").click();
            await FormSubmit();
            
        }
        )
        } }
        
      })();
    }

    

  //when the data submitted
  checkInForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    //check is the time pass 18:30 already
    const currentDate = new Date();
    const startTime = new Date();
    startTime.setHours(8, 15, 0); // Set the start time to 08:15:00
    const endTime = new Date();
    endTime.setHours(18, 30, 0); // Set the end time to 18:30:00
     if (currentDate >= startTime && currentDate <= endTime) {
      
      await FormSubmit();
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
  setInterval(checkRewardEligibility, 1000 * 60 * 60 * 24 ); //run per day
  setInterval(timeLimitCheckIn, 1000*60*5); //run per 5 mins
})();
