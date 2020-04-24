const msToHoursMinutes = (ms) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.ceil((ms - hours * 3600000) / 60000);
  return hours + "h " + minutes + "m";
};

const getColorRating = (rating) => "hsl(" + rating + ", 100%, 50%)";

const getRatingPercentage = (rating) => rating * 10;

export { msToHoursMinutes, getColorRating, getRatingPercentage };
