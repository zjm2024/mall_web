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
            <el-icon><ArrowLeft /></el-icon>返回
          </el-button>
          <el-button 
            type="primary" 
            @click="handleSave" 
            :loading="submitting" 
            size="large"
            class="save-btn"
          >
            <el-icon><Check /></el-icon>保存商品
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
                  <el-icon class="card-icon"><Goods /></el-icon>
                  <h3 class="card-title">基本信息</h3>
                </div>
              </div>
            </template>
            
            <el-form
              ref="formRef"
              :model="formData"
              :rules="formRules"
              label-width="100px"
              size="default"
              class="compact-form"
            >
              <div class="form-grid">
                <el-form-item label="商品名称" prop="ProductName">
                  <el-input
                    v-model="formData.ProductName"
                    placeholder="请输入商品名称"
                    maxlength="100"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                
                <el-form-item label="商品分类" prop="CategoryId">
                  <el-select
                    v-model="formData.CategoryId"
                    placeholder="请选择商品分类"
                    clearable
                  >
                    <el-option
                      v-for="category in categoryOptions"
                      :key="category.CategoryId"
                      :label="category.CategoryName"
                      :value="category.CategoryId"
                    />
                  </el-select>
                </el-form-item>
              </div>
              
              <el-form-item label="商品主图">
                <div class="image-upload-area">
                  <el-upload
                    class="main-image-upload"
                    action="/api/upload/product-image"
                    :show-file-list="false"
                    :on-success="handleImageUploadSuccess"
                    :before-upload="beforeImageUpload"
                  >
                    <div v-if="formData.ProductImage" class="image-preview">
                      <el-image
                        :src="formData.ProductImage"
                        fit="cover"
                        class="preview-image"
                      />
                      <div class="image-overlay">
                        <el-button type="primary" size="small" circle>
                          <el-icon><Camera /></el-icon>
                        </el-button>
                      </div>
                    </div>
                    <div v-else class="upload-placeholder">
                      <el-icon class="upload-icon"><Camera /></el-icon>
                      <div class="upload-text">点击上传商品主图</div>
                      <div class="upload-tip">建议尺寸：800x800像素</div>
                    </div>
                  </el-upload>
                  <div class="image-actions" v-if="formData.ProductImage">
                    <el-button type="danger" @click="formData.ProductImage = ''" text size="small">
                      <el-icon><Delete /></el-icon>删除
                    </el-button>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 价格与库存卡片 -->
          <el-card class="form-card" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="card-icon"><Money /></el-icon>
                  <h3 class="card-title">价格与库存</h3>
                </div>
              </div>
            </template>
            
            <div class="price-stock-grid">
              <div class="price-item">
                <label class="price-label">原价</label>
                <div class="price-input">
                  <el-input-number
                    v-model="formData.OriginalPrice"
                    :min="0"
                    :precision="2"
                    placeholder="原价"
                    controls-position="right"
                    size="default"
                    class="price-input-number"
                  >
                    <template #prefix>¥</template>
                  </el-input-number>
                </div>
              </div>
              
              <div class="price-item">
                <label class="price-label">当前售价</label>
                <div class="price-input">
                  <el-input-number
                    v-model="formData.CurrentPrice"
                    :min="0"
                    :precision="2"
                    placeholder="当前售价"
                    controls-position="right"
                    size="default"
                    class="price-input-number"
                  >
                    <template #prefix>¥</template>
                  </el-input-number>
                </div>
              </div>
              
              <div class="stock-item">
                <label class="stock-label">总库存</label>
                <div class="stock-input">
                  <el-input-number
                    v-model="formData.TotalStock"
                    :min="0"
                    placeholder="总库存"
                    controls-position="right"
                    size="default"
                  />
                  <div class="field-tip">0表示不限制</div>
                </div>
              </div>
              
              <div class="stock-item">
                <label class="stock-label">每人限购</label>
                <div class="stock-input">
                  <el-input-number
                    v-model="formData.PerPersonLimit"
                    :min="0"
                    placeholder="每人限购"
                    controls-position="right"
                    size="default"
                  />
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
                  <el-icon class="card-icon"><SetUp /></el-icon>
                  <h3 class="card-title">商品规格</h3>
                  <el-tag size="small" v-if="hasSpecifications" type="success">
                    {{ totalSkus }}个SKU
                  </el-tag>
                </div>
                <el-button type="primary" @click="addSpecification" size="small" link>
                  <el-icon><Plus /></el-icon>添加规格
                </el-button>
              </div>
            </template>
            
            <div class="specifications">
              <!-- 规格设置 -->
              <div v-if="specifications.length > 0" class="spec-list">
                <div v-for="(spec, index) in specifications" :key="index" class="spec-item">
                  <div class="spec-header">
                    <div class="spec-title">
                      <el-input
                        v-model="spec.SpecName"
                        placeholder="规格名称（如：颜色、尺寸）"
                        size="small"
                        style="width: 150px;"
                        @blur="generateSkuList"
                      />
                      <div class="spec-actions">
                        <el-button
                          type="danger"
                          @click="removeSpecification(index)"
                          size="small"
                          text
                          circle
                        >
                          <el-icon><Close /></el-icon>
                        </el-button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="spec-values">
                    <div class="values-header">
                      <span class="values-label">规格值：</span>
                      <el-button @click="addSpecValue(index)" size="small" text>
                        <el-icon><Plus /></el-icon>添加值
                      </el-button>
                    </div>
                    
                    <div class="values-list">
                      <div v-for="(value, valueIndex) in spec.SpecValues" :key="valueIndex" class="value-item">
                        <el-input
                          v-model="spec.SpecValues[valueIndex]"
                          placeholder="输入规格值"
                          size="small"
                          style="flex: 1;"
                          @blur="generateSkuList"
                        />
                        <el-button
                          @click="removeSpecValue(index, valueIndex)"
                          size="small"
                          text
                          circle
                          v-if="spec.SpecValues.length > 1"
                        >
                          <el-icon><Close /></el-icon>
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- SKU列表 -->
              <div v-if="skuList.length > 0" class="sku-section">
                <h4 class="sku-title">SKU列表管理</h4>
                <div class="sku-table-container">
                  <table class="sku-table">
                    <thead>
                      <tr>
                        <th v-for="spec in specifications" :key="spec.SpecName" class="sku-header">
                          {{ spec.SpecName }}
                        </th>
                        <th class="sku-header">价格</th>
                        <th class="sku-header">库存</th>
                        <th class="sku-header">默认</th>
                        <th class="sku-header">图片</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(sku, skuIndex) in skuList" :key="skuIndex" class="sku-row">
                        <td v-for="(specValue, idx) in sku.specs" :key="idx" class="sku-cell">
                          {{ specValue }}
                        </td>
                        <td class="sku-cell">
                          <el-input-number
                            v-model="sku.Price"
                            :min="0"
                            :precision="2"
                            size="small"
                            controls-position="right"
                            style="width: 120px;"
                          />
                        </td>
                        <td class="sku-cell">
                          <el-input-number
                            v-model="sku.Stock"
                            :min="0"
                            size="small"
                            controls-position="right"
                            style="width: 100px;"
                          />
                        </td>
                        <td class="sku-cell">
                          <el-radio 
                            v-model="defaultSkuId" 
                            :label="skuIndex"
                            size="small"
                            @change="setDefaultSku(skuIndex)"
                          >
                            默认
                          </el-radio>
                        </td>
                        <td class="sku-cell">
                          <el-upload
                            class="sku-image-upload"
                            action="/api/upload/sku-image"
                            :show-file-list="false"
                            :on-success="(res) => handleSkuImageUpload(res, sku)"
                            :before-upload="beforeImageUpload"
                          >
                            <div v-if="sku.Image" class="sku-image-preview">
                              <el-image :src="sku.Image" fit="cover" />
                            </div>
                            <el-button v-else size="small" type="text">
                              <el-icon><Picture /></el-icon>上传
                            </el-button>
                          </el-upload>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div v-else class="empty-spec">
                <el-icon><Box /></el-icon>
                <p>暂无规格，点击添加规格按钮创建</p>
                <p class="empty-tip">添加规格后系统会自动生成SKU列表</p>
              </div>
            </div>
          </el-card>

          <!-- 营销活动卡片 -->
          <el-card class="form-card" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="card-icon"><TrendCharts /></el-icon>
                  <h3 class="card-title">营销活动</h3>
                </div>
              </div>
            </template>
            
            <div class="marketing-tabs">
              <el-tabs v-model="activeMarketingTab" class="marketing-tabs-content">
                <!-- 秒杀活动 -->
                <el-tab-pane label="秒杀活动" name="seckill">
                  <div class="activity-form">
                    <el-switch
                      v-model="hasSeckill"
                      :active-value="true"
                      :inactive-value="false"
                      active-text="开启秒杀"
                      inactive-text="关闭秒杀"
                      style="margin-bottom: 20px;"
                    />
                    
                    <div v-if="hasSeckill" class="seckill-form">
                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">秒杀价格</label>
                          <el-input-number
                            v-model="seckillData.SeckillPrice"
                            :min="0"
                            :precision="2"
                            controls-position="right"
                            size="default"
                            style="width: 200px;"
                          >
                            <template #prefix>¥</template>
                          </el-input-number>
                        </div>
                        
                        <div class="form-item">
                          <label class="form-label">活动库存</label>
                          <el-input-number
                            v-model="seckillData.ActivityStock"
                            :min="1"
                            controls-position="right"
                            size="default"
                            style="width: 200px;"
                          />
                        </div>
                      </div>
                      
                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">开始时间</label>
                          <el-date-picker
                            v-model="seckillData.StartTime"
                            type="datetime"
                            placeholder="选择开始时间"
                            size="default"
                            style="width: 200px;"
                          />
                        </div>
                        
                        <div class="form-item">
                          <label class="form-label">结束时间</label>
                          <el-date-picker
                            v-model="seckillData.EndTime"
                            type="datetime"
                            placeholder="选择结束时间"
                            size="default"
                            style="width: 200px;"
                          />
                        </div>
                      </div>
                      
                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">每人限购</label>
                          <el-input-number
                            v-model="seckillData.PerPersonLimit"
                            :min="1"
                            controls-position="right"
                            size="default"
                            style="width: 200px;"
                          />
                        </div>
                        
                        <div class="form-item">
                          <label class="form-label">自动延期</label>
                          <el-switch
                            v-model="seckillData.AutoExtend"
                            :active-value="1"
                            :inactive-value="0"
                            active-text="售罄自动延期"
                            inactive-text="不延期"
                          />
                        </div>
                      </div>
                      
                      <!-- 秒杀规格库存 -->
                      <div v-if="hasSpecifications && skuList.length > 0" class="spec-stocks-section">
                        <h4 class="section-title">规格秒杀库存</h4>
                        <div class="spec-stocks-list">
                          <div v-for="(sku, index) in skuList" :key="index" class="spec-stock-item">
                            <div class="spec-info">
                              <span class="spec-name">{{ sku.specs.join(' / ') }}</span>
                            </div>
                            <div class="stock-controls">
                              <el-input-number
                                v-model="seckillSpecStocks[index]"
                                :min="0"
                                :max="sku.Stock"
                                placeholder="秒杀库存"
                                size="small"
                                style="width: 120px;"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                
                <!-- 团购活动 -->
                <el-tab-pane label="团购活动" name="groupbuy">
                  <div class="activity-form">
                    <el-switch
                      v-model="hasGroupBuy"
                      :active-value="true"
                      :inactive-value="false"
                      active-text="开启团购"
                      inactive-text="关闭团购"
                      style="margin-bottom: 20px;"
                    />
                    
                    <div v-if="hasGroupBuy" class="groupbuy-form">
                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">团购价格</label>
                          <el-input-number
                            v-model="groupBuyData.GroupBuyPrice"
                            :min="0"
                            :precision="2"
                            controls-position="right"
                            size="default"
                            style="width: 200px;"
                          >
                            <template #prefix>¥</template>
                          </el-input-number>
                        </div>
                        
                        <div class="form-item">
                          <label class="form-label">成团人数</label>
                          <el-input-number
                            v-model="groupBuyData.PeopleNumber"
                            :min="2"
                            :max="15"
                            controls-position="right"
                            size="default"
                            style="width: 200px;"
                          />
                        </div>
                      </div>
                      
                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">成团期限</label>
                          <el-input-number
                            v-model="groupBuyData.ExpireHours"
                            :min="1"
                            :max="720"
                            controls-position="right"
                            size="default"
                            style="width: 200px;"
                          >
                            <template #suffix>小时</template>
                          </el-input-number>
                        </div>
                        
                        <div class="form-item">
                          <label class="form-label">每人限购</label>
                          <el-input-number
                            v-model="groupBuyData.PerPersonLimit"
                            :min="1"
                            controls-position="right"
                            size="default"
                            style="width: 200px;"
                          />
                        </div>
                      </div>
                      
                      <div class="form-row">
                        <div class="form-item">
                          <label class="form-label">自动成团</label>
                          <el-switch
                            v-model="groupBuyData.AutoComplete"
                            :active-value="1"
                            :inactive-value="0"
                            active-text="自动成团"
                            inactive-text="手动成团"
                          />
                        </div>
                        
                        <div class="form-item">
                          <label class="form-label">退款比例</label>
                          <el-input-number
                            v-model="groupBuyData.RefundRate"
                            :min="0"
                            :max="100"
                            :precision="2"
                            controls-position="right"
                            size="default"
                            style="width: 200px;"
                          >
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

          <!-- 商品详情卡片 -->
          <el-card class="form-card" shadow="never">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon class="card-icon"><Document /></el-icon>
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
                
                <el-upload
                  class="editor-image-upload"
                  action="/api/upload/content-image"
                  :show-file-list="false"
                  :on-success="handleEditorImageUpload"
                  :before-upload="beforeImageUpload"
                >
                  <el-button size="small" type="primary">
                    <el-icon><Upload /></el-icon>上传图片
                  </el-button>
                </el-upload>
              </div>
              
              <div class="editor-container">
                <textarea
                  ref="editorRef"
                  v-model="formData.ProductContent"
                  placeholder="请输入商品详情描述，支持HTML格式..."
                  class="rich-editor"
                  @input="handleEditorInput"
                ></textarea>
              </div>
              
              <div class="preview-section" v-if="formData.ProductContent">
                <h4 class="preview-title">预览：</h4>
                <div class="preview-content" v-html="formData.ProductContent"></div>
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
                <el-icon><Setting /></el-icon>
                <h3 class="card-title">状态设置</h3>
              </div>
            </template>
            
            <div class="settings-list">
              <div class="setting-item">
                <span class="setting-label">商品状态</span>
                <el-switch
                  v-model="formData.ProductStatus"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="上架"
                  inactive-text="下架"
                />
              </div>
              
              <div class="setting-item">
                <span class="setting-label">显示价格</span>
                <el-switch
                  v-model="formData.ShowPrice"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="显示"
                  inactive-text="隐藏"
                />
              </div>
              
              <div class="setting-item">
                <span class="setting-label">防刷单</span>
                <el-switch
                  v-model="formData.AntiRefresh"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="开启"
                  inactive-text="关闭"
                />
              </div>
              
              <div class="setting-item" v-if="formData.AntiRefresh">
                <span class="setting-label">每日最大订单</span>
                <el-input-number
                  v-model="formData.MaxDailyOrders"
                  :min="0"
                  controls-position="right"
                  size="small"
                  style="width: 120px;"
                />
              </div>
              
              <div class="setting-item">
                <span class="setting-label">排序</span>
                <el-input-number
                  v-model="formData.SortOrder"
                  :min="0"
                  :max="9999"
                  controls-position="right"
                  size="small"
                  style="width: 120px;"
                />
              </div>
            </div>
          </el-card>

          <!-- 分销设置 -->
          <el-card class="side-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon><Share /></el-icon>
                <h3 class="card-title">分销设置</h3>
              </div>
            </template>
            
            <div class="settings-list">
              <div class="setting-item">
                <span class="setting-label">开启返佣</span>
                <el-switch
                  v-model="formData.CommissionEnabled"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="开启"
                  inactive-text="关闭"
                  @change="handleCommissionChange"
                />
              </div>
              
              <div v-if="formData.CommissionEnabled" class="commission-settings">
                <div class="setting-item">
                  <span class="setting-label">一级分佣</span>
                  <div class="rate-input">
                    <el-input-number
                      v-model="formData.FirstLevelRate"
                      :min="0"
                      :max="100"
                      :precision="2"
                      controls-position="right"
                      size="small"
                      style="width: 100px;"
                    />
                    <span class="rate-suffix">%</span>
                  </div>
                </div>
                
                <div class="setting-item">
                  <span class="setting-label">二级分佣</span>
                  <div class="rate-input">
                    <el-input-number
                      v-model="formData.SecondLevelRate"
                      :min="0"
                      :max="100"
                      :precision="2"
                      controls-position="right"
                      size="small"
                      style="width: 100px;"
                    />
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
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, Check, Upload, Delete, Picture,
  Camera, Goods, Money, Document, Setting,
  Share, SetUp, Plus, Close, Box,
  TrendCharts
} from '@element-plus/icons-vue'

