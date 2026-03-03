export type ClassType = "first" | "second" | "both" | "empty";

export type ScheduleRow = {
  time: string;
  classes: {
    content: string;
    type: ClassType;
  }[];
};
