<template>
  <div class="dashboard-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h1 class="welcome-title">欢迎使用微信小店管理后台</h1>
      <p class="welcome-subtitle">高效管理您的店铺，提升运营效率</p>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <h3 class="section-title">快捷操作</h3>
      <div class="action-grid">
        <el-card 
          v-for="action in quickActions" 
          :key="action.id" 
          class="action-card"
          shadow="hover"
          @click="handleQuickAction(action)"
        >
          <div class="action-content">
            <el-icon :size="32" :color="action.color">
              <component :is="action.icon" />
            </el-icon>
            <div class="action-info">
              <h4>{{ action.title }}</h4>
              <p>{{ action.desc }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="statistics-section">
      <h3 class="section-title">数据概览</h3>
      <div class="statistics-grid">
        <el-card class="stat-card" shadow="never">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e6f7ff;">
              <el-icon color="#1890ff"><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥ 12,560</div>
              <div class="stat-label">今日销售额</div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card" shadow="never">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f6ffed;">
              <el-icon color="#52c41a"><Goods /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">156</div>
              <div class="stat-label">商品总数</div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card" shadow="never">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fff7e6;">
              <el-icon color="#fa8c16"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">3</div>
              <div class="stat-label">成员数量</div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card" shadow="never">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fff0f6;">
              <el-icon color="#eb2f96"><Bell /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">8</div>
              <div class="stat-label">待办事项</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 最近操作 -->
    <div class="recent-operations">
      <h3 class="section-title">最近操作</h3>
      <el-table :data="recentOperations" style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="action" label="操作内容" />
        <el-table-column prop="target" label="操作对象" width="150" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'info'" size="small">
              {{ row.status === 'success' ? '成功' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, ShoppingCart, Goods, Setting, 
  Bell, Message, Document, Shop 
} from '@element-plus/icons-vue'

const router = useRouter()

// 快捷操作
const quickActions = ref([
  { id: 1, title: '添加商品', desc: '快速上架新商品', icon: 'Goods', color: '#1890ff', path: '/product' },
  { id: 2, title: '订单处理', desc: '查看待处理订单', icon: 'ShoppingCart', color: '#52c41a', path: '/order' },
  { id: 3, title: '成员管理', desc: '管理店铺成员', icon: 'User', color: '#fa8c16', path: '/shop/member' },
  { id: 4, title: '营销活动', desc: '创建营销活动', icon: 'Message', color: '#eb2f96', path: '/marketing' },
  { id: 5, title: '店铺设置', desc: '配置店铺信息', icon: 'Setting', color: '#722ed1', path: '/shop/base' },
  { id: 6, title: '数据报表', desc: '查看经营数据', icon: 'Document', color: '#13c2c2', path: '/dashboard' }
])

// 最近操作
const recentOperations = ref([
  { time: '2023-10-20 14:30:22', operator: '管理员', action: '修改商品价格', target: '商品A', status: 'success' },
  { time: '2023-10-20 13:45:10', operator: '运营员', action: '创建营销活动', target: '双11大促', status: 'success' },
  { time: '2023-10-20 11:20:35', operator: '客服', action: '处理售后申请', target: '订单001', status: 'success' },
  { time: '2023-10-20 10:15:42', operator: '管理员', action: '添加新成员', target: '张三', status: 'success' },
  { time: '2023-10-20 09:30:18', operator: '财务', action: '结算处理中', target: '10月结算', status: 'processing' }
])

// 处理快捷操作点击
const handleQuickAction = (action) => {
  router.push(action.path)
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  
  .welcome-section {
    margin-bottom: 30px;
    
    .welcome-title {
      font-size: 28px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 8px;
    }
    
    .welcome-subtitle {
      font-size: 16px;
      color: #909399;
    }
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 500;
    color: #303133;
    margin: 0 0 20px 0;
  }
  
  .quick-actions {
    margin-bottom: 30px;
    
    .action-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      
      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
      
      .action-card {
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .action-content {
          display: flex;
          align-items: center;
          gap: 16px;
          
          .action-info {
            flex: 1;
            
            h4 {
              margin: 0 0 8px 0;
              font-size: 16px;
              color: #303133;
            }
            
            p {
              margin: 0;
              font-size: 14px;
              color: #909399;
            }
          }
        }
      }
    }
  }
  
  .statistics-section {
    margin-bottom: 30px;
    
    .statistics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      
      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
      
      .stat-card {
        border: 1px solid #e4e7ed;
        
        .stat-content {
          display: flex;
          align-items: center;
          gap: 16px;
          
          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .stat-info {
            .stat-value {
              font-size: 24px;
              font-weight: 600;
              color: #303133;
              margin-bottom: 4px;
            }
            
            .stat-label {
              font-size: 14px;
              color: #909399;
            }
          }
        }
      }
    }
  }
  
  .recent-operations {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>