import { 
  getProductDetail,
  createProduct,
  updateProduct,
  getCategoryOptions
} from '@/api/modules/product'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const editorRef = ref()
const submitting = ref(false)
const categoryOptions = ref([])
const activeMarketingTab = ref('seckill')
const defaultSkuId = ref(0)

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
const hasSpecifications = computed(() => specifications.value.length > 0)
const totalSkus = computed(() => skuList.value.length)

// 表单数据
const formData = reactive({
  ProductId: null,
  AppType: 1,
  BusinessId: 1, // 默认商家ID，实际应用中从登录信息获取
  ProductName: '',
  CategoryId: '',
  ProductImage: '',
  OriginalPrice: 0,
  CurrentPrice: 0,
  TotalStock: 0,
  PerPersonLimit: 0,
  ProductContent: '',
  ShowPrice: 1,
  ProductStatus: 1,
  CommissionEnabled: 0,
  FirstLevelRate: 0,
  SecondLevelRate: 0,
  AntiRefresh: 0,
  MaxDailyOrders: 0,
  SortOrder: 0
})

// 表单验证规则
const formRules = {
  ProductName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在2到100个字符', trigger: 'blur' }
  ],
  CategoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  OriginalPrice: [
    { required: true, message: '请输入原价', trigger: 'blur' },
    { type: 'number', min: 0, message: '原价不能为负数', trigger: 'blur' }
  ],
  CurrentPrice: [
    { required: true, message: '请输入当前售价', trigger: 'blur' },
    { type: 'number', min: 0, message: '售价不能为负数', trigger: 'blur' }
  ]
}

