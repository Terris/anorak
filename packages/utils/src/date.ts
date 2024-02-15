import dayjs from "dayjs";

type DateProp = Date | number | string;

export function formatDate(date: DateProp, format: string = "MMM D, YYYY") {
  return dayjs(date).format(format);
}
