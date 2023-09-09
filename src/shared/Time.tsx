export const Time = (time: number | Date, format?: string) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 注意月份是从0开始的，所以需要加1
  const day = date.getDate();
  const hours = date.getHours();
  let minutes = date.getMinutes() + '';
  let seconds = date.getSeconds() + '';
  minutes = String(minutes).length === 1 ? '0' + minutes : minutes;
  seconds = String(seconds).length === 1 ? '0' + seconds : seconds;
  // 使用模板字符串拼接时间格式
  const formattedTime = `${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  if (format === 'MM-SS') {
    return `${month}月${day}日`;
  }
  if (format === 'YY-MM-SS') {
    return `${year}-${month}-${day}`;
  }
  if (format === 'MM-SS-DD') {
    return `${month}月${day}日 ${hours}:${minutes}`;
  }
  return formattedTime;
}

export const Timestamp = (time: string) => {
  const parsedDate = new Date(time.replace(/[年月]/g, '-').replace(/日/g, ''));
 return parsedDate.getTime();
}