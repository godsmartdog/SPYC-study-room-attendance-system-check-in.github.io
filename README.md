the node_modules is totally useless
I hv three table in supabase,
check_ins: Attend_Id (text format), attendence_time(timestampz)
ranking: attendee_Id(text), total_time(float4)
roomStatus:attendee_id (text), check_in_time(timestampz), status(text)

for insert other database , I suggest do it in the beginning by change checkIn.js (const attendeeId = document.getElementById('attendeeId');)  , and take the final value be shown as attendeeId.value

if the input is invalid, let input_valid=false
