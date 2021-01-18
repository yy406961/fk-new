<!--
 * @Author: your name
 * @Date: 2021-01-12 10:42:02
 * @LastEditTime: 2021-01-18 14:09:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fk-new\src\views\keyPerson\components\historyCom.vue
-->
<template>
  <div class="historyCom">
    <!-- 功能按钮 -->
    <img src="@/assets/img/keyPerson/back.png" alt="" class="backBtn" @click="backBtn">
    <div class="btnPart">
      <span :class="['btnItem',  tabActive === 0 ? 'btnActive' : '']" @click="tabChange(0)">历史轨迹</span>
      <span :class="['btnItem',  tabActive === 1 ? 'btnActive' : '']" @click="tabChange(1)">APP日志</span>
      <span :class="['btnItem',  tabActive === 2 ? 'btnActive' : '']" @click="tabChange(2)">上网日志</span>
    </div>
    <el-button type="primary" @click="showTimeChose" class="timeChose">历史轨迹时间选择</el-button>
    <!-- <el-button type="primary" @click="playBack" class="playBack">历史轨迹回放</el-button> -->
    <!-- 历史轨迹地图 -->
    <div class="mapPart" >
      <mapCom id="historyMap" :data="historyData" ref="historyMap"></mapCom>
      <div class="personInfo ">
        <span>姓名：{{ personName }}</span>
        <span>手机号：{{ queryPhone }}</span>
        <span>QQ：{{ infoData.qq }}</span>
        <span>微信：{{ infoData.wechat }}</span>
        <span>邮箱：{{ infoData.mail }}</span>
        <span>工作地：{{ infoData.work }}</span>
        <span>居住地：{{ infoData.home }}</span>
        <span>银行名称：{{ infoData.bankName }}</span>
        <span>银行卡号：{{ infoData.bankNumber }}</span>
      </div>
    </div>
    <!-- 表格部分 -->
    <div class="tablePart" v-show="tabActive === 1 || tabActive === 2">
      <div class="tableTitle">
        <div class="title">
          <img src="@/assets/img/keyPerson/title.png" alt="">
          <span>{{ tableTitle }}</span>
        </div>
        <div class="export" @click="exportTable">
          <img src="@/assets/img/keyPerson/export2.png" alt="">
          <span>将表格导出Excel</span>
        </div>
      </div>
      <el-table
        :data="tableList"
        :height="tableHeight"
        stripe
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column label="app名称" prop="busstype" align="center" v-if="tabActive === 1"></el-table-column>
        <el-table-column label="网址" prop="topdomain" align="center" v-if="tabActive === 2"></el-table-column>
        <el-table-column label="小时" prop="hour" align="center"></el-table-column>
        <el-table-column label="次数" prop="count" align="center"></el-table-column>
        <el-table-column label="最晚时间" prop="max_time" align="center"></el-table-column>
        <el-table-column label="最早时间" prop="min_time" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 历史轨迹时间选择 -->
    <el-dialog title="时间范围" :visible.sync="timeDialog" width="30%" :modal-append-to-body="false">
      <div style="margin-bottom: 20px">
        <el-radio v-model="timeType" label="0">近一天</el-radio>
        <el-radio v-model="timeType" label="1">近一周</el-radio>
        <el-radio v-model="timeType" label="2">时间段</el-radio>
      </div>
      <el-form ref="ruleForm" :model="timeForm"  class="demo-ruleForm" label-width="80px"
        label-position="left" size="mini" :disabled="timeDisabled">
        <el-form-item label="开始时间" prop="begintime">
          <el-date-picker
            v-model="timeForm.begintime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endtime">
          <el-date-picker
            v-model="timeForm.endtime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkTime" size="mini">确 定</el-button>
        <el-button @click="timeDialog = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isExist, searchvirtualId, lsgjInfo, getAPPTop, getURLTop } from '@/api/keyPerson'
