const msToHoursMinutes = (ms) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.ceil((ms - hours * 3600000) / 60000);
  return hours + "h " + minutes + "m";
};

const getColorRating = (rating) => "hsl(" + rating + ", 100%, 50%)";

const getRatingPercentage = (rating) => rating * 10;

const getActorInitial = (name) => {
  const splitedName = name.split(" ");
  if (splitedName.length >= 2) {
    return splitedName[0][0] + " " + splitedName[splitedName.length - 1][0];
  } else if (splitedName.length === 1) {
    return splitedName[0][0];
  } else {
    return ".";
  }
};

export {
  msToHoursMinutes,
  getColorRating,
  getRatingPercentage,
  getActorInitial,
};
