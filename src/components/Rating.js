import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Rating.css";

const Rating = ({ value }) => {
  if (value === undefined || value === null) {
    return null; // or a loading spinner, or nothing
  }

  const formattedValue = value.toFixed(1);

  const getColor = (value) => {
    if (value >= 7) {
      return '#4caf50';
    } else if (value >= 5) {
      return '#ffeb3b';
    } else {
      return '#f44336';
    }
  };

  const color = getColor(value);

  if (formattedValue === 0) {
    return null;
  }

  return (
    <div className="rating-bar">
      <CircularProgressbar
        value={value * 10}
        text={`${formattedValue}`}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: color,
          trailColor: "#1E2A32",
          textSize: "30px",
        })}
      />
    </div>
  );
};

export default Rating;