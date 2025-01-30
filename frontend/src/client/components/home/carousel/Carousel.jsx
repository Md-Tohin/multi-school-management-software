import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";

const carouselItems = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    description: "@bkristastucchio",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
    description: "@rollelflex_graphy726",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    description: "@helloimnik",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    description: "@nolanissac",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    description: "@hjrc33",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
    description: "@tjdragotta",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    description: "@katie_wasserman",
  },

  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
    description: "@shelleypauls",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
    description: "@peterlaster",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    description: "@southside_customs",
  },
];

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const handleBack = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <SwipeableViews
        index={activeIndex}
        onChangeIndex={(index) => setActiveIndex(index)}
      >
        {carouselItems.map((item, index) => 
          <Box
            key={index}
            sx={{ position: "relative", textAlign: "center", color: "white", width: "100%"}}
          >
            <Box sx={{height: "350px", width: "100%"}}>
            <img
              src={item.img}
              alt={item.title}
              style={{
                width: "100%",
                height: "98%",
                objectFit: "cover",
                backgroundRepeat: 'no-repeat',           
              }}
            />
            </Box>            
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "rgba(0, 0, 0, 0.6)",
                padding: "10px 20px",
                borderRadius: 1,
              }}
            >
                <Typography variant="h5">{item.title}</Typography>
                <Typography variant="body1">{item.description}</Typography>
            </Box>
          </Box>
        )}
      </SwipeableViews>

      <Box sx={{position: "absolute", top: "50%", left: 0, transform: 'translateY(-50%)', zIndex: 1}}>
        <Button variant="contained" onClick={handleBack}>
            <ArrowBackIos />
        </Button>
      </Box>
      <Box sx={{position: "absolute", top: "50%", right: 0, transform: 'translateY(-50%)', zIndex: 1}}>
        <Button variant="contained" onClick={handleNext}>
            <ArrowForwardIos />
        </Button>
      </Box>

    </Box>
  );
}
