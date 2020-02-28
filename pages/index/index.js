import {
  promisify
} from "../../utils/promise.util";
import {
  $init,
  $digest
} from "../../utils/common.util";
var app = getApp();

const wxUploadFile = promisify(wx.uploadFile);
Page({
  data: {
    content: "",
    imagesUrl: [], //图片url路径数组
    formats: {},
    bottom: 0,
    _focus: false,
  },


  onLoad(options) {
    $init(this);
  },


  /**
   * 富文本编辑器初始化
   */
  onEditorReady() {
    const that = this;
    wx.createSelectorQuery()
      .select("#editor")
      .context(function (res) {
        that.editorCtx = res.context;
        that.setDefault() //这里拉取需要编辑的数据然后初始化到编辑器里面
      })
      .exec();
  },

  //可以给编辑器设置默认值
  setDefault: function () {
    const that = this
    const content = '<p wx:nodeid="85"><span wx:nodeid="114" style="background - color: rgb(0, 255, 0);">这是一段默认值</span></p>'
    that.editorCtx.setContents({
      html: content,
      success: function () {
        that.data.content = content
        console.log('insert html success')
      }
    })
  },

  /**
   * 富文本内容输入
   */
  handleContentInput(e) {
    const value = e.detail.html;
    this.data.content = value
    $digest(this);
  },
  /**
   * 插入图片
   */
  insertImage() {
    const that = this;
    wx.chooseImage({
      count: 6,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        const images = res.tempFilePaths;
        for (let path of images) {
          // 上传图片到服务器
          // 将图片上传成功后的地址返回保存(我这里省略了这一步,直接将临时文件地址保存)
          that.data.imagesUrl.push(path); // 生产环境中 path是上传成功后的地址
          that.editorCtx.insertImage({
            src: path // 生产环境中 path是上传成功后的地址
          });
        }
      }
    });
  },

  /**
   * 删除插入图
   */
  removeImage(e) {
    const idx = e.target.dataset.idx;
    this.data.images.splice(idx, 1);
    $digest(this);
  },
  undo() {
    this.editorCtx.undo();
  },
  redo() {
    this.editorCtx.redo();
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset;
    if (!name) return;
    // console.log('format', name, value)
    this.editorCtx.format(name, value);
  },
  onStatusChange(e) {
    const formats = e.detail;
    this.setData({
      formats
    });
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log("insert divider success");
      }
    });
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success");
      }
    });
  },

  removeFormat() {
    this.editorCtx.removeFormat();
  },

  insertDate() {
    const date = new Date();
    const formatDate = `${date.getFullYear()}/${date.getMonth() +
      1}/${date.getDate()}`;
    this.editorCtx.insertText({
      text: formatDate
    });
  },
  /**
   * 提交响应
   */
  submitForm() {
    console.log(this.data.content)
    wx.showModal({
      title: '',
      content: '富文本编译器内容已打印在控制台',
    })
  }
});