
function title {
  echo 
  echo "###############################################################################"
  echo "## 👉$1👈"
  echo "###############################################################################" 
  echo 
}
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
title "正在上传"
bin/coscli-mac cp -r dist/ cos://jobpost-1314966552

title "上传成功"
echo "⭐️${YELLOW}请访问COS：'https://console.cloud.tencent.com/cos/bucket?bucket=jobpost-1314966552&region=ap-shanghai'"
echo "⭐️${YELLOW}或者项目：'http://jobpost-1314966552.cos-website.ap-shanghai.myqcloud.com/#/student/detail'"