<template>
  <div class="product-edit-page">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p class="page-subtitle">请填写商品相关信息</p>
        </div>
        <div class="action-buttons">
          <el-button @click="router.back()" size="large" class="back-btn">
            <el-icon>
              <ArrowLeft />
            </el-icon>返回
          </el-button>
          <el-button type="primary" @click="handleSave" :loading="submitting" size="large" class="save-btn">
            <el-icon>
              <Check />
            </el-icon>保存商品
          </el-button>
        </div>
      </div>
    </div>

    <div class="edit-container">
      <div class="form-layout">
        <!-- 左侧主表单 -->
        <div class="main-form">
          <!-- 基本信息卡片 -->
          <el-card class="form-card" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="card-icon">
                    <Goods />
                  </el-icon>
                  <h3 class="card-title">基本信息</h3>
                </div>
              </div>
            </template>

            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" size="default"
              class="compact-form">
              <div class="form-grid">
                <el-form-item label="商品名称" prop="productName">
                  <el-input v-model="formData.productName" placeholder="请输入商品名称" maxlength="100" show-word-limit
                    clearable />
                </el-form-item>

                <el-form-item label="商品分类" prop="categoryId">
                  <el-cascader v-model="formData.categoryId" :options="categoryOptions" :props="props"
                    @change="handlecascaderChange" placeholder="请选择商品分类" clearable size="default"
                    style="width: 300px; margin-right: 10px;" />
                </el-form-item>
              </div>

              <el-form-item label="商品主图">
                <div class="image-upload-area">
                  <el-upload class="main-image-upload" v-model:file-list="productImageList" :auto-upload="false"
                    list-type="picture-card" :multiple="false" :limit="1" accept=".jpg,.png"
                    :on-change="handleChangeFile" :on-remove="handleRemove">

                    <div class="upload-placeholder">
                      <el-icon class="upload-icon">
                        <Camera />
                      </el-icon>
                      <div class="upload-text">点击选中商品主图</div>
                      <div class="upload-tip">建议尺寸：800x800像素</div>
                    </div>

                  </el-upload>

                  <el-button type="primary" @click="handleProductImageUpLoad">
                    <el-icon>
                      <Upload />
                    </el-icon>上传
                  </el-button>

                </div>
                <el-input v-model="formData.productImage" disabled></el-input>

              </el-form-item>
            </el-form>
          </el-card>

          <!-- 价格与库存卡片 -->
          <el-card class="form-card" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="card-icon">
                    <Money />
                  </el-icon>
                  <h3 class="card-title">价格与库存</h3>
                </div>
              </div>
            </template>

            <div class="price-stock-grid">
              <div class="price-item">
                <label class="price-label">原价</label>
                <div class="price-input">
                  <el-input-number v-model="formData.originalPrice" :min="0" :precision="2" placeholder="原价"
                    controls-position="right" size="default" class="price-input-number">
                    <template #prefix>¥</template>
                  </el-input-number>
                </div>
              </div>

              <div class="price-item">
                <label class="price-label">当前售价</label>
                <div class="price-input">
                  <el-input-number v-model="formData.currentPrice" :min="0" :precision="2" placeholder="当前售价"
                    controls-position="right" size="default" class="price-input-number">
                    <template #prefix>¥</template>
                  </el-input-number>
                </div>
              </div>

              <div class="stock-item">
                <label class="stock-label">总库存</label>
                <div class="stock-input">
                  <el-input-number v-model="formData.totalStock" :min="0" placeholder="总库存" controls-position="right"
                    size="default" />
                  <div class="field-tip">0表示不限制</div>
                </div>
              </div>

              <div class="stock-item">
                <label class="stock-label">每人限购</label>
                <div class="stock-input">
                  <el-input-number v-model="formData.perPersonLimit" :min="0" placeholder="每人限购"
                    controls-position="right" size="default" />
                  <div class="field-tip">0表示不限制</div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 商品规格卡片 -->
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
                <div v-for="(spec, index) in specifications.filter(it => it.isShow === true)" :key="index"
                  class="spec-item">
                  <div class="spec-header">
                    <div class="spec-title">
                      <el-input v-model="spec.specName" placeholder="规格名称（如：颜色、尺寸）" size="small"
                        style="width: 150px;" />
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
                            <el-input-number v-if="skuList[index1]" v-model="skuList[index1].price" :min="0"
                              :precision="2" size="small" controls-position="right" style="width: 120px;" />
                          </td>

                          <td class="sku-cell">
                            <el-input-number v-if="skuList[index1]" v-model="skuList[index1].stock" :min="0"
                              size="small" controls-position="right" style="width: 100px;" />
                          </td>


                          <td class="sku-cell" v-if="skuList[index1]" @click="handleCellClick(index1)">
                            <el-radio v-model="defaultIndex" :label="index1" size="small">
                              默认
                            </el-radio>
                          </td>

                          <td class="sku-cell">
                            <el-upload class="sku-image-upload" v-if="skuList[index1]" action="/api/upload/sku-image"
                              :show-file-list="false" :on-success="(res) => handleSkuImageUpload(res, skuList[index1])"
                              :before-upload="beforeImageUpload">
                              <div v-if="skuList[index1].image" class="sku-image-preview">
                                <el-image :src="skuList[index1].image" fit="cover" />
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
                                v-model="skuList[(index2 * specifications[0].specValues.length) + index1].price"
                                :min="0" :precision="2" size="small" controls-position="right" style="width: 120px;" />
                            </td>


                            <td class="sku-cell">
                              <el-input-number v-if="skuList[(index2 * specifications[0].specValues.length) + index1]"
                                v-model="skuList[(index2 * specifications[0].specValues.length) + index1].stock"
                                :min="0" size="small" controls-position="right" style="width: 100px;" />
                            </td>


                            <td class="sku-cell" v-if="skuList[(index2 * specifications[0].specValues.length) + index1]"
                              @click="handleCellClick((index2 * specifications[0].specValues.length) + index1)">
                              <el-radio v-model="defaultIndex"
                                :label="(index2 * specifications[0].specValues.length) + index1" size="small">
                                默认
                              </el-radio>
                            </td>

                            <td class="sku-cell">
                              <el-upload class="sku-image-upload"
                                v-if="skuList[(index2 * specifications[0].specValues.length) + index1]"
                                action="/api/upload/sku-image" :show-file-list="false"
                                :on-success="(res) => handleSkuImageUpload(res, skuList[(index2 * specifications[0].specValues.length) + index1])"
                                :before-upload="beforeImageUpload">
                                <div v-if="skuList[(index2 * specifications[0].specValues.length) + index1].image"
                                  class="sku-image-preview">
                                  <el-image
                                    :src="skuList[(index2 * specifications[0].specValues.length) + index1].image"
                                    fit="cover" />
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
                                    + (index2 * specifications[0].specValues.length) + index1].price" :min="0"
                                  :precision="2" size="small" controls-position="right" style="width: 120px;" />
                              </td>


                              <td class="sku-cell">
                                <el-input-number v-if="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                                  + (index2 * specifications[0].specValues.length) + index1]" v-model="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                                    + (index2 * specifications[0].specValues.length) + index1].stock" :min="0"
                                  size="small" controls-position="right" style="width: 100px;" />
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
                                  + (index2 * specifications[0].specValues.length) + index1]"
                                  action="/api/upload/sku-image" :show-file-list="false" :on-success="(res) => handleSkuImageUpload(res, skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                                    + (index2 * specifications[0].specValues.length) + index1])"
                                  :before-upload="beforeImageUpload">
                                  <div v-if="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                                    + (index2 * specifications[0].specValues.length) + index1].image"
                                    class="sku-image-preview">
                                    <el-image :src="skuList[(index3 * specifications[1].specValues.length * specifications[0].specValues.length)
                                      + (index2 * specifications[0].specValues.length) + index1].image" fit="cover" />
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


                      <!--

                      <tr v-for="(sku, skuIndex) in skuList" :key="skuIndex" class="sku-row">
                        <td v-for="spec in specifications" :key="spec.specName" class="sku-cell">
                          {{ sku['spec' + spec.index + 'Value'] }}
                        </td>
                        <td class="sku-cell">
                          {{ skuIndex + 1 }}

                        </td>

                        <td class="sku-cell">
                          <el-input-number v-model="sku.price" :min="0" :precision="2" size="small"
                            controls-position="right" style="width: 120px;" />
                        </td>
                        <td class="sku-cell">
                          <el-input-number v-model="sku.stock" :min="0" size="small" controls-position="right"
                            style="width: 100px;" />
                        </td>
                        <td class="sku-cell" @click="handleCellClick(skuIndex)">
                          <el-radio v-model="defaultIndex" :label="skuIndex" size="small">
                            默认
                          </el-radio>
                        </td>
                        <td class="sku-cell">
                          <el-upload class="sku-image-upload" action="/api/upload/sku-image" :show-file-list="false"
                            :on-success="(res) => handleSkuImageUpload(res, sku)" :before-upload="beforeImageUpload">
                            <div v-if="sku.image" class="sku-image-preview">
                              <el-image :src="sku.image" fit="cover" />
                            </div>
                            <el-button v-else size="small" type="text">
                              <el-icon>
                                <Picture />
                              </el-icon>上传
                            </el-button>
                          </el-upload>
                        </td>
                        <td class="sku-cell">
                          <el-button @click="handleDeleteskuClick(sku)" size="small" type="text">
                            <el-icon>
                              <Delete />
                            </el-icon>删除
                          </el-button>
                        </td>

                      </tr>

 -->




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

          <!-- 营销活动卡片 -->
          <!-- 
          <el-card class="form-card" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="card-icon">
                    <TrendCharts />
                  </el-icon>
                  <h3 class="card-title">营销活动</h3>
                </div>
              </div>
            </template>

            <div class="marketing-tabs">
              <el-tabs v-model="activeMarketingTab" class="marketing-tabs-content">
           
                <el-tab-pane label="秒杀活动" name="seckill">
                  <div class="activity-form">
                    <el-switch v-model="hasSeckill" :active-value="true" :inactive-value="false" active-text="开启秒杀"
                      inactive-text="关闭秒杀" style="margin-bottom: 20px;" />

                    <div v-if="hasSeckill" class="seckill-form">
                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">秒杀价格</label>
                          <el-input-number v-model="seckillData.SeckillPrice" :min="0" :precision="2"
                            controls-position="right" size="default" style="width: 200px;">
                            <template #prefix>¥</template>
                          </el-input-number>
                        </div>

                        <div class="form-item">
                          <label class="form-label">活动库存</label>
                          <el-input-number v-model="seckillData.ActivityStock" :min="1" controls-position="right"
                            size="default" style="width: 200px;" />
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">开始时间</label>
                          <el-date-picker v-model="seckillData.StartTime" type="datetime" placeholder="选择开始时间"
                            size="default" style="width: 200px;" />
                        </div>

                        <div class="form-item">
                          <label class="form-label">结束时间</label>
                          <el-date-picker v-model="seckillData.EndTime" type="datetime" placeholder="选择结束时间"
                            size="default" style="width: 200px;" />
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">每人限购</label>
                          <el-input-number v-model="seckillData.PerPersonLimit" :min="1" controls-position="right"
                            size="default" style="width: 200px;" />
                        </div>

                        <div class="form-item">
                          <label class="form-label">自动延期</label>
                          <el-switch v-model="seckillData.AutoExtend" :active-value="1" :inactive-value="0"
                            active-text="售罄自动延期" inactive-text="不延期" />
                        </div>
                      </div>

                     
                      <div v-if="hasSpecifications && skuList.length > 0" class="spec-stocks-section">
                        <h4 class="section-title">规格秒杀库存</h4>
                        <div class="spec-stocks-list">
                          <div v-for="(sku, index) in skuList" :key="index" class="spec-stock-item">
                            <div class="spec-info">
                              <span class="spec-name">{{ sku.specs.join(' / ') }}</span>
                            </div>
                            <div class="stock-controls">
                              <el-input-number v-model="seckillSpecStocks[index]" :min="0" :max="sku.Stock"
                                placeholder="秒杀库存" size="small" style="width: 120px;" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>

           
                <el-tab-pane label="团购活动" name="groupbuy">
                  <div class="activity-form">
                    <el-switch v-model="hasGroupBuy" :active-value="true" :inactive-value="false" active-text="开启团购"
                      inactive-text="关闭团购" style="margin-bottom: 20px;" />

                    <div v-if="hasGroupBuy" class="groupbuy-form">
                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">团购价格</label>
                          <el-input-number v-model="groupBuyData.GroupBuyPrice" :min="0" :precision="2"
                            controls-position="right" size="default" style="width: 200px;">
                            <template #prefix>¥</template>
                          </el-input-number>
                        </div>

                        <div class="form-item">
                          <label class="form-label">成团人数</label>
                          <el-input-number v-model="groupBuyData.PeopleNumber" :min="2" :max="15"
                            controls-position="right" size="default" style="width: 200px;" />
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">成团期限</label>
                          <el-input-number v-model="groupBuyData.ExpireHours" :min="1" :max="720"
                            controls-position="right" size="default" style="width: 200px;">
                            <template #suffix>小时</template>
                          </el-input-number>
                        </div>

                        <div class="form-item">
                          <label class="form-label">每人限购</label>
                          <el-input-number v-model="groupBuyData.PerPersonLimit" :min="1" controls-position="right"
                            size="default" style="width: 200px;" />
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">自动成团</label>
                          <el-switch v-model="groupBuyData.AutoComplete" :active-value="1" :inactive-value="0"
                            active-text="自动成团" inactive-text="手动成团" />
                        </div>

                        <div class="form-item">
                          <label class="form-label">退款比例</label>
                          <el-input-number v-model="groupBuyData.RefundRate" :min="0" :max="100" :precision="2"
                            controls-position="right" size="default" style="width: 200px;">
                            <template #suffix>%</template>
                          </el-input-number>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
            -->
          <!-- 商品详情卡片 -->
          <el-card class="form-card" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="card-icon">
                    <Document />
                  </el-icon>
                  <h3 class="card-title">商品详情</h3>
                </div>
              </div>
            </template>

            <div class="editor-section">
              <div class="editor-toolbar">
                <div class="toolbar-left">
                  <el-button-group>
                    <el-button @click="insertText('h1')" size="small" type="text">H1</el-button>
                    <el-button @click="insertText('h2')" size="small" type="text">H2</el-button>
                    <el-button @click="insertText('h3')" size="small" type="text">H3</el-button>
                    <el-button @click="insertText('p')" size="small" type="text">段落</el-button>
                    <el-button @click="insertImage" size="small" type="text">图片</el-button>
                  </el-button-group>
                </div>




                <el-upload class="editor-image-upload" action="/api/upload/content-image" :show-file-list="false"
                  :on-success="handleEditorImageUpload" :before-upload="beforeImageUpload">
                  <el-button size="small" type="primary">
                    <el-icon>
                      <Upload />
                    </el-icon>上传图片
                  </el-button>
                </el-upload>
              </div>

              <div class="editor-container">
                <textarea ref="editorRef" v-model="formData.productContent" placeholder="请输入商品详情描述，支持HTML格式..."
                  class="rich-editor" @input="handleEditorInput"></textarea>
              </div>

              <div class="preview-section" v-if="formData.productContent">
                <h4 class="preview-title">预览：</h4>
                <div class="preview-content" v-html="formData.productContent"></div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 右侧设置面板 -->
        <div class="side-panel">
          <!-- 状态设置 -->
          <el-card class="side-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon>
                  <Setting />
                </el-icon>
                <h3 class="card-title">状态设置</h3>
              </div>
            </template>

            <div class="settings-list">
              <div class="setting-item">
                <span class="setting-label">商品状态</span>
                <el-switch v-model="formData.productStatus" :active-value="1" :inactive-value="0" active-text="上架"
                  inactive-text="下架" />
              </div>

              <div class="setting-item">
                <span class="setting-label">显示价格</span>
                <el-switch v-model="formData.showPrice" :active-value="1" :inactive-value="0" active-text="显示"
                  inactive-text="隐藏" />
              </div>

              <div class="setting-item">
                <span class="setting-label">防刷单</span>
                <el-switch v-model="formData.antiRefresh" :active-value="1" :inactive-value="0" active-text="开启"
                  inactive-text="关闭" />
              </div>

              <div class="setting-item" v-if="formData.AntiRefresh">
                <span class="setting-label">每日最大订单</span>
                <el-input-number v-model="formData.maxDailyOrders" :min="0" controls-position="right" size="small"
                  style="width: 120px;" />
              </div>

              <div class="setting-item">
                <span class="setting-label">排序</span>
                <el-input-number v-model="formData.sortOrder" :min="0" :max="9999" controls-position="right"
                  size="small" style="width: 120px;" />
              </div>
            </div>
          </el-card>

          <!-- 分销设置 -->
          <el-card class="side-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon>
                  <Share />
                </el-icon>
                <h3 class="card-title">分销设置</h3>
              </div>
            </template>

            <div class="settings-list">
              <div class="setting-item">
                <span class="setting-label">开启返佣</span>
                <el-switch v-model="formData.commissionEnabled" :active-value="1" :inactive-value="0" active-text="开启"
                  inactive-text="关闭" @change="handleCommissionChange" />
              </div>

              <div v-if="formData.CommissionEnabled" class="commission-settings">
                <div class="setting-item">
                  <span class="setting-label">一级分佣</span>
                  <div class="rate-input">
                    <el-input-number v-model="formData.firstLevelRate" :min="0" :max="100" :precision="2"
                      controls-position="right" size="small" style="width: 100px;" />
                    <span class="rate-suffix">%</span>
                  </div>
                </div>

                <div class="setting-item">
                  <span class="setting-label">二级分佣</span>
                  <div class="rate-input">
                    <el-input-number v-model="formData.secondLevelRate" :min="0" :max="100" :precision="2"
                      controls-position="right" size="small" style="width: 100px;" />
                    <span class="rate-suffix">%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Check, Upload, Delete, Picture,
  Camera, Goods, Money, Document, Setting,
  Share, SetUp, Plus, Close, Box,
  TrendCharts
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

