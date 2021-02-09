export const msToHoursMinutes = (ms: number) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.ceil((ms - hours * 3600000) / 60000);
  return hours + "h " + minutes + "m";
};

export const getColorRating = (rating: any) => "hsl(" + rating + ", 100%, 50%)";

export const getRatingPercentage = (rating: any) => rating * 10;

export const getActorInitial = (name: string) => {
  const splitedName = name.split(" ");
  if (splitedName.length >= 2) {
    return splitedName[0][0] + " " + splitedName[splitedName.length - 1][0];
  } else if (splitedName.length === 1) {
    return splitedName[0][0];
  } else {
    return ".";
  }
};
