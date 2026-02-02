<template>
  <el-card class="form-card" shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <el-icon class="card-icon">
            <SetUp />
          </el-icon>
          <h3 class="card-title">商品规格</h3>
          <el-tag size="small" v-if="hasSpecifications" type="success">
            {{ totalSkus }}个SKU
          </el-tag>
        </div>
        <el-button type="primary" @click="addSpecification" size="small" link>
          <el-icon>
            <Plus />
          </el-icon>添加规格
        </el-button>
      </div>
    </template>

    <div class="specifications">
      <!-- 规格设置 -->
      <div class="spec-list">
        <div v-for="(spec, index) in specifications.filter(it => it.isShow === true)" :key="index" class="spec-item">
          <div class="spec-header">
            <div class="spec-title">
              <el-input v-model="spec.specName" placeholder="规格名称（如：颜色、尺寸）" size="small" style="width: 150px;" />
              <div class="spec-actions">
                <el-button type="danger" @click="removeSpecification(index)" size="small" text circle>
                  <el-icon>
                    <Close />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>

          <div class="spec-values">
            <div class="values-header">
              <span class="values-label">规格值：</span>
              <el-button @click="addSpecValue(index)" size="small" text>
                <el-icon>
                  <Plus />
                </el-icon>添加值
              </el-button>
            </div>

            <div class="values-list">
              <div v-for="(value, valueIndex) in spec.specValues" :key="valueIndex" class="value-item">
                <el-input v-model="spec.specValues[valueIndex].specValue" placeholder="输入规格值" size="small"
                  style="flex: 1;" />
                <el-button @click="removeSpecValue(index, valueIndex)" size="small" text circle
                  v-if="spec.specValues.length > 1">
                  <el-icon>
                    <Close />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SKU列表 -->
      <div v-if="skuList.length >= 0" class="sku-section">
        <div class="card-header">
          <h4 class="sku-title">SKU列表管理</h4>
          <!-- 

                  <el-button type="primary" @click="generateSkuList" size="small">
                    <el-icon>
                      <Plus />
                    </el-icon>生成SKU列表
                  </el-button>
                  -->
        </div>


        <div class="sku-table-container">
          <table class="sku-table">
            <thead>
              <tr>
                <th v-for="spec in specifications.filter(it => it.isShow === true)" :key="spec.specName"
                  class="sku-header">
                  {{ spec.specName }}
                </th>
                <th class="sku-header">序号</th>
                <th class="sku-header">价格</th>
                <th class="sku-header">库存</th>
                <th class="sku-header">默认</th>
                <th class="sku-header">图片</th>
                <th class="sku-header">Id</th>
              </tr>
            </thead>
            <tbody>




              <template v-if="specifications.filter(it => it.isShow === true).length === 1"
                v-for="(item1, index1) in specifications[0].specValues">
                <tr class="sku-row">

                  <td class="sku-cell">
                    {{ item1.specValue }}

                  </td>
                  <td class="sku-cell">
                    {{ index1 + 1 }}

                  </td>
                  <td class="sku-cell">
                    <el-input-number v-if="skuList[index1]" v-model="skuList[index1].price" :min="0" :precision="2"
                      size="small" controls-position="right" style="width: 120px;" />
                  </td>

                  <td class="sku-cell">
                    <el-input-number v-if="skuList[index1]" v-model="skuList[index1].stock" :min="0" size="small"
                      controls-position="right" style="width: 100px;" />
                  </td>


                  <td class="sku-cell" v-if="skuList[index1]" @click="handleCellClick(index1)">
                    <el-radio v-model="defaultIndex" :label="index1" size="small">
                      默认
                    </el-radio>
                  </td>



                  <td class="sku-cell">
                    <el-upload class="sku-image-upload" v-if="skuList[index1]" :http-request="handlcustomUpload"
                      :auto-upload="true" :show-file-list="false"
                      :on-success="(res) => handleSkuImageUpload(res, skuList[index1])"
                      :before-upload="(file) => beforeImageUpload(file, skuList[index1])">
                      <div v-if="skuList[index1].image" class="sku-image-preview">
                        <el-image :src="skuList[index1].image" style="height: 40px;width: 40px;" />
                      </div>
                      <el-button v-else size="small" type="text">
                        <el-icon>
                          <Picture />
                        </el-icon>上传
                      </el-button>
                    </el-upload>
                  </td>
                  <td class="sku-cell">
                    {{ skuList[index1].specId }}
                  </td>

                </tr>
              </template>




              <template v-if="specifications.filter(it => it.isShow === true).length === 2"
                v-for="(item2, index2) in specifications[1].specValues">


                <template v-for="(item1, index1) in specifications[0].specValues">

                  <tr class="sku-row">

                    <td class="sku-cell">
                      {{ item1.specValue }}

                    </td>

                    <td class="sku-cell">
                      {{ item2.specValue }}

                    </td>
                    <td class="sku-cell">


                      {{ (index2 * specifications[0].specValues.length) + index1 + 1 }}

                    </td>




                    <td class="sku-cell">
                      <el-input-number v-if="skuList[(index2 * specifications[0].specValues.length) + index1]"
                        v-model="skuList[(index2 * specifications[0].specValues.length) + index1].price" :min="0"
                        :precision="2" size="small" controls-position="right" style="width: 120px;" />
                    </td>


                    <td class="sku-cell">
                      <el-input-number v-if="skuList[(index2 * specifications[0].specValues.length) + index1]"
                        v-model="skuList[(index2 * specifications[0].specValues.length) + index1].stock" :min="0"
                        size="small" controls-position="right" style="width: 100px;" />
                    </td>


                    <td class="sku-cell" v-if="skuList[(index2 * specifications[0].specValues.length) + index1]"
                      @click="handleCellClick((index2 * specifications[0].specValues.length) + index1)">
                      <el-radio v-model="defaultIndex" :label="(index2 * specifications[0].specValues.length) + index1"
                        size="small">
                        默认
                      </el-radio>
                    </td>

                    <td class="sku-cell">
                      <el-upload class="sku-image-upload"
                        v-if="skuList[(index2 * specifications[0].specValues.length) + index1]"
                        :http-request="handlcustomUpload" :auto-upload="true" :show-file-list="false"
                        :on-success="(res) => handleSkuImageUpload(res, skuList[(index2 * specifications[0].specValues.length) + index1])"
                        :before-upload="(file) => beforeImageUpload(file, skuList[(index2 * specifications[0].specValues.length) + index1])">
                        <div v-if="skuList[(index2 * specifications[0].specValues.length) + index1].image"
                          class="sku-image-preview">
                          <el-image :src="skuList[(index2 * specifications[0].specValues.length) + index1].image"
                            style="height: 40px;width: 40px;" />
                        </div>
                        <el-button v-else size="small" type="text">
                          <el-icon>
                            <Picture />
                          </el-icon>上传
                        </el-button>
                      </el-upload>
                    </td>
                    <td class="sku-cell">
                      {{ skuList[(index2 * specifications[0].specValues.length) + index1].specId }}
                    </td>


                  </tr>

                </template>


              </template>





              <template v-if="specifications.filter(it => it.isShow === true).length === 3"
                v-for="(item3, index3) in specifications[2].specValues">


                <template v-for="(item2, index2) in specifications[1].specValues">


                  <template v-for="(item1, index1) in specifications[0].specValues">

                    <tr class="sku-row">

                      <td class="sku-cell">
                        {{ item1.specValue }}

                      </td>
                      <td class="sku-cell">
                        {{ item2.specValue }}

                      </td>
                      <td class="sku-cell">
                        {{ item3.specValue }}

                      </td>

                      <td class="sku-cell">

                        {{ (index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                          + (index2 * specifications[0].specValues.length) + index1 + 1 }}

                      </td>


                      <td class="sku-cell">
                        <el-input-number v-if="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                          + (index2 * specifications[0].specValues.length) + index1]" v-model="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                            + (index2 * specifications[0].specValues.length) + index1].price" :min="0" :precision="2"
                          size="small" controls-position="right" style="width: 120px;" />
                      </td>


                      <td class="sku-cell">
                        <el-input-number v-if="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                          + (index2 * specifications[0].specValues.length) + index1]" v-model="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                            + (index2 * specifications[0].specValues.length) + index1].stock" :min="0" size="small"
                          controls-position="right" style="width: 100px;" />
                      </td>


                      <td class="sku-cell" v-if="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                        + (index2 * specifications[0].specValues.length) + index1]" @click="handleCellClick((index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                          + (index2 * specifications[0].specValues.length) + index1)">
                        <el-radio v-model="defaultIndex" :label="(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                          + (index2 * specifications[0].specValues.length) + index1" size="small">
                          默认
                        </el-radio>
                      </td>

                      <td class="sku-cell">
                        <el-upload class="sku-image-upload" v-if="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                          + (index2 * specifications[0].specValues.length) + index1]" :http-request="handlcustomUpload"
                          :auto-upload="true" :show-file-list="false" :on-success="(res) => handleSkuImageUpload(res, skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                            + (index2 * specifications[0].specValues.length) + index1])" :before-upload="(file) => beforeImageUpload(file, skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                              + (index2 * specifications[0].specValues.length) + index1])">
                          <div v-if="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                            + (index2 * specifications[0].specValues.length) + index1].image"
                            class="sku-image-preview">
                            <el-image :src="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                              + (index2 * specifications[0].specValues.length) + index1].image"
                              style="height: 40px;width: 40px;" />
                          </div>
                          <el-button v-else size="small" type="text">
                            <el-icon>
                              <Picture />
                            </el-icon>上传
                          </el-button>
                        </el-upload>
                      </td>
                      <td class="sku-cell">
                        {{ skuList[(index3 * specifications[1].specValues.length *
                          specifications[0].specValues.length)
                          + (index2 * specifications[0].specValues.length) + index1].specId }}
                      </td>


                    </tr>

                  </template>


                </template>

              </template>




            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="empty-spec">
        <el-icon>
          <Box />
        </el-icon>
        <p>暂无规格，点击添加规格按钮创建</p>
        <p class="empty-tip">添加规格后系统会自动生成SKU列表</p>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import productApi from '@/api/modules/product'

import {
  createProduct,
  updateProduct,
  getProductDetail,
  uploadProductImage,
  updateSpecImage,
} from '@/api/modules/product'


import { useUserStore } from '@/stores/user'

const props = defineProps({

  productData: {
    type: Array,
    default: () => [],
  },



})

const userStore = useUserStore()

// 判断是新增还是编辑
const isEditMode = computed(() => props.productData.productId !== 0)

// 规格数据
const specifications = ref([])
const skuList = ref([])

const hasSpecifications = computed(() => specifications.value.filter(it => it.isShow === true).length > 0)
const totalSkus = computed(() => skuList.value.length)

const defaultIndex = ref('')
const specRules = {
  SpecName: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
  SpecValue: [{ required: true, message: '请输入规格值', trigger: 'blur' }],
  Price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
}

const handleCellClick = (index) => {
  defaultIndex.value = index
  // 设置默认SKU
  skuList.value.forEach((sku, idx) => {
    sku.isDefault = idx === index ? 1 : 0
  })


}

// 规格操作方法
const addSpecification = () => {

  if (specifications.value[2].isShow === true) {
    ElMessage.info('只能增加3种规格!')
    return
  }
  const sortOrder = specifications.value.filter(it => it.isShow === true).length + 1
  specifications.value.find(it => it.sortOrder === sortOrder).isShow = true
}

const removeSpecification = async (index) => {
  if (index < specifications.value.filter(it => it.isShow === true).length - 1) {
    ElMessage.info('删除规格只能由下往上删除!')
    return
  }

  let ids = '0'
  if (index === 2) {
    const iCount1 = specifications.value[0].specValues.length
    const iCount2 = specifications.value[1].specValues.length
    let idsarray = skuList.value.filter(it => it.sortOrder > iCount1 * iCount2).map(it => it.specId)
    ids = idsarray.join(',')
  }
  if (index === 1) {
    const iCount1 = specifications.value[0].specValues.length
    let idsarray = skuList.value.filter(it => it.sortOrder > iCount1).map(it => it.specId)
    ids = idsarray.join(',')
  }
  if (index === 0) {
    let idsarray = skuList.value.map(it => it.specId)
    ids = idsarray.join(',')
  }
  let res = await DeleteBatchsku(ids, index)
  //删除数据库成功后
  if (res === true) {

    let row = specifications.value.find(it => it.sortOrder === index + 1)

    //删除skuList
    if (index === 2) {
      const iCount1 = specifications.value[0].specValues.length
      const iCount2 = specifications.value[1].specValues.length
      skuList.value = skuList.value.filter(it => it.sortOrder <= iCount1 * iCount2)
    }
    if (index === 1) {
      const iCount1 = specifications.value[0].specValues.length
      skuList.value = skuList.value.filter(it => it.sortOrder <= iCount1)
    }
    if (index === 0) {
      skuList.value = []
    }
    row.isShow = false
    row.specName = ''
    row.specValues = [{ specValue: '' }]
    //再保存一次 明细表
    await handleSubmit()
  }
}

const addSpecValue = (specIndex) => {
  specifications.value[specIndex].specValues.push({ specValue: '' })
}

const removeSpecValue = async (specIndex, valueIndex) => {
  if (specifications.value[specIndex].specValues.length > 1) {
    const specValue = specifications.value[specIndex].specValues[valueIndex].specValue
    let ids = '0'
    if (specIndex === 0) {
      let idsarray = skuList.value.filter(it => it.spec1Value === specValue).map(it => it.specId)
      ids = idsarray.join(',')

    }

    if (specIndex === 1) {
      let idsarray = skuList.value.filter(it => it.spec2Value === specValue).map(it => it.specId)
      ids = idsarray.join(',')

    }

    if (specIndex === 2) {
      let idsarray = skuList.value.filter(it => it.spec3Value === specValue).map(it => it.specId)
      ids = idsarray.join(',')

    }
    let res = await DeleteBatchsku(ids, specIndex, valueIndex)
    //删除数据库成功后
    if (res === true) {
      //删除skuList
      if (specIndex === 0) {
        skuList.value = skuList.value.filter(it => it.spec1Value !== specValue)
      }

      if (specIndex === 1) {
        skuList.value = skuList.value.filter(it => it.spec2Value !== specValue)
      }

      if (specIndex === 2) {
        skuList.value = skuList.value.filter(it => it.spec3Value !== specValue)
      }


      specifications.value[specIndex].specValues.splice(valueIndex, 1)
    }



  }
}






const handleSubmit = async () => {
  // 保存
  // 处理规格数据加序号
  try {
    const productSpec = []
    specifications.value.filter(it => it.isShow === true).forEach((item, index) => {
      productSpec.push({ specName: item.specName, specValues: item.specValues, sortOrder: item.sortOrder })
    })


    const productSpecs = []

    let sepcList = specifications.value.filter(it => it.isShow === true)

    skuList.value.forEach((sku, index) => {

      let specs = {
        specId: sku.specId,
        spec1Name: sku.spec1Name,
        spec1Value: sku.spec1Value,
        spec2Name: (sepcList.length > 1) ? sku.spec2Name : "",
        spec2Value: (sepcList.length > 1) ? sku.spec2Value : "",
        spec3Name: (sepcList.length > 2) ? sku.spec3Name : "",
        spec3Value: (sepcList.length > 2) ? sku.spec3Value : "",
        price: sku.price,
        stock: sku.stock,
        isDefault: sku.isDefault,
        image: sku.image,
        sortOrder: sku.sortOrder
      }
      productSpecs.push(specs)

    })

    const saveData = {
      productId: props.productData.productId,

      appType: userStore.userInfo.appType,
      businessId: userStore.userInfo.businessId,
      productSpec: JSON.stringify(productSpec),
      productSpecs: productSpecs,

    }

    if (isEditMode.value) {
      await updateProduct(saveData)
      const res = await getProductDetail(saveData.productId)
      Object.assign(props.productData, res.result)
      ElMessage.success('商品更新成功')
    } else {
      await createProduct(saveData)
      ElMessage.success('商品添加成功')
    }


  } catch (error) {

  } finally {

  }
}





//批量删除规格并修改主表中的规格
const DeleteBatchsku = async (ids, specIndex, valueIndex) => {
  try {

    await ElMessageBox.confirm(
      `确定要删除商品规格吗？此操作不可恢复！`,
      '删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        center: true
      }
    )
    const productSpec = []

    if (valueIndex) {
      specifications.value.filter(it => it.isShow === true).forEach((item, index) => {
        let values = item.specValues.filter((itx, idexx) => idexx !== valueIndex)
        productSpec.push({ specName: item.specName, specValues: values, sortOrder: item.sortOrder })
      })
    }
    else {

      specifications.value.filter((it, idex) => it.isShow === true && idex !== specIndex).forEach((item, index) => {
        productSpec.push({ specName: item.specName, specValues: item.specValues, sortOrder: item.sortOrder })
      })

    }

    const saveData = {
      productId: props.productData.productId,
      productSpec: JSON.stringify(productSpec),
    }

    await updateProduct(saveData, ids)
    ElMessage.success('删除成功')
    return true
  } catch (error) {
    return false
  }
}

