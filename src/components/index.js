import XtlHelp from "./help-box";
import XtlPage from "./page-box";
import XtlDetail from "./detail-box";
import XtlTable from "./page-table";
import XtlSearch from "./search-box";
import XtlUploadFile from "./upload-file";
import XtlUploadImg from "./upload-img";
import XtlUploadImgList from "./upload-img-list";
import XtlUploadVideo from "./upload-video";
import XtlWeeks from "./weeks";
import XtlEditTable from "./edit-table";
import XtlEditor from "./editor";
import XtlElTable from "./el-table-plus";

const components = [
  XtlHelp,
  XtlPage,
  XtlDetail,
  XtlTable,
  XtlSearch,
  XtlUploadFile,
  XtlUploadImg,
  XtlUploadImgList,
  XtlUploadVideo,
  XtlWeeks,
  XtlEditTable,
  XtlEditor,
  XtlElTable
];
const install = function(Vue) {
  if (install.installed) return;
  components.map((component) => {
    Vue.use(component);
  });
};
//  全局引用可自动安装
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

const API = {
  install,
  ...components,
};

export { API };
export default API;
