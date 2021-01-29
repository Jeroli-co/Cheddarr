export interface IPublicUser {
  readonly username: string;
  readonly email: string;
  readonly avatar: string;
}

export const isPublicUser = (arg: any): arg is IPublicUser => {
  return (
    arg &&
    arg.username &&
    typeof arg.username == "string" &&
    arg.email &&
    typeof arg.email == "string" &&
    arg.avatar &&
    typeof arg.avatar == "string"
  );
};