// 规格操作方法
const addSpecification = () => {
  specifications.value.push({
    SpecName: '',
    SpecValues: ['']
  })
}

const removeSpecification = (index) => {
  specifications.value.splice(index, 1)
  generateSkuList()
}

const addSpecValue = (specIndex) => {
  specifications.value[specIndex].SpecValues.push('')
}

const removeSpecValue = (specIndex, valueIndex) => {
  if (specifications.value[specIndex].SpecValues.length > 1) {
    specifications.value[specIndex].SpecValues.splice(valueIndex, 1)
    generateSkuList()
  }
}

const setDefaultSku = (index) => {
  // 设置默认SKU
  skuList.value.forEach((sku, idx) => {
    sku.IsDefault = idx === index ? 1 : 0
  })
}

// 生成SKU列表
const generateSkuList = () => {
  const validSpecs = specifications.value.filter(spec => 
    spec.SpecName && spec.SpecValues.filter(v => v.trim()).length > 0
  )
  
  if (validSpecs.length === 0) {
    skuList.value = []
    seckillSpecStocks.value = []
    return
  }
  
  // 生成所有规格组合
  const combinations = []
  const generateCombinations = (index, currentSpecs, currentValues) => {
    if (index === validSpecs.length) {
      combinations.push({
        specs: [...currentSpecs],
        values: [...currentValues]
      })
      return
    }
    
    const spec = validSpecs[index]
    const validValues = spec.SpecValues.filter(v => v.trim())
    
    for (const value of validValues) {
      currentSpecs.push(spec.SpecName)
      currentValues.push(value)
      generateCombinations(index + 1, currentSpecs, currentValues)
      currentSpecs.pop()
      currentValues.pop()
    }
  }
  
  generateCombinations(0, [], [])
  
  // 生成SKU列表
  skuList.value = combinations.map(combo => {
    const existingSku = skuList.value.find(
      sku => JSON.stringify(sku.specs) === JSON.stringify(combo.specs)
    )
    
    return existingSku || {
      specs: combo.specs,
      values: combo.values,
      Price: formData.CurrentPrice,
      Stock: formData.TotalStock,
      IsDefault: skuList.value.length === 0 ? 1 : 0,
      Image: '',
      SortOrder: 0
    }
  })
  
  // 初始化秒杀规格库存
  seckillSpecStocks.value = skuList.value.map(sku => Math.min(sku.Stock, 50))
}

