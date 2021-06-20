export interface IUser {
  id: number;
  username: string;
  email: string;
  avatar: string;
  roles: number;
  confirmed: boolean;
}

export const isUser = (arg: any): arg is IUser => {
  return (
    arg &&
    arg.id &&
    typeof arg.id == "number" &&
    arg.username &&
    typeof arg.username == "string" &&
    arg.email &&
    typeof arg.email == "string" &&
    arg.avatar &&
    typeof arg.avatar == "string" &&
    arg.roles &&
    typeof arg.roles == "number"
  );
};
