
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  Box,
} from "@mui/material";
import { useState } from "react";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect } from "react";
import axios from "axios";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";

const localizer = momentLocalizer(moment);

export default function ScheduleStudent() {
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [selectedClass, setSelectedClass] = useState(null);  

  const myEventsList = [];
  const [schedules, setSchedules] = useState(myEventsList);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/student/fetch-single`
      );
      setSelectedClass(response.data.student?.student_class);      
    } catch (error) {
      console.log(error);
      setMessage("Select Role first. Then try again.");
      setMessageType("error");
      setHandleMessageOpen(true);
    }
  };
  useEffect(() => {
    fetchStudent();
  }, []);

  function fetchSchedule() {
    if(selectedClass){
      axios
      .get(`${import.meta.env.VITE_API_URL}/api/schedule/fetch-with-class/${selectedClass?._id}`)
      .then((resp) => {
        if (resp.data.success) {
          console.log("schedules", resp);
          
          const respData = resp.data?.schedules?.map((item) => {
            return({
              id: item._id,
              title: `Sub: ${item.subject?.subject_name}, Teacher: ${item.teacher?.name}`,
              start: new Date(item.startTime),
              end: new Date(item.endTime),
            })
          })
          setSchedules(respData);
        }
      })
      .catch((e) => {
        console.log(e);
        setMessage(e?.response?.data?.message);
        setMessageType("error");
        setHandleMessageOpen(true);
      });
    }    
  }

  useEffect(() => {
    fetchSchedule();
  }, [selectedClass]);  

  return (
    <div>
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "1rem",
        }}
      >
        <h2>Schedule for Class {selectedClass?.class_text} ({selectedClass?.class_num})</h2>       
      </section>

      {handleMessageOpen && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          close={() => setHandleMessageOpen(false)}
        />
      )}

      <Box component={"div"}>
        <div>
          <Calendar
            localizer={localizer}
            events={schedules}
            defaultView="week"
            views={["month", "week", "day", "agenda"]}
            step={30}
            timeslots={1}
            min={new Date(1970, 1, 1, 10, 0, 0)}
            max={new Date(1070, 1, 1, 17, 0, 0)}
            defaultDate={new Date()}
            startAccessor="start"
            endAccessor="end"
            showMultiDayTimes
            style={{ height: 500 }}
          />
        </div>
      </Box>
    </div>
  );
}





