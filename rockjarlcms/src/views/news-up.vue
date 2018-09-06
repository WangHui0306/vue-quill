<template>
  <div>
    <!--<header-nav></header-nav>-->
    <el-row>
      <el-col :span="4">
        <aside-nav></aside-nav>
      </el-col>
      <el-col :span="20">
        <div class="content-box">
          <div>
            <h4>文章标题:</h4>
            <el-input v-model="titleNews" placeholder="请输入文章标题"></el-input>
          </div>
          <h4>文章内容:</h4>
          <div>
            <!-- 图片上传组件辅助-->
            <!--:headers="header"-->
            <!--:data="upLoadData"-->
            <!--:show-file-list="false"-->
            <!--:on-success="uploadSuccess"-->
            <!--:on-error="uploadError"-->
            <el-upload
              class="avatar-uploader"
              action="123"
              accept="image/jpeg,image/gif,image/png"
              :headers="header"
              name="img"
              :before-upload="beforeUpload">
            </el-upload>
            <!--富文本编辑器组件-->
            <el-row v-loading="quillUpdateImg">
              <quill-editor
                v-model="detailContent"
                ref="myQuillEditor"
                :options="editorOption"
                @change="onEditorChange($event)"
                @ready="onEditorReady($event)"
              >
              </quill-editor>
            </el-row>
          </div>
          <div class="submit-style">
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </div>
        </div>
      </el-col>
    </el-row>


  </div>
</template>
<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import AsideNav from '@/components/aside'
//  import HeaderNav from '@/components/headers'
  // 工具栏配置
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction

    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['link', 'image', 'video'],
    ['clean']                                         // remove formatting button
  ]
  export default {
    data() {
      return {
        quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
        detailContent: '', // 富文本内容
        editorOption: {
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    // 触发input框选择图片文件
                    document.querySelector('.avatar-uploader input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        }, // 富文本编辑器配置
        contents: [],
        titleNews: '',
        timestamp: ''
      }
    },
    created (){
        this.getTimestamp()
    },
    methods: {
      // 上传前对文件的大小的判断
      // 上传图片前
      beforeUpload(file) {
        console.log(file)

        // 显示loading动画
        this.quillUpdateImg = true
        let fd = new FormData()
//        fd.append('file', file)
        fd.append('uploadFile', file)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$http.post('http://localhost:9999/api/file', fd, config) //上传图片的接口
          .then(res => {//成功后回调
            console.log(res)
            // res为图片服务器返回的数据
            // 获取富文本组件实例
            let quill = this.$refs.myQuillEditor.quill

            // 如果上传成功
            if (res.status == '200') {
              // 获取光标所在位置
              let length = quill.getSelection().index;
              // 插入图片  res.info为服务器返回的图片地址
              quill.insertEmbed(length, 'image', 'http://localhost:9999/public/'+res.data.object)//图片返回的链接
              // 调整光标到最后
              quill.setSelection(length + 1)
              console.log(quill)
            } else {
              this.$message.error('图片插入失败')
            }
            // loading动画消失
            this.quillUpdateImg = false
          })
          .catch(err => {
            console.log(err.data.msg)
          })
      },

      // 上传图片成功
//      uploadSuccess(res, file) {
//        console.log(res)
//        // res为图片服务器返回的数据
//        // 获取富文本组件实例
//        let quill = this.$refs.myQuillEditor.quill
//
//        // 如果上传成功
//        if (res.code === '200' && res.object !== null) {
//          // 获取光标所在位置
//          let length = quill.getSelection().index;
//          // 插入图片  res.info为服务器返回的图片地址
//          quill.insertEmbed(length, 'image', res.object)
//          // 调整光标到最后
//          quill.setSelection(length + 1)
//        } else {
//          this.$message.error('图片插入失败1')
//        }
//        // loading动画消失
//        this.quillUpdateImg = false
//      },
//      // 上传图片失败
//      uploadError(res, file) {
//        // loading动画消失
//        this.quillUpdateImg = false
//        this.$message.error('图片插入失败2')
//      },
      onEditorChange(editor) {
        console.log('editor Change!', editor)
        this.contents = editor
        console.log('!', this.contents)
      },
      onEditorReady(editor) {
        console.log('editor ready!', editor)
      },
      getTimestamp () {
        this.timestamp = parseInt(new Date().getTime()/1000)
      },
      //提交/保存
      onSubmit() {
        let params = {
          content: this.detailContent,
          title: this.titleNews,
          sortNum: this.timestamp
        }
        this.$http.post('http://localhost:9999/api/news', params)//上传的接口
          .then(res => {
              console.log(res)
            this.detailContent = ''
            this.titleNews = ''
            this.$message.success('提交成功')
          })
          .catch(err => {
              console.log(err)
            this.$message.error('提交失败')
          })
        console.log('submit!');
      }
    },
    components: {
      AsideNav,
//      HeaderNav
    }
  }
</script>

<style>
  .submit-style {
    text-align: center;
    padding: 40px 0 0;
  }
  .content-box {
    padding: 10px 20px;
  }
  .ql-editor{
    min-height: 300px;
  }
</style>
