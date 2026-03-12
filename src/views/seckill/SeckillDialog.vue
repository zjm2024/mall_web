<template>
  <el-dialog v-model="isShowDialog" :title="dialogTitle" draggable width="800px" :close-on-click-modal="false"
    :show-close="false" @closed="handleClosed">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="right" size="large">

      <el-row>
        <el-col :span="12">



          <!-- 商品编号 -->
          <el-form-item label="商品编号" prop="productNo" class="form-item-large">
            <el-input v-model="formData.productNo" placeholder="请输入商品编号" maxlength="50" size="large" :readonly="true"
              clearable>

              <template #suffix>
                <Search style="margin-right: 0px; width: 1.5em; height: 1.5em" @click.stop="handleClick()" />
              </template>



            </el-input>
          </el-form-item>

          <!-- 商品名称 -->
          <el-form-item label="商品名称" prop="productName" class="form-item-large">
            <el-input v-model="formData.productName" placeholder="请输入商品名称" maxlength="50" size="large" :disabled="true"
              clearable />
          </el-form-item>



          <!-- 秒杀价格 -->
          <el-form-item label="秒杀价格" prop="seckillPrice" class="form-item-large">

            <el-input-number v-model="formData.seckillPrice" :precision="2" :step="0.1" :min="0" size="large"
              clearable />

          </el-form-item>



        </el-col>
        <el-col :span="12">
          <el-form-item label="商品主图" class="form-item-large">
            <el-upload :class="{ 'hidePlus': hideUpload }" v-model:file-list="filelist" :auto-upload="false"
              list-type="picture-card" :multiple="false" :limit="1" accept=".jpg,.png">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <!-- 总活动数量 -->
          <el-form-item label="总活动数量" prop="activityStock" class="form-item-large">


            <el-input-number v-model="formData.activityStock" :min="1" size="large" clearable />

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 每人限购数量 -->
          <el-form-item label="每人限购数量" prop="perPersonLimit" class="form-item-large">
            <el-input-number v-model="formData.perPersonLimit" :min="1" size="large" clearable />

          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="12">
          <!-- 活动日期 -->
          <el-form-item label="活动日期" prop="activityDate" class="form-item-large">
            <el-date-picker v-model="formData.activityDate" type="date" placeholder="选择活动日期" size="large"
              style="width: 180px;" @change="handleDateChange" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 时间点 -->
          <el-form-item label="秒杀时间点" prop="seckillTime" class="form-item-large">
            <el-select v-model="formData.seckillTime" placeholder="请选择秒杀时间点" size="large" style="width: 180px;"
              @change="handleChange">

              <el-option :label="item.SeckillTime" :value="item.SeckillTime" :key="item.TimerId"
                v-for="(item, index) in timeoptions" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>



      <el-row>
        <el-col :span="12">
          <!-- 开始时间 -->
          <el-form-item label="开始时间" prop="startTime" class="form-item-large">
            <el-date-picker v-model="formData.startTime" type="datetime" placeholder="选择开始时间" size="large"
              style="width: 200px;" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" :disabled="true" />

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 结束时间 -->
          <el-form-item label="结束时间" prop="endTime" class="form-item-large">
            <el-date-picker v-model="formData.endTime" type="datetime" placeholder="选择结束时间" size="large"
              style="width: 200px;" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>



      <el-row>
        <el-col :span="24">
          <!-- 状态 -->
          <el-form-item label="状态" prop="status" class="form-item-large">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1" size="large">进行中</el-radio>
              <el-radio :label="2" size="large">未开始</el-radio>
              <el-radio :label="3" size="large">已结束</el-radio>
              <el-radio :label="4" size="large">已关闭</el-radio>

            </el-radio-group>
          </el-form-item>
        </el-col>


      </el-row>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel" size="large" style="width: 120px;">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting" size="large" style="width: 120px;">
          {{ submitting ? '处理中...' : '确定' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
  <PickProductDialog ref="pickproductdialogRef" @handleQuery="handleDialogQuery" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/common'
import { createSeckill, updateSeckill } from '@/api/modules/seckill'
import PickProductDialog from '../../components/common/PickProductDialog.vue'

const pickproductdialogRef = ref(null)

const props = defineProps({

  mode: {
    type: String,
    default: 'add'
  },
  seckilltimeoptions: {
    type: Array,
    default: () => []
  }

})

const emits = defineEmits(['success'])

// 表单引用
const formRef = ref()
const submitting = ref(false)
const hideUpload = ref(false)

// 表单数据
const formData = reactive({
  seckillId: 0,
  productId: '',
  productNo: '',
  productName: '',
  productImage: '',
  businessId: 0,
  seckillPrice: '',
  activityStock: '',
  activityDate: '',
  seckillTime: '',
  startTime: '',
  endTime: '',
  status: 1,
  perPersonLimit: 0,
  appType: 0
})

const filelist = ref([])
const timeoptions = ref([])

const isShowDialog = ref(false)

// 验证规则
const rules = {
  productNo: [
    { required: true, message: '请选择商品编号', trigger: 'blur' },

  ],
  perPersonLimit: [
    { required: true, message: '请输入每人限购数量', trigger: 'blur' },

  ],
  activityDate: [
    { required: true, message: '请选择活动日期', trigger: 'blur' },

  ],
  seckillTime: [
    { required: true, message: '请选择秒杀时间点', trigger: 'blur' },

  ],
  seckillPrice: [
    { required: true, message: '请输入秒杀价格', trigger: 'blur' },

  ],

}



// 计算属性
const dialogTitle = computed(() => {
  if (props.mode === 'add') {
    return '添加秒杀'
  }
  return `编辑秒杀 - ${formData.productName}`
})


// 打开弹窗
const openDialog = async (row) => {
  Object.assign(formData, JSON.parse(JSON.stringify(row)));
  timeoptions.value = props.seckilltimeoptions
  filelist.value = [];
  const url = formData.productImage
  if (url !== '') {
    filelist.value.push({ url: url });
    hideUpload.value = true;
  }
  isShowDialog.value = true


}

// 关闭弹窗
const closeDialog = (res) => {
  emits('success', res)
  isShowDialog.value = false
}

// 方法
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    const submitData = {
      seckillId: formData.seckillId,
      businessId: formData.businessId,
      productId: formData.productId,
      productNo: formData.productNo,
      productName: formData.productName,
      seckillPrice: formData.seckillPrice,
      activityStock: formData.activityStock,
      activityDate: formData.activityDate,
      seckillTime: formData.seckillTime,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: formData.status,
      perPersonLimit: formData.perPersonLimit,
      appType: formData.appType

    }
    var res
    if (props.mode === 'add') {
      res = await createSeckill(submitData)
      ElMessage.success('添加成功')
    } else {
      res = await updateSeckill(submitData)
      ElMessage.success('更新成功')
    }
    //传回seckill
    closeDialog(res.result)
  } catch (error) {


  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  isShowDialog.value = false
}

const handleClosed = () => {

}

const handleClick = () => {
  pickproductdialogRef.value.openDialog()
}

const handleChange = (val) => {
  const selectedItem = timeoptions.value.find(item => item.SeckillTime === val)
  if (selectedItem) {
    //计算开始日期和结束日期
    const minutes = selectedItem.SeckillMinutes
    formData.startTime = formatDate(formData.activityDate, 'YYYY-MM-DD') + " " + val
    const start = new Date(formData.startTime)
    const end = start.setMinutes(start.getMinutes() + minutes)
    formData.endTime = formatDate(new Date(end))


  }
}

const handleDateChange = (val) => {
  if (formData.seckillTime !== "") {
    handleChange(formData.seckillTime);
  }

}

const handleDialogQuery = (res) => {
  formData.productId = res.productId;
  formData.productNo = res.productNo;
  formData.productName = res.productName;
  formData.productImage = res.productImage;

  filelist.value = [];
  const url = formData.productImage
  if (url !== '') {
    filelist.value.push({ url: url });
    hideUpload.value = true;
  }

}
// 导出对象
defineExpose({ openDialog })
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  border-radius: 12px;

  .el-dialog__header {
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ed;
    margin-right: 0;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  .el-dialog__body {
    padding: 24px;
  }

  .el-dialog__footer {
    padding: 20px 24px;
    border-top: 1px solid #e4e7ed;
  }
}

.hidePlus {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}


.form-item-large {
  margin-bottom: 22px;

  :deep(.el-form-item__label) {
    font-size: 15px;
    font-weight: 500;
    color: #606266;
    height: 40px;
    line-height: 40px;
  }

  :deep(.el-input__wrapper),
  :deep(.el-radio__label) {
    font-size: 14px;
  }
}

.parent-category {
  display: flex;
  align-items: center;
  gap: 12px;

  .el-tag {
    font-size: 14px;
    padding: 6px 12px;
    height: auto;
  }

  .parent-level {
    color: #909399;
    font-size: 14px;
    font-weight: 400;
  }
}

.icon-upload {
  display: flex;
  align-items: center;
  width: 100%;
}

.icon-preview {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 6px;

  .preview-text {
    color: #606266;
    font-size: 14px;
    font-weight: 500;
  }

  .icon-image {
    width: 36px;
    height: 36px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    object-fit: cover;
  }
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-tip {
  color: #909399;
  font-size: 13px;
  font-weight: 400;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;

  .el-button {
    font-size: 15px;
    font-weight: 500;
    border-radius: 8px;

    &:first-child {
      border: 1px solid #dcdfe6;
      color: #606266;

      &:hover {
        border-color: #409eff;
        color: #409eff;
        background-color: #ecf5ff;
      }
    }
  }
}
</style>