export const timeFormatter = (timestamp: number) => {
  let seconds: number | string = Math.floor(timestamp / 1000);
  let minutes: number | string = Math.floor(seconds / 60);

  minutes %= 60;
  seconds %= 60;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return `${minutes}m:${seconds}s`;
};
