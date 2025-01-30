import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { Box, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import Axios from "../../../../utils/Axios";
import SummaryApi from "../../../../common/SummaryApi";

export default function Gallery() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: 400,
    bgcolor: "background.paper",
    boxShadow: 24,    
  };
  const [schools, setSchools] = React.useState([]);

  async function fetchSchools(){
    try {
        const response = await Axios({
            ...SummaryApi.getSchools
        })
        
        if(response.data.success){
            setSchools(response.data.schools)
        }
    } catch (err) {
        console.log(err);
    }
  }
  React.useEffect(() => {
    fetchSchools();
  }, [])
  
  const [selectedSchool, setSelectedSchool] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = (school) => {
    setOpen(true);
    setSelectedSchool(school);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedSchool(null);
  };

  return (
    <Box>
        <Typography variant="h4" sx={{paddingTop: "2rem", paddingBottom: "1rem", textAlign: "center"}}>Register Schools</Typography>
      <ImageList sx={{ width: "90%", height: "auto", margin: "0 auto" }}>
        
        {schools.map((school, index) => (
          <ImageListItem key={school.school_image+"school"+index}>
            <img
              srcSet={`./images/uploaded/school/${school.school_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`./images/uploaded/school/${school.school_image}?w=248&fit=crop&auto=format`}
              alt={school.school_name}
              loading="lazy"
              onClick={() => handleOpen(school)}
            />
            <ImageListItemBar
              title={school.school_name}    
              subtitle={school?.school_owner}          
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img            
            src={`./images/uploaded/school/${selectedSchool?.school_image}`}
            alt={selectedSchool?.school_name}
            style={{backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", width: "100%", height: "100%"}}
          />
        </Box>
      </Modal>
    </Box>
  );
}