import {
  getProductDetail,
  createProduct,
  updateProduct,
  getCategoryOptions,
  deleteProductSpecs,
  deleteBatchProductSpecs,
  uploadProductImage,
} from '@/api/modules/product'
import { it } from 'element-plus/es/locales.mjs'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const editorRef = ref()
const submitting = ref(false)
const categoryOptions = ref([])
const activeMarketingTab = ref('seckill')
const defaultIndex = ref('')
const productImageList = ref([])
const hideUpload = ref(false)
const userStore = useUserStore()
const props = {

  label: 'categoryName',
  value: 'categoryId',
  children: 'children'
}


// 规格数据
const specifications = ref([])
const skuList = ref([])


// 营销活动数据
const hasSeckill = ref(false)
const hasGroupBuy = ref(false)
const seckillData = reactive({
  SeckillPrice: 0,
  ActivityStock: 100,
  StartTime: '',
  EndTime: '',
  PerPersonLimit: 1,
  AutoExtend: 0
})
const groupBuyData = reactive({
  GroupBuyPrice: 0,
  PeopleNumber: 2,
  ExpireHours: 24,
  PerPersonLimit: 1,
  AutoComplete: 1,
  RefundRate: 100
})
const seckillSpecStocks = ref([])

// 判断是新增还是编辑
const isEditMode = computed(() => !!route.query.id)
const pageTitle = computed(() => isEditMode.value ? '编辑商品' : '添加商品')
const hasSpecifications = computed(() => specifications.value.filter(it => it.isShow === true).length > 0)
const totalSkus = computed(() => skuList.value.length)


