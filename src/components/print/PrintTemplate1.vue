<template>
  <div style="height: 100%">
    <div class="print-content" id="dvData">
      <div style="page-break-after: always" v-for="(item, index) in printDatas" :key="index">
        <el-card>
          <!-- 二维码、条形码区域 -->
          <div class="between">
            <div :id="`qr-code-${item.orderNo}`" />
            <span class="column">
              <span class="barcode-box">
                <img :id="'barcode' + index" class="barcode" />
              </span>
            </span>
          </div>
          <div class="user-info">
            <!-- 左侧 -->
            <div class="user-info-left">
              <p class="info-title">From(Sender)</p>
              <div class="info-box">
                <div class="icon"><i class="el-icon-user-solid" /></div>
                <div class="info-text">{{ item.senderAddress.name }}</div>
              </div>
              <div class="info-box">
                <div class="icon"><i class="el-icon-phone" /></div>
                <div class="info-text">{{ addMosaic(item.senderAddress.phone) }}</div>
              </div>
              <div class="info-box" style="height: 50px">
                <div class="icon"><i class="el-icon-s-home" /></div>
                <div class="address">
                  <span>{{ item.senderAddress.provinceCity }}</span>
                  <span>{{ item.senderAddress.detail || '' }}</span>
                </div>
              </div>
            </div>
            <!-- 右侧 -->
            <div class="user-info-right">
              <p class="info-title">To(Addressee)</p>
              <div class="info-box">
                <div class="icon"><i class="el-icon-user-solid" /></div>
                <div class="info-text">{{ item.address.name }}</div>
              </div>
              <div class="info-box">
                <div class="icon"><i class="el-icon-phone" /></div>
                <div class="info-text">{{ addMosaic(item.address.phone) }}</div>
              </div>
              <div class="info-box" style="height: 50px">
                <div class="icon"><i class="el-icon-s-home" /></div>
                <div class="address">{{ item.address.city + ' ' + item.address.area }}</div>
              </div>
            </div>
          </div>
          <!-- 订单内容区域 -->
          <div class="order-content">
            <p class="spec" v-for="(item, index) in item.details" :key="index">
              {{ (item.skuId || '') + ' / ' }}
              {{ (item.spec || '') + ' / ' }}
              {{ item.count }};
            </p>
            <div class="bottom-bar">
              <div v-if="item.payMethod === 2" class="between">
                <div class="bottom-bar-item">
                  <span>PrePaid:&nbsp;</span>
                  <span>{{ item.displayCurrencySymbol + ' ' + item.prePaid }}</span>
                </div>
                <div class="bottom-bar-item" style="border-right: unset">
                  <span>COD:&nbsp;</span>
                  <span>{{ item.displayCurrencySymbol + ' ' + item.cod }}</span>
                </div>
              </div>
              <div class="between">
                <div class="bottom-bar-item" style="border-bottom: unset">
                  <span>Seller Type:&nbsp;</span>
                  <span>{{ item.sellerType }}</span>
                </div>
                <div class="bottom-bar-item" style="border: unset">
                  <span>Order ID:&nbsp;</span>
                  <span>{{ item.saleOrderId }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 底部 -->
          <div class="bottom-area">
            <div class="bottom-area-item" style="margin-top: 16px">
              {{
                item.payMethod === 1
                  ? 'Online' + ' ' + 'N/A'
                  : item.payMethod === 2
                  ? 'COD' + ' ' + item.displayCurrencySymbol + ' ' + item.cod
                  : null
              }}
            </div>
            <div>
              <div style="width: 100px">Battery</div>
              <div class="bottom-area-item">{{ item.withBattery === 1 ? 'YES' : 'NO' }}</div>
            </div>
            <div>
              <div style="width: 100px">Destination</div>
              <div class="bottom-area-item">{{ item.address.regionCode }}</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2' // 二维码
import JsBarcode from 'jsbarcode' // 条形码
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { browserStore } from '@/utils/browser-store'
import { addMosaic } from '@/utils/utils'
export default {
  setup() {
    // 是否需要打印(为会替换整个dom元素,需通过$route.query传递)
    const isPrint = ref(false)
    const $route = useRoute()

    // default
    const printDatas = ref([
      {
        senderAddress: {
          name: 'test',
          phone: '9991234666',
          provinceCity: 'test',
          detail: 'test'
        },
        address: {
          address: 'test',
          area: 'test',
          city: 'test',
          name: 'test',
          phone: '9991234666',
          regionCode: 'BD'
        },
        details: [
          {
            skuId: 'test',
            spec: 'test',
            count: 'test'
          }
        ],
        payMethod: 1,
        payAmount: 1,
        withBattery: 1,
        saleOrderId: 'test',
        sellerType: 'test',
        orderNo: 'test'
      }
    ])

    // 二维码
    const createQrCode = (ref, soId) => {
      const code = new QRCode(ref, {
        text: String(soId),
        width: 60,
        height: 60,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      })
      console.log(code)
    }
    // 条形码
    const createBarCode = (barName, soId) => {
      JsBarcode(barName, String(soId), {
        format: 'CODE128',
        font: 'Microsoft YaHei',
        fontSize: 25,
        width: 3,
        textAlign: 'right'
      })
    }

    isPrint.value = $route.query.isPrint
    if (isPrint.value === 'true') {
      printDatas.value = browserStore.get('printData')
    }

    onMounted(async() => {
      printDatas.value.forEach((item, index) => {
        const qrEl = document.getElementById(`qr-code-${item.orderNo}`)
        createQrCode(qrEl, item.orderNo)
        createBarCode(`#barcode${index}`, item.orderNo)
      })

      // 目前只针对单次打印做了延时处理 若多次打印 需更改延迟时间
      if (isPrint.value === 'true') {
        setTimeout(() => {
          const printData = document.getElementById('dvData').innerHTML
          window.document.body.innerHTML = printData
          window.print()
        }, 300)
      }
    })

    return {
      // data
      printDatas,
      isPrint,
      //   methods
      createQrCode,
      createBarCode,
      addMosaic
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-card__body) {
  padding: 15px 20px;
}
.between {
  display: flex;
  justify-content: space-between;
}
.column {
  display: flex;
  flex-direction: column;
}
.print-content {
  width: 400px;
  height: 100%;
  overflow: auto;
}
.barcode-box {
  display: inline-block;
  margin: 8px -8px 0 0;
  text-align: right;
  .barcode {
    height: 70px;
    margin-top: -10px;
  }
}
.user-info {
  width: 100%;
  border: 1px solid black;
  display: flex;
  .user-info-left {
    width: 50%;
    // 虚线打印需要使用rgb颜色才能被打印机识别
    border-right: 1px solid rgb(47, 47, 47);
    text-align: center;
  }
  .info-title {
    font-size: 12px;
    text-align: left;
    margin-left: 5px;
    font-weight: 700;
  }
  .info-box {
    display: flex;
    border-top: 1px dashed rgb(0, 0, 0);
    .icon {
      width: 30px;
      min-width: 30px;
      border-right: 1px dashed rgb(0, 0, 0);
    }
    .info-text {
      margin-left: 3px;
      font-size: 12px;
      line-height: 20px;
      height: 20px;
    }
    .address {
      text-align: left;
      margin: 1px 0px 0px 1px;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
      font-size: 10px;
      line-height: 12px;
    }
  }
  .user-info-right {
    width: 50%;
    text-align: center;
  }
}
.order-content {
  width: 100%;
  height: 120px;
  font-size: 10px;
  align-items: flex-end;
  border: 1px solid black;
  display: flex;
  border-top: none;
  flex-direction: column;
  margin-bottom: 10px;
  position: relative;
  .spec {
    white-space: normal;
    word-break: break-all;
    overflow-wrap: break-word;
  }
  .bottom-bar {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #000;
    .bottom-bar-item {
      width: 50%;
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      padding: 0px 2px;
      height: 18px;
      line-height: 18px;
    }
  }
}
.bottom-area {
  text-align: center;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  .bottom-area-item {
    width: 100px;
    border: 1px solid black;
    text-align: center;
    font-weight: 700;
    margin-top: 2px;
    height: 16px;
  }
}
</style>