const handlcustomUpload = async (param) => {
  let frmData = new FormData();//json数据
  frmData.append('appType', 1)
  frmData.append('businessId', 1)
  frmData.append('file', param.file)
  const res = await uploadProductImage(frmData)

  return res
}



const handleSkuImageUpload = async (response, sku) => {
  if (response.flag === 1) {
    sku.image = response.result.src


    //修改规格表中的图片
    //保存如果prouctId<>0
    if (formData.productId !== 0) {
      const saveData = {
        specId: sku.specId,
        image: sku.image,
      }

      await updateSpecImage(saveData)
    }








    ElMessage.success('SKU图片上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const beforeImageUpload = (file, sku) => {

  if (sku.specId === 0) {
    ElMessage.info('请先保存规格后再上传图片!')
    return
  }

  const isImage = /^image\/(jpeg|png|gif|webp)$/.test(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB!')
    return false
  }

  return true
}


const beforeImageUpload1 = (file) => {



  const isImage = /^image\/(jpeg|png|gif|webp)$/.test(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB!')
    return false
  }

  return true
}




const handleAddSpec = () => {
  editingSpecId.value = null
  resetSpecForm()
  specDialogVisible.value = true
}

const handleEditSpec = (row) => {
  editingSpecId.value = row.SpecId
  Object.assign(specForm, row)
  specDialogVisible.value = true
}

const handleDeleteSpec = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个规格吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await productApi.deleteSpec(row.SpecId)
    ElMessage.success('删除成功')
    fetchSpecList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除规格失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleSaveSpec = async () => {
  if (!specFormRef.value) return

  try {
    await specFormRef.value.validate()

    const specData = {
      ...specForm,
      ProductId: productId
    }

    if (editingSpecId.value) {
      // 编辑
      await productApi.updateSpec(editingSpecId.value, specData)
      ElMessage.success('更新成功')
    } else {
      // 添加
      await productApi.saveSpecs(productId, [specData])
      ElMessage.success('添加成功')
    }

    specDialogVisible.value = false
    fetchSpecList()
  } catch (error) {
    console.error('保存规格失败:', error)
    ElMessage.error(editingSpecId.value ? '更新失败' : '添加失败')
  }
}

const resetSpecForm = () => {
  Object.assign(specForm, {
    SpecName: '',
    SpecValue: '',
    Price: 0,
    Stock: 0,
    IsDefault: 0,
    AppType: 1
  })
}




// 监听规格变化
watch(specifications, (newvalue, oldvalue) => {

  let price = (props.productData.currentPrice) ? props.productData.currentPrice : 0
  let sepcList = newvalue.filter(it => it.isShow === true)

  let items1 = sepcList.find(spec => spec.sortOrder === 1)
  let items2 = sepcList.find(spec => spec.sortOrder === 2)
  let items3 = sepcList.find(spec => spec.sortOrder === 3)


  if (sepcList.length === 1) {
    items1.specValues.forEach((item1, index1) => {
      let sortOrder = index1 + 1
      let sku = skuList.value.find(it => it.sortOrder === sortOrder)
      if (!sku) {
        skuList.value.push({
          specId: 0, spec1Name: items1.specName, spec1Value: item1.specValue, spec2Name: '', spec2Value: '', spec3Name: '', spec3Value: '',
          price: price, stock: 0, image: '', isDefault: 0, sortOrder: sortOrder
        })
      }
      else {
        sku.spec1Name = items1.specName
        sku.spec1Value = item1.specValue
        sku.spec2Name = ''
        sku.spec2Value = ''
        sku.spec3Name = ''
        sku.spec3Value = ''
      }
    })

  }



  if (sepcList.length === 2) {
    let iCount1 = items1.specValues.length
    for (let [index2, item2] of items2.specValues.entries()) {


      for (let [index1, item1] of items1.specValues.entries()) {
        let sortOrder = index2 * iCount1 + index1 + 1


        let sku = skuList.value.find(it => it.sortOrder === sortOrder)
        if (!sku) {
          skuList.value.push({
            specId: 0, spec1Name: items1.specName, spec1Value: item1.specValue, spec2Name: items2.specName, spec2Value: item2.specValue, spec3Name: '', spec3Value: '',
            price: price, stock: 0, image: '', isDefault: 0, sortOrder: sortOrder
          })
        }
        else {
          sku.spec1Name = items1.specName
          sku.spec1Value = item1.specValue
          sku.spec2Name = items2.specName
          sku.spec2Value = item2.specValue
          sku.spec3Name = ''
          sku.spec3Value = ''
        }
      }
    }
  }


  if (sepcList.length === 3) {
    let iCount1 = items1.specValues.length
    let iCount2 = items2.specValues.length
    for (let [index3, item3] of items3.specValues.entries()) {
      for (let [index2, item2] of items2.specValues.entries()) {
        for (let [index1, item1] of items1.specValues.entries()) {

          let sortOrder = index3 * iCount2 * iCount1 + index2 * iCount1 + index1 + 1

          let sku = skuList.value.find(it => it.sortOrder === sortOrder)
          if (!sku) {
            skuList.value.push({
              specId: 0, spec1Name: items1.specName, spec1Value: item1.specValue, spec2Name: items2.specName, spec2Value: item2.specValue, spec3Name: items3.specName, spec3Value: item3.specValue,
              price: price, stock: 0, image: '', isDefault: 0, sortOrder: sortOrder
            })
          }
          else {
            sku.spec1Name = items1.specName
            sku.spec1Value = item1.specValue
            sku.spec2Name = items2.specName
            sku.spec2Value = item2.specValue
            sku.spec3Name = items3.specName
            sku.spec3Value = item3.specValue
          }
        }
      }
    }
  }





}, { deep: true })









// 监听规格变化当Id发生变化时才监控
watch(
  () => props.productData.productSpec,
  (value) => {
    if (value) {
      // 加载规格数据
      const productSpec = (props.productData.productSpec) ? JSON.parse(props.productData.productSpec) : []
      specifications.value = productSpec

      //数据库里查询出来的表示允许显示 
      for (let item of specifications.value) {
        item.isShow = true
      }
      //循环把空数组补齐参与页面循环渲染
      while (specifications.value.length < 3) {
        specifications.value.push({ specName: '', specValues: [{ specValue: '' }], sortOrder: specifications.value.length + 1, isShow: false })
      }


      // 加载SKU数据
      skuList.value = (props.productData.productSpecs) ? props.productData.productSpecs : []
      for (let [index, item] of skuList.value.entries()) {
        if (item.isDefault === 1) {
          handleCellClick(index)
          break
        }

      }

    }
  },
  {
    // immediate: true,  不立即执行
    deep: true,
  }
);

// 暴露方法给父组件
defineExpose({
  handleSubmit
})




</script>

<style lang="scss" scoped>
.form-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  background: white;

  &:last-child {
    margin-bottom: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    border: none;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .card-icon {
        color: #409eff;
        font-size: 18px;
      }

      .card-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }
  }

  :deep(.el-card__header) {
    padding: 16px 24px;
    border-bottom: 1px solid #f0f2f5;
    background: #fafbfc;
  }

  :deep(.el-card__body) {
    padding: 24px;
  }




  .specifications {
    .empty-spec {
      text-align: center;
      padding: 40px 20px;
      color: #909399;

      .el-icon {
        font-size: 48px;
        margin-bottom: 12px;
        color: #c0c4cc;
      }

      p {
        margin: 0 0 8px 0;
        font-size: 14px;
      }

      .empty-tip {
        font-size: 12px;
        color: #c0c4cc;
      }
    }

    .spec-list {
      .spec-item {
        padding: 16px;
        background: #f8fafc;
        border-radius: 8px;
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        .spec-header {
          margin-bottom: 12px;

          .spec-title {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .spec-actions {
            margin-left: auto;
          }
        }

        .spec-values {
          .values-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .values-label {
              font-size: 14px;
              color: #606266;
              font-weight: 500;
            }
          }

          .values-list {
            .value-item {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 8px;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }

    .sku-section {
      margin-top: 24px;

      .sku-title {
        margin: 0 0 16px 0;
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }

      .sku-table-container {
        overflow-x: auto;
        border: 1px solid #e4e7ed;
        border-radius: 8px;

        .sku-table {
          width: 100%;
          border-collapse: collapse;

          .sku-header {
            padding: 12px;
            background: #f8fafc;
            font-size: 14px;
            font-weight: 600;
            color: #606266;
            border-bottom: 1px solid #e4e7ed;
            text-align: left;
            white-space: nowrap;
          }

          .sku-row {
            &:nth-child(even) {
              background: #fafbfc;
            }

            &:hover {
              background: #f0f7ff;
            }
          }

          .sku-cell {
            padding: 12px;
            border-bottom: 1px solid #e4e7ed;
            font-size: 13px;
            color: #606266;
            white-space: nowrap;

            &:last-child {
              border-right: none;
            }
          }
        }
      }
    }
  }




}
</style>