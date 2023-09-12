
function title {
  echo 
  echo "###############################################################################"
  echo "## 👉$1👈"
  echo "###############################################################################" 
  echo 
}
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
title "正在打包"
npm run build
echo "${YELLOW}打包完成"

title "删除远端文件"
bin/coscli-mac rm -f cos://jobpost-1314966552/ -r
bin/obsutil rm -f obs://jobpost/ -r

title "正在上传"
bin/coscli-mac cp -r dist/ cos://jobpost-1314966552
bin/obsutil cp dist obs://jobpost/ -f -r -flat

title "上传成功"
echo "⭐️${YELLOW}请访问COS：'https://console.cloud.tencent.com/cos/bucket?bucket=jobpost-1314966552&region=ap-shanghai'"
echo "⭐️${YELLOW}或者项目：'http://jobpost-1314966552.cos-website.ap-shanghai.myqcloud.com/#/student/detail'"