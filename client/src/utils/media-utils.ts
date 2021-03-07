export const minToHoursMinutes = (min: number) => {
  const hours = Math.floor(min / 60);
  const minutes = Math.ceil(min - hours * 60);
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
