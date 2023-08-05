import { Toast } from "vant";

export const DownLoadInfo = async (file: any) => {
  try {
    console.log(file);

    if (file.fileUrl.endsWith('.jpg') || file.fileUrl.endsWith('.png')) {
      Toast({
        message: '如果为图片形式，则去详情页单独下载！'
      })
      return
    }
    const link = document.createElement('a');
    link.href = file.fileUrl;
    link.download = file.fileName;
    link.click();
    await new Promise(resolve => setTimeout(resolve, 100));
    link.remove();
    console.log('文件下载完成:', file.filename);
  } catch (error) {
    console.error('下载出错：', error);
  }
}