export default {
  name: "leafLetMap",
  props: {
    // 历史轨迹 APP日志 上网日志页签
    activePage: {
      type: Number,
      default: 0
    },
    // 查询的号码
    queryPhone: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      tabActive: -1,
      tableTitle: 'APP日志列表',
      tableList: [],
      timeDialog: false,
      timeForm: {
        begintime: '',
        endtime: ''
      },
      isQuery: false, // 是否查询了历史轨迹
      historyData: [],
      personName: '暂无数据',
      infoData: {
        qq: '暂无数据',
        wechat: '暂无数据',
        mail: '暂无数据',
        work: '暂无数据',
        home: '暂无数据',
        bankName: '暂无数据',
        bankNumber: '暂无数据',
      },
      timeType: '0',
      timeDisabled: true
    }
  },
  watch: {
    timeType(val) {
      if (val === '0') {
        this.timeDisabled = true
        this.timeForm.begintime = new Date(new Date() - 24 * 60 * 60 * 1000)
        this.timeForm.endtime = new Date()
      } else if (val === '1') {
        this.timeDisabled = true
        this.timeForm.begintime = new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
        this.timeForm.endtime = new Date()
      } else {
        this.timeDisabled = false
        this.timeForm.begintime = new Date(new Date() - 24 * 60 * 60 * 1000)
        this.timeForm.endtime = new Date()
      }
    }
  },
  computed: {
    tableHeight() {
      let h = $(window).height() - 55 - 43 - 20 - 30 - 10
      return h
    }
  },
  mounted() {
    this.tabActive = this.activePage
    if (this.activePage === 0) {
      this.getInfoData()
      this.getPersonName()
    }
    if (this.activePage === 1) {
      this.tableTitle = 'APP日志列表'
      this.getAppData()
    }
    if (this.activePage === 2) {
      this.tableTitle = '上网日志列表'
      this.getNetData()
    }
  },
  methods: {
    // 返回详情页
    backBtn() {
      this.$emit('closeHistory', false)
    },
    // 页签切换
    tabChange(type) {
      this.tabActive = type
      if (type === 0) {
        this.getInfoData()
        this.getPersonName()
      }
      if (type === 1) {
        this.tableTitle = 'APP日志列表'
        this.getAppData()
      }
      if (type === 2) {
        this.tableTitle = '上网日志列表'
        this.getNetData()
      }
    },
    // 历史轨迹时间选择
    showTimeChose() {
      this.timeDialog = true
      this.timeType = '0'
      this.timeForm.begintime = new Date(new Date() - 24 * 60 * 60 * 1000)
      this.timeForm.endtime = new Date()
    },
    // 历史轨迹回放
    playBack() {
      this.$refs.historyMap.playback()
    },
    // 查询历史轨迹确定时间区间
    checkTime() {
      let begintime = this.timeForm.begintime
      let endtime = this.timeForm.endtime
      if (begintime === '' || endtime === '' || endtime === null || begintime === null) {
        this.$message.warning('起始时间或结束时间为空,请重新选择')
        return
      }
      if (new Date(begintime).valueOf() > new Date(endtime).valueOf()) {
        this.$message.warning('起始时间不能晚于结束时间')
        return
      }
      let day = this.DateMinus(begintime, endtime)
      if (day > 7){
        this.$message.warning('时间跨度不能大于七天,请重新选择')
        return
      }
      this.timeDialog = false
      this.isQuery = true
      this.getHistoryData()
    },
    DateMinus(date1, date2){
      let sdate = new Date(date1);
      let now = new Date(date2);
      let days = now.getTime() - sdate.getTime();
      days = Math.abs(days);
      let day = parseInt(days / (1000 * 60 * 60 * 24))
      return day
    },
    // 获取历史轨迹数据
    getHistoryData() {
      lsgjInfo({ 
        mobile: this.queryPhone,
        idcard: '',
        startTime: this.formatTime(this.timeForm.begintime),
        endTime: this.formatTime(this.timeForm.endtime)
      }).then( res => {
        if (res.code === 200) {
          this.historyData = res.data
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 时间格式化
    formatTime(date) {
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      let s = date.getSeconds();
      s = s < 10 ? '0' + s : s
      return y + m + d + h + minute + s
    },
    // 获取查询号码相关信息
    getInfoData() {
      searchvirtualId({ mobile: this.queryPhone }).then( res => {
        this.infoData = res
      })
    },
    // 获取查询号码的名字
    getPersonName() {
      isExist({ mobile: this.queryPhone }).then( res => {
        this.personName = res[0].xm
      })
    },
    // 获取APP日志数据
    getAppData() {
      this.tableList = []
      getAPPTop({
        msisdn: this.queryPhone,
        type: '1',
        flag: '1'
      }).then( res => {
        this.tableList = res.data
      })
    },
    // 获取上网日志数据
    getNetData() {
      this.tableList = []
      getURLTop({
        msisdn: this.queryPhone,
        type: '1',
        flag: '1'
      }).then( res => {
        this.tableList = res.data
      })
    },
    // APP日志  上网日志 导出
    exportTable() {
      let exporttimetype = '1' // 默认查一周
      // this.tabActive 1 app日志导出 2上网日志导出
      let url = "/api/authorizat/caseApplicationwriteExcel?msisdn=" + this.queryPhone + "&type=" + exporttimetype + "&flag=1" + "&exporttype=" + this.tabActive
      let iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      iframe.onload = function () {
        document.body.removeChild(iframe)
      }
      document.body.appendChild(iframe)
    }
  },
  components: {
    mapCom: () => import('./historyMap')
  }
}
</script>

<style scoped lang="scss">
.historyCom {
  width: 100%;
  height: 100%;
  position: relative;
  color: #fff;
  .backBtn {
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    width: 58px;
  }
  .btnPart {
    display: flex;
    justify-content: center;
    .btnItem {
      background: url("~@/assets/img/keyPerson/btn.png") no-repeat center;
      background-size: 100% 100%;
      padding: 10px 22px 12px 22px;
      cursor: pointer;
    }
    .btnActive {
      background: url("~@/assets/img/keyPerson/btnChose.png") no-repeat center;
      background-size: 100% 100%;
    }
  }
  .timeChose {
    position: absolute;
    left: 10px;
    top: 50px;
    z-index: 2001;
  }
  .playBack {
    position: absolute;
    left: 0px;
    bottom: 10px;
    z-index: 2001;
  }
  .mapPart {
    position: relative;
    height: calc(100% - 43px);
    .personInfo {
      display: flex;
      flex-direction: column;
      z-index: 2001;
      background: rgba(9, 25, 61, 0.75);
      position: absolute;
      right: 0;
      top: 0;
      padding: 10px 20px;
      font-size: 13px;
      span {
        line-height: 26px;
      }
    }
  }
  .tablePart {
    position: absolute;
    top: 42px;
    z-index: 30003;
    width: 100%;
    height: calc(100% - 43px);
    padding: 10px;
    background: #F5F8FD;
    .tableTitle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .title {
        color: #1D2023;
        display: flex;
        align-items: center;
        span {
          margin-left: 5px;
        }
      }
      .export {
        display: flex;
        align-items: center;
        background: #2BB3D0;
        padding: 4px 10px;
        border-radius: 2px;
        cursor: pointer;
        span {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>