// 监听规格变化
watch(specifications, () => {
  generateSkuList()
}, { deep: true })

// 监听价格变化，更新SKU价格
watch(() => formData.CurrentPrice, (newPrice) => {
  if (skuList.value.length > 0) {
    skuList.value.forEach(sku => {
      if (!sku.customPrice) {
        sku.Price = newPrice
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
const handleImageUploadSuccess = (response) => {
  if (response.code === 0) {
    formData.ProductImage = response.data.url
    ElMessage.success('主图上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
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
    
    // 处理规格数据
    const productSpecs = []
    skuList.value.forEach(sku => {
      sku.values.forEach((value, index) => {
        productSpecs.push({
          SpecName: sku.specs[index],
          SpecValue: value,
          Price: sku.Price,
          Stock: sku.Stock,
          IsDefault: sku.IsDefault,
          Image: sku.Image,
          SortOrder: sku.SortOrder
        })
      })
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
      ...formData,
      ProductSpecs: productSpecs,
      Marketing: marketingData
    }
    
    if (isEditMode.value) {
      await updateProduct(route.query.id, saveData)
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
    console.error('保存失败:', error)
    ElMessage.error(isEditMode.value ? '更新失败' : '添加失败')
  } finally {
    submitting.value = false
  }
}

// 加载数据
const loadData = async () => {
  if (isEditMode.value) {
    try {
      const res = await getProductDetail(route.query.id)
      Object.assign(formData, res.data)
      
      // 加载规格数据
      if (res.data.ProductSpecs && res.data.ProductSpecs.length > 0) {
        // 将规格数据转换为前端格式
        const specMap = new Map()
        res.data.ProductSpecs.forEach(spec => {
          if (!specMap.has(spec.SpecName)) {
            specMap.set(spec.SpecName, new Set())
          }
          specMap.get(spec.SpecName).add(spec.SpecValue)
        })
        
        specifications.value = Array.from(specMap.entries()).map(([name, values]) => ({
          SpecName: name,
          SpecValues: Array.from(values)
        }))
        
        // 加载SKU数据
        if (res.data.Skus) {
          skuList.value = res.data.Skus
        }
      }
      
      // 加载营销活动数据
      if (res.data.Marketing) {
        if (res.data.Marketing.seckill) {
          hasSeckill.value = true
          Object.assign(seckillData, res.data.Marketing.seckill)
        }
        if (res.data.Marketing.groupBuy) {
          hasGroupBuy.value = true
          Object.assign(groupBuyData, res.data.Marketing.groupBuy)
        }
      }
    } catch (error) {
      console.error('加载商品详情失败:', error)
      ElMessage.error('加载商品详情失败')
    }
  }
}

const loadCategories = async () => {
  try {
    const res = await getCategoryOptions()
    categoryOptions.value = res.data || []
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

onMounted(() => {
  loadCategories()
  loadData()
})
</script>

<style lang="scss" scoped>
.product-edit-page {
  background: #f5f7fa;
  min-height: 100vh;
  
  .page-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 24px 32px;
    margin-bottom: 24px;
    
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
    
    .price-item, .stock-item {
      .price-label, .stock-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
      }
      
      .price-input, .stock-input {
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
      
      .seckill-form, .groupbuy-form {
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