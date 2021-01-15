<!--
 * @Author: your name
 * @Date: 2021-01-09 09:35:01
 * @LastEditTime: 2021-01-15 09:19:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\views\keyPerson\index.vue
-->
<template>
  <div class="keyPerson">
    <mapCom id="map" @showHistory="showHistory"
       @checkPhone="checkPhone"
       :mapData="mapData"></mapCom>
    <!-- 右边数字按键盘 -->
    <div class="numPart">
      <div v-for="(item, index) in numData" :key="index + 'num'" class="numItem"
        @click="showCurrentPerson(item.type)">
        <i :class="['numIcon', 'numIcon' + item.type, numActive === item.type ? 'iconActive' + item.type : '']"></i>
        <div>
          <p :class="[numActive === item.type ? 'dataActive' : '']">{{ item.name }}</p>
          <p :class="['dataSpan', numActive === item.type ? 'dataActive' : '']">{{ item.data }}</p>
        </div>
      </div>
    </div>
    <!-- 底部功能按钮 -->
    <div class="btnPart">
      <div class="btnItem" @click="exportBtn">
        <img src="@/assets/img/keyPerson/export.png" alt="">
        <p>导出</p>
      </div>
      <div class="btnItem" @click="backBtn">
        <img src="@/assets/img/keyPerson/home.png" alt="">
        <p>初始位</p>
      </div>
    </div>
    <!-- 重点人员列表 -->
    <div class="listPart">
      <span  class="listTitle">重点人员列表</span>
      <i @click="switchList" class="switchList el-icon-d-arrow-right"></i>
      <div v-if="listShow" class="treeAndPhone">
        <el-tree
          :data="listdata"
          node-key="id"
          :filter-node-method="filterNode"
          :props="defaultProps"
          @node-click="nodeCheck"
          default-expand-all
          ref="tree"
          class="treePart">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <i :class="['levelIcon', data.className]"></i>
            <span style="margin-left: 5px">{{ node.label }} </span>
          </span>
        </el-tree>
        <div class="phonePart">
          <el-input
            class="inputPart"
            placeholder="请输入姓名或手机号码"
            v-model="filterText">
          </el-input>
          <div class="phoneList" :style="phoneHight">
            <p v-for="(item, index) in showPhoneData" :key="index + 'phone'"
              @click="phoneClick(item)">
              {{ item.xm }} {{ item.telphone }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 导出功能弹窗 -->
    <el-dialog title="重点人导出" :visible.sync="exportDialog" width="30%">
      <el-radio v-model="exportType" label="0">导出失联重点人</el-radio>
      <el-radio v-model="exportType" label="3">导出近三日消失重点人</el-radio>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitExport" size="mini">确 定</el-button>
        <el-button @click="exportDialog = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 预警消息列表 -->
    <el-dialog title="预警消息列表" :visible.sync="warnListDialog" width="80%" top="10vh">
      <el-form :inline="true" ref="ruleForm" :model="ruleForm" class="demo-ruleForm" label-width="100px"
              size="mini">
        <el-form-item label="手机号码" prop="telphone">
          <el-input v-model="ruleForm.telphone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="预警类型" prop="earlyType">
          <el-select v-model="ruleForm.earlyType" placeholder="请选择" clearable>
            <el-option value="4" label="漫出">漫出</el-option>
            <el-option value="5" label="聚集">聚集</el-option>
            <el-option value="6" label="进入韶山">进入韶山</el-option>
            <el-option value="7" label="进入湖南省政府">进入湖南省政府</el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="searchWarn" size="mini">查 询</el-button>
      </el-form>
      <el-table
        :data="warnListData"
        :height="warnHeight"
        stripe
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column label="手机号码" prop="phoneOrName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="预警原因" prop="earlyReason" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="预警时间" prop="earlyTime" align="center" width="180"></el-table-column>
        <el-table-column label="预警类型" prop="earlyType" align="center"></el-table-column>
        <el-table-column label="预警内容" prop="earlyContent" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="预警状态" prop="status" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-s-claim" @click="checkPosition(scope.row)">当前位置</el-button>
            <!-- <el-button type="text" icon="el-icon-s-claim" @click="detail(scope.row)">查看详情</el-button> -->
          </template>
        </el-table-column>
    </el-table>
    </el-dialog>
    <!-- 历史轨迹，APP日志，上网日志 -->
    <historyCom class="historyPart" v-if="historyShow"
      :queryPhone="queryPhone"
      :activePage="activePage"
      @closeHistory="closeHistory"></historyCom>
  </div>
</template>

<script >
import { ZdrPersTree, ZdrLatAndLngQuery, QueryDifferentTypes, getearlyInfoNum, countData,
  EarlyPersonLatAndLngQuery } from '@/api/keyPerson'
export default {
  name: "keyPerson",
  data() {
    return {
      mapData: [],
      numData: [
        { type: 1, name:'上控号码', data: 0 },
        { type: 2, name:'在网号码', data: 0 },
        { type: 3, name:'今日在线号码', data: 0 },
        { type: 4, name:'近三日消失人', data: 0 },
        { type: 5, name:'预警消息', data: 0 }
      ],
      numActive: 1,
      listShow: false,
      filterText: '',
      listdata: [
        {
          id: '01',
          label: '省厅关注人员',
          className: 'levelFirst',
          children: [{
            id: '001',
            label: '涉恐人员',
            className: 'levelS',
            children: []
          }]
        },
        {
          id: '02',
          label: '市局关注人员',
          className: 'levelFirst'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      phoneData: [],
      showPhoneData: [],
      // 重点人导出
      exportDialog: false,
      exportType: '0',
      // 预警消息列表
      warnListDialog: false,
      ruleForm: {
        telphone: '',
        earlyType: ''
      },
      warnListData: [],
      // 历史轨迹
      queryPhone: '',
      historyShow: false,
      activePage: 0
    }
  },
  watch: {
    filterText(val) {
      if (val === '') {
        this.showPhoneData = this.phoneData
      } else {
        let filter = this.phoneData.filter(item => {
          return (item.xm.indexOf(val) !== -1 || item.telphone.indexOf(val) !== -1)
        })
        this.showPhoneData = filter
      }
    }
  },
  computed: {
    warnHeight() {
      let h = $(window).height() - $(window).height() * 0.15 - 50 - 56 - 40 - 50
      return h
    },
    phoneHight() {
      let h = $(window).height() - 55 - 10 - 30 - 20 - 60
      return {
        height: h + 'px'
      }
    }
  },
  mounted() {
    this.getNumData()
    this.getKeyList()
    this.getPointData('all')
  },
  methods: {
    // 获取数字盘数据
    getNumData() {
      countData().then( res => {
        this.numData = res
      })
    },
    // 数字盘切换
    showCurrentPerson(type) {
      this.numActive = type
      switch(type) {
        case 1:
          this.getPointData('all')
          break;
        case 2:
          this.getPointData('1or2')
          break;
        case 3:
          this.getPointData('1')
          break;
        case 4:
          this.getPointData('3')
          break;
        case 5:
          this.ruleForm = {
            telphone: '',
            earlyType: ''
          }
          this.warnListDialog = true
          this.getWarnData()
          break;
      }
    },
    // 获取地图点数据
    getPointData(type) {
      this.listShow = false
      // all 上控号码   1or2 在网号码   1 今日在线号码   3 进三日消失人
      QueryDifferentTypes({ statusflag: type }).then( res => {
        this.mapData = res
      })
    },
    // 获取重点人列表 涉恐人员分类
    getKeyList() {
      // let data = [
      //   { id: 21, gj: '重点人' },
      //   { id: 22, gj: '经商务工' },
      //   { id: 23, gj: '有组织务工' },
      //   { id: 24, gj: '旅游探亲访友及其他' },
      //   { id: 25, gj: '学生' },
      //   { id: 26, gj: '其他' },
      //   { id: 27, gj: '关注人员' },
      //   { id: 28, gj: 'null' }
      // ]
      // data.forEach(item => {
      //   item.label = item.gj
      // })
      // this.listdata[0].children[0].children = data
      ZdrPersTree().then( res => {
        res.forEach(item => {
          item.label = item.gj
          item.className = 'levelThree'
        })
        this.listdata[0].children[0].children = res
      })
    },
    // 重点人信息列表节点点击
    nodeCheck(checkedNodes) {
      if (checkedNodes.gj) {
        ZdrLatAndLngQuery({ zdryxl: checkedNodes.gj }).then( res => {
          this.phoneData = res
          this.showPhoneData = res
          this.mapData = res
          this.numActive = -1
        })
      }
    },
    // 单个重点人点击事件
    phoneClick(data) {
      this.mapData = [data]
    },
    // 重点人员列表显示隐藏
    switchList() {
      this.listShow = !this.listShow
      if (this.listShow) {
        $('.switchList').removeClass('el-icon-d-arrow-left')
        $('.switchList').addClass('el-icon-d-arrow-right')
      } else {
        $('.switchList').removeClass('el-icon-d-arrow-right')
        $('.switchList').addClass('el-icon-d-arrow-left')
      }
    },
    // 重点人列表帅选
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取预警消息列表
    getWarnData(phoneOrName = '', earlyType = '') {
      getearlyInfoNum({
        phoneOrName: phoneOrName,
        earlyType: earlyType
      }).then( res => {
        res.data.forEach(item => {
          if (item.earlyStatus === '0') {
            item.status = '未读'
          }
        })
        this.warnListData = res.data
      })
    },
    // 预警消息列表 搜索
    searchWarn() {
      this.getWarnData(this.ruleForm.telphone, this.ruleForm.earlyType)
    },
    // 查看某个预警当前位置
    checkPosition(data) {
      EarlyPersonLatAndLngQuery({
        id: data.id,
        telphone: data.phoneOrName
      }).then( res => {
        this.mapData = res
        this.listShow = false
        this.warnListDialog = false
      })
    },
    // 导出
    exportBtn() {
      this.exportDialog = true
      this.exportType = '0'
    },
    // 初始位
    backBtn() {
      this.getPointData('all')
      this.numActive = 1
      this.listShow = false
    },
    // 导出确定
    submitExport() {
      this.exportDialog = false
      let iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = '/api/keyPers/persListExport?statusflag=' + this.exportType + ' '
      iframe.onload = function () {
        document.body.removeChild(iframe)
      }
      document.body.appendChild(iframe)
    },
    // 右键查询某个号码的历史轨迹
    checkPhone(val) {
      this.queryPhone = val
    },
    // 跳转至历史轨迹页面
    showHistory(val, type) {
      this.historyShow = val
      this.activePage = type
    },
    // 从历史轨迹页面返回
    closeHistory(val) {
      this.historyShow = val
    }
  },
  components: {
    historyCom: () => import('./components/historyCom'),
    mapCom: () => import('./components/leafLetMap')
    // mapCom: () => import('./components/baiduMap')
  }
}
</script>

<style scoped lang="scss">
.keyPerson {
  height: 100%;
  position: relative;
  .numPart {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1000;
    background: rgba(9, 25, 61, 0.75);
    color: #fff;
    width: 200px;
    padding: 8px 10px;
    font-size: 14px;
    .numItem {
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 80px;
      }
      .numIcon {
        width: 80px;
        height: 89px;
      }
      .numIcon1 {
        background: url("~@/assets/img/keyPerson/1.png") no-repeat center;
        background-size: 100% 100%;
      }
      .iconActive1 {
        background: url("~@/assets/img/keyPerson/1chose.png") no-repeat center;
        background-size: 100% 100%;
      }
      .numIcon2 {
        background: url("~@/assets/img/keyPerson/2.png") no-repeat center;
        background-size: 100% 100%;
      }
      .iconActive2 {
        background: url("~@/assets/img/keyPerson/2chose.png") no-repeat center;
        background-size: 100% 100%;
      }
      .numIcon3 {
        background: url("~@/assets/img/keyPerson/3.png") no-repeat center;
        background-size: 100% 100%;
      }
      .iconActive3 {
        background: url("~@/assets/img/keyPerson/3chose.png") no-repeat center;
        background-size: 100% 100%;
      }
      .numIcon4 {
        background: url("~@/assets/img/keyPerson/4.png") no-repeat center;
        background-size: 100% 100%;
      }
      .iconActive4 {
        background: url("~@/assets/img/keyPerson/4chose.png") no-repeat center;
        background-size: 100% 100%;
      }
      .numIcon5 {
        background: url("~@/assets/img/keyPerson/5.png") no-repeat center;
        background-size: 100% 100%;
      }
      .iconActive5 {
        background: url("~@/assets/img/keyPerson/5chose.png") no-repeat center;
        background-size: 100% 100%;
      }
      .dataSpan {
        font-family: 'lcdD';
        font-size: 22px;
        margin-top: 5px;
      }
      .dataActive {
        color: #FBC213;
      }
    }
  }
  .btnPart {
    z-index: 1000;
    position: absolute;
    bottom: 18px;
    left: calc(50% - 80px);
    display: flex;
    cursor: pointer;
    .btnItem {
      margin: 0 10px;
      img {
        background: #F4F3F3;
        border-radius: 50%;
        padding: 12px;
        box-shadow: 0px 0px 17px #195AAA;
      }
      p {
        background: #195AAA;
        border-radius: 7px;
        color: #fff;
        text-align: center;
        font-size: 14px;
        padding: 2px 0;
        margin-top: 5px;
      }
    }
  }
  .listPart {
    z-index: 1000;
    position: absolute;
    top: 5px;
    left: 5px;
    background: #FFFFFF;
    box-shadow: 0px 5px 17px 1px rgba(37, 37, 37, 0.51);
    padding: 12px 20px 16px 12px;
    .listTitle {
      margin-right: 10px;
      font-size: 14px;
      font-weight: bold;
    }
    .switchList {
      float: right;
      margin-top: 4px;
      cursor: pointer;
    }
    .inputPart {
      margin: 10px 0;
    }
    .treeAndPhone {
      display: flex;
      .treePart {
        margin-top: 10px;
        .levelIcon {
          display: inline-block;
          width: 20px;
          height: 20px;
          position: relative;
          top: 2px;
        }
        .levelFirst {
          background: url("~@/assets/img/keyPerson/levelF.png") no-repeat center;
          background-size: 100% 100%;
        }
        .levelS {
          background: url("~@/assets/img/keyPerson/levelS.png") no-repeat center;
          background-size: 100% 100%;
        }
        .levelThree {
          background: url("~@/assets/img/keyPerson/levelT.png") no-repeat center;
          background-size: 100% 100%;
        }
      }
      .phonePart {
        margin-left: 30px;
        .phoneList {
          overflow: auto;
          p {
            font-size: 14px;
            line-height: 28px;
            cursor: pointer;
            padding-left: 5px;
            &:hover {
              background: rgba(148, 144, 144, 0.2);
            }
          }
        }
      }
    }
  }
  .historyPart {
    z-index: 1001;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #001733;
  }
}
</style>