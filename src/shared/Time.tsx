export const Time = (time: number) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 注意月份是从0开始的，所以需要加1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  // 使用模板字符串拼接时间格式
  const formattedTime = `${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  return formattedTime;
}

export const mTime = (time: number) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Check if the date is before or on December 10th
  if (month < 12 || (month === 12 && day <= 10)) {
    // Use template string to format the time
    const formattedTime = `${month}月${day}日`;
    return formattedTime;
  } else {
    return ''; // Return an empty string for dates after December 10th
  }
}
