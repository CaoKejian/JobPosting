import { Toast } from "vant";

export const DownLoadInfo = async (file: any) => {
  try {
    console.log(file);
    const allowedExtensions = ['.jpg', '.png', '.jpeg', '.gif']
    if (allowedExtensions.some(item => file.fileName.endsWith(item))) {
      window.open(file.fileUrl)
      return
    }
    const link = document.createElement('a');
    link.href = file.fileUrl;
    link.download = file.fileName;
    link.click();
    await new Promise(resolve => setTimeout(resolve, 100));
    link.remove();
    console.log('文件下载完成:', file.fileName);
  } catch (error) {
    console.error('下载出错：', error);
  }
}