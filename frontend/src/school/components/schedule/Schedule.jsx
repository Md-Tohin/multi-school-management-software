import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

import "react-big-calendar/lib/css/react-big-calendar.css";
import AddScheduleEvent from "./AddScheduleEvent";
import { useEffect } from "react";
import axios from "axios";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import EditScheduleEvent from "./EditScheduleEvent";

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [classes, setClasses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);  

  const date = new Date();
  const myEventsList = [];
  const [schedules, setSchedules] = useState(myEventsList);

  async function fetchClass() {
    try {
      const response = await Axios({
        ...SummaryApi.getClass,
      });

      if (response.data.success) {
        setClasses(response.data.data);
        setSelectedClass(response?.data?.data[0]._id)
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchClass();
  }, []);

  function fetchSchedule() {
    if(selectedClass){
      axios
      .get(`${import.meta.env.VITE_API_URL}/api/schedule/fetch-with-class/${selectedClass}`)
      .then((resp) => {
        if (resp.data.success) {
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

  
  const handleSelectEvent = (event) => {  
    setOpenEditModal(true);
    setEditId(event.id);
  }

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
        <h2>Schedule</h2>
        <Button
          onClick={() => setOpenAddModal(true)}
          variant="contained"
          sx={{
            background: "#fff",
            border: "1px solid green",
            color: "#888",
            borderRadius: "50px",
            fontWeight: "600",
          }}
        >
          Add Schedule
        </Button>
      </section>

      {handleMessageOpen && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          close={() => setHandleMessageOpen(false)}
        />
      )}
      
      {openAddModal && (
        <AddScheduleEvent
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
          fetchSchedule={fetchSchedule}
          selectedClass={selectedClass}
          setHandleMessageOpen={setHandleMessageOpen}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
      )}

      {openEditModal && (
        <EditScheduleEvent
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          fetchSchedule={fetchSchedule}
          selectedClass={selectedClass}
          editId={editId}
          setHandleMessageOpen={setHandleMessageOpen}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
      )}

      <Box style={{ width: "250px", marginBottom: "1.5rem" }}>
        <FormControl fullWidth>
          <Typography sx={{fontWeight: '500'}}>Select Class</Typography>
          <Select            
            value={selectedClass}
            name="student_class"
            onChange={(e) => {
              setSelectedClass(e.target.value);
            }}
          >
            {classes &&
              classes.length > 0 &&
              classes.map((item, index) => {
                return (
                  <MenuItem key={item._id + "class" + index} value={item._id}>
                    {item.class_text} ({item.class_num})
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Box>

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
            onSelectEvent={handleSelectEvent}
            style={{ height: 500 }}
          />
        </div>
      </Box>
    </div>
  );
};

export default Schedule;