// 表单数据
const formData = reactive({
  productId: 0,
  productName: '',
  categoryId: '',
  treePath: '',
  productImage: '',
  originalPrice: 0,
  currentPrice: 0,
  totalStock: 0,
  perPersonLimit: 0,
  productContent: '',
  showPrice: 1,
  productStatus: 1,
  commissionEnabled: 0,
  firstLevelRate: 0,
  secondLevelRate: 0,
  antiRefresh: 0,
  maxDailyOrders: 0,
  sortOrder: 0
})

// 表单验证规则
const formRules = {
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在2到100个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  originalPrice: [
    { required: true, message: '请输入原价', trigger: 'blur' },
    { type: 'number', min: 0, message: '原价不能为负数', trigger: 'blur' }
  ],
  currentPrice: [
    { required: true, message: '请输入当前售价', trigger: 'blur' },
    { type: 'number', min: 0, message: '售价不能为负数', trigger: 'blur' }
  ]
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
  let res = await DeleteBatchsku(ids)
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
    let res = await DeleteBatchsku(ids)
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

const handlecascaderChange = (value) => {
  //生成TreePath
  console.log(value)
  if (value == null)
    formData.treePath = ''
  else
    formData.treePath = value.join('.')
}

// 生成SKU列表
const generateSkuList = () => {
  /*
    const validSpecs = specifications.value.filter(spec =>
      spec.specName && spec.specValues.filter(v => v.specValue.trim()).length > 0
    )
  
    if (validSpecs.length === 0) {
      skuList.value = []
      seckillSpecStocks.value = []
      return
    }
      */




  // 初始化秒杀规格库存
  seckillSpecStocks.value = skuList.value.map(sku => Math.min(sku.Stock, 50))
}


// 监听规格变化
watch(specifications, () => {
  let price = (formData.currentPrice) ? formData.currentPrice : 0
  let sepcList = specifications.value.filter(it => it.isShow === true)

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

// 监听价格变化，更新SKU价格
watch(() => formData.currentPrice, (newPrice) => {
  if (skuList.value.length > 0) {
    skuList.value.forEach(sku => {
      if (!sku.customPrice) {
        sku.price = newPrice
      }
    })
  }
})

// 编辑器相关方法
const insertText = (type) => {
  const editor = editorRef.value
  if (!editor) return

  const start = editor.selectionStart
  const end = editor.selectionEnd
  const selectedText = formData.ProductContent.substring(start, end)

  let wrapper = ''
  switch (type) {
    case 'h1':
      wrapper = '<h1 class="detail-title">$1</h1>'
      break
    case 'h2':
      wrapper = '<h2 class="detail-subtitle">$1</h2>'
      break
    case 'h3':
      wrapper = '<h3 class="detail-heading">$1</h3>'
      break
    case 'p':
      wrapper = '<p class="detail-paragraph">$1</p>'
      break
  }

  const newText = wrapper.replace('$1', selectedText || '新内容')
  formData.ProductContent =
    formData.ProductContent.substring(0, start) +
    newText +
    formData.ProductContent.substring(end)

  nextTick(() => {
    editor.focus()
    const newPos = start + newText.length
    editor.setSelectionRange(newPos, newPos)
  })
}

const insertImage = () => {
  const start = editorRef.value.selectionStart
  const imgTag = '<img src="" alt="图片描述" class="detail-image">'
  formData.ProductContent =
    formData.ProductContent.substring(0, start) +
    imgTag +
    formData.ProductContent.substring(start)

  nextTick(() => {
    editorRef.value.focus()
    const newPos = start + imgTag.length
    editorRef.value.setSelectionRange(newPos, newPos)
  })
}

const handleEditorInput = () => {
  // 可以添加实时预览或其他处理
}

const handleCellClick = (index) => {
  defaultIndex.value = index
  // 设置默认SKU
  skuList.value.forEach((sku, idx) => {
    sku.isDefault = idx === index ? 1 : 0
  })


}
//删除规格
const handleDeleteskuClick = async (row) => {
  try {
    let hintstr = row.spec1Value
    hintstr = hintstr + ((row.spec2Value) ? row.spec2Value : '')
    hintstr = hintstr + ((row.spec3Value) ? row.spec3Value : '')
    await ElMessageBox.confirm(
      `确定要删除商品规格"${hintstr}"吗？此操作不可恢复！`,
      '删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        center: true
      }
    )

    await deleteProductSpecs(row.specId)
    const index = skuList.value.findIndex(it => it.specId === row.specId)
    skuList.value.splice(index, 1)
    ElMessage.success('删除成功')
  } catch (error) {

  }
}

//批量删除规格并修改主表中的规格
const DeleteBatchsku = async (ids) => {
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


    const saveData = {
      productId: formData.productId,
      productSpec: JSON.stringify(productSpec),
    }

    await updateProduct(saveData, ids)
    ElMessage.success('删除成功')
    return true
  } catch (error) {
    return false
  }
}




const handleEditorImageUpload = (response) => {
  if (response.code === 0) {
    const imgTag = `<img src="${response.data.url}" alt="图片描述" class="detail-image">`
    const start = editorRef.value.selectionStart
    formData.ProductContent =
      formData.ProductContent.substring(0, start) +
      imgTag +
      formData.ProductContent.substring(start)

    ElMessage.success('图片插入成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 分佣开关变化
const handleCommissionChange = (val) => {
  if (val === 0) {
    formData.FirstLevelRate = 0
    formData.SecondLevelRate = 0
  }
}

// 图片上传
const handleProductImageUpLoad = async () => {
  if (productImageList.value.length === 0) {
    ElMessage.info('请选择图片!')
    return
  }

  try {


    let frmData = new FormData();//json数据
    frmData.append('appType', 1)
    frmData.append('businessId', 1)

    let file = productImageList.value[0]
    if (file.raw !== undefined)
      frmData.append('file', file.raw)
    else {

      ElMessage.info('请重新选择图片!')
      return

    }


    const res = await uploadProductImage(frmData)

    formData.productImage = res.result.src

    //保存如果prouctId<>0
    if (formData.productId !== 0) {
      const saveData = {
        productId: formData.productId,
        productImage: formData.productImage,
      }

      await updateProduct(saveData)
    }
    ElMessage.success('主图上传成功')
  }

  catch (error) {

  }




}

const handleChangeFile = (file) => {
  if (!file.raw) {
    ElMessage.error(`文件打开失败!`)

    return
  }
  hideUpload.value = true

}

const handleRemove = () => {
  formData.productImage = ''
  hideUpload.value = false

}





const handleSkuImageUpload = (response, sku) => {
  if (response.code === 0) {
    sku.Image = response.data.url
    ElMessage.success('SKU图片上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const beforeImageUpload = (file) => {
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

// 保存商品
const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 处理规格数据加序号

    const productSpec = []
    specifications.value.filter(it => it.isShow === true).forEach((item, index) => {
      productSpec.push({ specName: item.specName, specValues: item.specValues, sortOrder: item.sortOrder })
    })


    const productSpecs = []

    skuList.value.forEach((sku, index) => {

      let specs = {
        specId: sku.specId,
        spec1Name: sku.spec1Name,
        spec1Value: sku.spec1Value,
        spec2Name: sku.spec2Name,
        spec2Value: sku.spec2Value,
        spec3Name: sku.spec3Name,
        spec3Value: sku.spec3Value,
        price: sku.price,
        stock: sku.stock,
        isDefault: sku.isDefault,
        image: sku.image,
        sortOrder: sku.sortOrder
      }


      /*
            productSpec.forEach(obj => {
              Object(specs)['spec' + obj.sortOrder + 'Name'] = obj.specName
              Object(specs)['spec' + obj.sortOrder + 'Value'] = obj.specValues[index].specValue
            })
         */
      productSpecs.push(specs)

    })

    // 处理营销活动数据
    const marketingData = {
      seckill: hasSeckill.value ? {
        ...seckillData,
        specStocks: seckillSpecStocks.value.map((stock, index) => ({
          specIndex: index,
          activityStock: stock
        }))
      } : null,
      groupBuy: hasGroupBuy.value ? groupBuyData : null
    }

    submitting.value = true



    const saveData = {
      productId: formData.productId,
      productName: formData.productName,
      categoryId: Array.isArray(formData.categoryId) ? formData.categoryId[formData.categoryId.length - 1] : formData.categoryId,
      treePath: formData.treePath,
      productImage: formData.productImage,
      originalPrice: formData.originalPrice,
      currentPrice: formData.currentPrice,
      totalStock: formData.totalStock,
      perPersonLimit: formData.perPersonLimit,
      productContent: formData.productContent,
      showPrice: formData.showPrice,
      productStatus: formData.productStatus,
      commissionEnabled: formData.commissionEnabled,
      firstLevelRate: formData.firstLevelRate,
      secondLevelRate: formData.secondLevelRate,
      antiRefresh: formData.antiRefresh,
      maxDailyOrders: formData.antiRefresh,
      sortOrder: formData.sortOrder,


      appType: userStore.userInfo.appType,
      businessId: userStore.userInfo.businessId,
      productSpec: JSON.stringify(productSpec),
      productSpecs: productSpecs,
      marketing: marketingData
    }

    if (isEditMode.value) {
      await updateProduct(saveData)
      ElMessage.success('商品更新成功')
    } else {
      await createProduct(saveData)
      ElMessage.success('商品添加成功')
    }

    // 返回列表页
    setTimeout(() => {
      router.push('/product')
    }, 1000)
  } catch (error) {

  } finally {
    submitting.value = false
  }
}

// 加载数据
const loadData = async () => {
  if (isEditMode.value) {
    try {
      const res = await getProductDetail(route.query.id)


      Object.assign(formData, res.result)

      //加载图片
      productImageList.value = []

      const url = formData.productImage
      if (url !== '') {
        productImageList.value.push({ url: url });
      }

      // 加载规格数据
      const productSpec = (res.result.productSpec) ? JSON.parse(res.result.productSpec) : []
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
      skuList.value = (res.result.productSpecs) ? res.result.productSpecs : []
      for (let [index, item] of skuList.value.entries()) {
        if (item.isDefault === 1) {
          handleCellClick(index)
          break
        }

      }


      // 加载营销活动数据
      if (res.result.Marketing) {
        if (res.result.Marketing.seckill) {
          hasSeckill.value = true
          Object.assign(seckillData, res.result.Marketing.seckill)
        }
        if (res.result.Marketing.groupBuy) {
          hasGroupBuy.value = true
          Object.assign(groupBuyData, res.result.Marketing.groupBuy)
        }
      }
    } catch (error) {
      console.error('加载商品详情失败:', error)
      ElMessage.error('加载商品详情失败')
    }
  }
  else {
    formData.productId = 0
  }
}



const fetchCategoryOptions = async () => {
  try {
    const appType = userStore.userInfo.appType
    const businessId = userStore.userInfo.businessId
    let params = { appType: appType, businessId: businessId }
    const res = await getCategoryOptions(params)
    categoryOptions.value = res.result || []
  } catch (error) {

  }
}

onMounted(() => {
  fetchCategoryOptions()
  loadData()
})
</script>

<style lang="scss" scoped>
.product-edit-page {
  background: #f5f7fa;
  min-height: 82vh;

  .page-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 24px 32px;
    margin-bottom: 12px;

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title-section {
        .page-title {
          margin: 0;
          color: white;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .page-subtitle {
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
        }
      }

      .action-buttons {
        display: flex;
        gap: 12px;

        .back-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;

          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        }

        .save-btn {
          background: white;
          color: #667eea;
          border: none;
          font-weight: 500;

          &:hover {
            background: rgba(255, 255, 255, 0.9);
          }
        }
      }
    }
  }

  .edit-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px 32px;
    height: calc(82vh - 120px);
    overflow-y: auto;

    .form-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 24px;
    }
  }

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
  }

  .compact-form {
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;

      .el-form-item {
        margin-bottom: 0;
      }

      .el-form-item__label {
        font-weight: 500;
        color: #606266;
      }
    }
  }

  .price-stock-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    .price-item,
    .stock-item {

      .price-label,
      .stock-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
      }

      .price-input,
      .stock-input {
        display: flex;
        align-items: center;
        gap: 8px;

        .price-input-number {
          width: 100%;
        }

        .field-tip {
          font-size: 12px;
          color: #909399;
          white-space: nowrap;
        }
      }
    }
  }

  .image-upload-area {
    .main-image-upload {
      width: 100%;

      .image-preview {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 8px;
        overflow: hidden;

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;

          &:hover {
            opacity: 1;
          }
        }
      }

      .upload-placeholder {
        width: 120px;
        height: 120px;
        border: 2px dashed #dcdfe6;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: border-color 0.3s;

        &:hover {
          border-color: #409eff;
        }

        .upload-icon {
          font-size: 32px;
          color: #c0c4cc;
          margin-bottom: 8px;
        }

        .upload-text {
          font-size: 14px;
          color: #606266;
          margin-bottom: 4px;
        }

        .upload-tip {
          font-size: 12px;
          color: #909399;
          text-align: center;
          line-height: 1.4;
        }
      }
    }

    .image-actions {
      margin-top: 8px;
    }
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

  .marketing-tabs {
    :deep(.el-tabs__nav-wrap) {
      &::after {
        background-color: #e4e7ed;
      }
    }

    :deep(.el-tabs__item) {
      font-size: 14px;
      font-weight: 500;
    }

    .activity-form {
      .form-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 20px;

        .form-item {
          .form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #606266;
          }
        }
      }

      .seckill-form,
      .groupbuy-form {
        padding: 16px;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e4e7ed;
      }

      .spec-stocks-section {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #e4e7ed;

        .section-title {
          margin: 0 0 16px 0;
          font-size: 14px;
          font-weight: 600;
          color: #303133;
        }

        .spec-stocks-list {
          .spec-stock-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e4e7ed;
            margin-bottom: 8px;

            &:last-child {
              margin-bottom: 0;
            }

            .spec-info {
              .spec-name {
                font-size: 13px;
                color: #606266;
              }
            }

            .stock-controls {
              display: flex;
              align-items: center;
              gap: 12px;
            }
          }
        }
      }
    }
  }

  .editor-section {
    .editor-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 6px;
      border: 1px solid #e4e7ed;
    }

    .editor-container {
      .rich-editor {
        width: 100%;
        min-height: 300px;
        padding: 16px;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        font-size: 14px;
        line-height: 1.6;
        resize: vertical;
        background: #fafafa;

        &:focus {
          outline: none;
          border-color: #409eff;
          background: white;
        }
      }
    }

    .preview-section {
      margin-top: 24px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 6px;
      border: 1px solid #e4e7ed;

      .preview-title {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: #606266;
      }

      .preview-content {
        :deep(.detail-title) {
          margin: 16px 0;
          font-size: 20px;
          font-weight: 600;
          color: #303133;
        }

        :deep(.detail-subtitle) {
          margin: 14px 0;
          font-size: 18px;
          font-weight: 600;
          color: #303133;
        }

        :deep(.detail-heading) {
          margin: 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }

        :deep(.detail-paragraph) {
          margin: 10px 0;
          font-size: 14px;
          line-height: 1.8;
          color: #606266;
        }

        :deep(.detail-image) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 12px 0;
        }
      }
    }
  }

  .side-panel {
    .side-card {
      margin-bottom: 20px;
      border-radius: 12px;
      border: 1px solid #e4e7ed;
      background: white;

      &:last-child {
        margin-bottom: 0;
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0;

        .el-icon {
          color: #409eff;
          font-size: 18px;
        }

        .card-title {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #303133;
        }
      }

      :deep(.el-card__header) {
        padding: 16px 20px;
        border-bottom: 1px solid #f0f2f5;
        background: #fafbfc;
      }

      :deep(.el-card__body) {
        padding: 20px;
      }
    }

    .settings-list {
      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f2f5;

        &:last-child {
          border-bottom: none;
        }

        .setting-label {
          font-size: 14px;
          color: #606266;
        }

        .rate-input {
          display: flex;
          align-items: center;
          gap: 4px;

          .rate-suffix {
            font-size: 12px;
            color: #909399;
          }
        }
      }

      .commission-settings {
        margin-top: 8px;
        padding: 12px;
        background: #f8fafc;
        border-radius: 6px;
        border: 1px solid #e4e7ed;

        .setting-item {
          padding: 8px 0;
          border-bottom: 1px solid #e4e7ed;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 1200px) {
  .product-edit-page {
    .edit-container {
      padding: 0 16px 24px;

      .form-layout {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    .compact-form {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    .price-stock-grid {
      grid-template-columns: 1fr;
    }

    .marketing-tabs {
      .activity-form {
        .form-row {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .page-header {
    .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      .action-buttons {
        width: 100%;
        justify-content: flex-end;
      }
    }
  }

  .sku-table-container {
    font-size: 12px;

    .sku-table {
      min-width: 800px;
    }
  }
}
</style>