<template>

  <el-dialog v-model="isShowDialog" title="规格管理" draggable width="1000px" :close-on-click-modal="false" top="60px"
    @closed="handleClosed" @opened="handleOpened">

    <SpecComponent :productData="formData" ref="specComponentref"></SpecComponent>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit" :disabled="loading" size="large"
          style="width: 120px;">确认</el-button>
        <el-button @click="handleClose" size="large" style="width: 120px;">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import {

  getProductDetail
} from '@/api/modules/product'

import SpecComponent from './SpecComponent.vue'




const isShowDialog = ref(false)
const loading = ref(false)
const detailContainer = ref(null)//

const specComponentref = ref(null)

// 详情数据
const formData = reactive({
  productId: 0
})


/**
 * 打开详情弹窗
 */
const openDialog = async (row) => {
  try {
    loading.value = true
    //查询规格
    isShowDialog.value = true
    const res = await getProductDetail(row.productId)
    Object.assign(formData, res.result)
  } catch (error) {
  } finally {
    loading.value = false
  }
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
  isShowDialog.value = false
}


const handleOpened = async () => {
  /*
  // 等待Vue完成DOM更新，确保detailContainer.value可用
  await nextTick()
  // 安全地访问容器DOM元素并重置滚动位置
  if (detailContainer.value) {
    detailContainer.value.scrollTop = 0  // 设置滚动条到最顶部位置
  }
    */
}

/**
 * 弹窗关闭回调
 */
const handleClosed = () => {
  // 清空数据

}

const handleSubmit = async () => {
  // 保存数据
  await specComponentref.value.handleSubmit();
}

// 暴露方法给父组件
defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
.order-detail-dialog {

  /* 使用深度选择器穿透scoped限制 */
  :deep(.el-dialog__body) {
    padding: 20px;
    max-height: calc(80vh - 120px);
    overflow-y: auto;
  }
}

.order-detail-container {
  .detail-card {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 16px;
      color: #303133;
    }

    .desc-label {
      background-color: #f5f7fa;
      font-weight: 600;
      color: #606266;
    }

    :deep(.el-descriptions__label) {
      font-weight: 500;
      color: #606266;
    }

    :deep(.el-descriptions__content) {
      color: #303133;
    }

    .order-no {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 14px;
      color: #409EFF;
      font-weight: 600;
    }

    .amount-price {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .pay-amount-price {
      font-size: 18px;
      font-weight: 700;
      color: #F56C6C;
    }

    .discount-amount {
      font-size: 16px;
      font-weight: 600;
      color: #67C23A;
    }
  }

  .remark-content {
    padding: 12px 0;
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    min-height: 40px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
