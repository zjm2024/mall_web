<template>
  <div class="base-info">
    <!-- 店铺信息卡片 + 管理中心区域 -->
    <div class="header-section">
      <!-- 左侧店铺信息卡片 -->
      <div class="shop-card">
        <div class="shop-header">
          <h3 class="shop-name">测试商户</h3>
          <el-tag type="success" class="shop-status">启用</el-tag>
        </div>
        
        <div class="shop-info">
          <div class="info-item">
            <span class="label">商户编号</span>
            <span class="value">M123456789</span>
          </div>
          <div class="info-item">
            <span class="label">所属代理</span>
            <a href="#" class="link">测试代理商</a>
          </div>
          <div class="info-item">
            <span class="label">所属服务商</span>
            <a href="#" class="link">测试服务商</a>
          </div>
          <div class="info-item">
            <span class="label">认证状态</span>
            <el-tag type="success" class="cert-status">认证成功</el-tag>
          </div>
        </div>
      </div>

      <!-- 右侧管理中心 -->
      <div class="management-center">
        <div class="center-header">
          <el-icon :size="24" color="#409EFF"><Management /></el-icon>
          <span class="title">管理中心</span>
        </div>
        
        <div class="config-items">
          <div class="config-item">
            <div class="item-icon"><el-icon :size="32"><Setting /></el-icon></div>
            <div class="item-label">对接配置</div>
          </div>
          <div class="config-item">
            <div class="item-icon"><el-icon :size="32"><User /></el-icon></div>
            <div class="item-label">主体信息</div>
          </div>
          <div class="config-item">
            <div class="item-icon"><el-icon :size="32"><DocumentCopy /></el-icon></div>
            <div class="item-label">经营信息</div>
          </div>
          <div class="config-item">
            <div class="item-icon"><el-icon :size="32"><ShoppingCart /></el-icon></div>
            <div class="item-label">结算信息</div>
          </div>
          <div class="config-item">
            <div class="item-icon"><el-icon :size="32"><DataAnalysis /></el-icon></div>
            <div class="item-label">支付主体权</div>
          </div>
          <div class="config-item">
            <div class="item-icon"><el-icon :size="32"><Histogram /></el-icon></div>
            <div class="item-label">分账配置</div>
          </div>
          <div class="config-item">
            <div class="item-icon"><el-icon :size="32"><Connection /></el-icon></div>
            <div class="item-label">易支付配置</div>
          </div>
          <div class="config-item">
            <div class="item-icon"><el-icon :size="32"><Link /></el-icon></div>
            <div class="item-label">网关配置</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 账户信息区域 -->
    <div class="apps-section">
      <div class="section-title">
        <el-icon :size="20" color="#409EFF"><Wallet /></el-icon>
        <span>账户信息</span>
      </div>

      <div class="apps-grid">

        <!-- 账户应用卡片 1 -->
        <div class="app-card">
          <div class="app-header">
            <i class="fa-brands fa-weixin" style="font-size: 24px; color: #00cb00;"></i>
            <span class="app-name">用户已支付入账金</span>
          </div>
          <div class="app-info">
            <div class="info-line">ID: A051933028985957</div>
          </div>
          <div class="balance-display" style="font-weight: bold; font-size: 20px; margin: 10px 0;">¥ 0.00</div>
          <div class="app-footer">
            <el-tag type="success" class="status-tag">启用</el-tag>
            <div class="action-icons">
              <el-icon class="icon-btn" title="编辑"><Edit /></el-icon>
              <el-icon class="icon-btn" title="备注"><List /></el-icon>
              <el-icon class="icon-btn" title="更多"><MoreFilled /></el-icon>
            </div>
          </div>
        </div>

        <!-- 账户应用卡片 2 -->
        <div class="app-card">
          <div class="app-header">
            <i class="fa-regular fa-credit-card" style="font-size: 24px; color: #a0a0a0;"></i>
            <span class="app-name">用户充值未用金</span>
          </div>
          <div class="app-info">
            <div class="info-line">ID: A679509717603696964</div>
          </div>
          <div class="balance-display" style="font-weight: bold; font-size: 20px; margin: 10px 0;">¥ 0.00</div>
          <div class="app-footer">
            <el-tag type="success" class="status-tag">启用</el-tag>
            <div class="action-icons">
              <el-icon class="icon-btn" title="编辑"><Edit /></el-icon>
              <el-icon class="icon-btn" title="备注"><List /></el-icon>
              <el-icon class="icon-btn" title="更多"><MoreFilled /></el-icon>
            </div>
          </div>
        </div>

        <!-- 账户应用卡片 3 -->
        <div class="app-card">
          <div class="app-header">
            <i class="fa-solid fa-money-check-dollar" style="font-size: 24px; color: #404040;"></i>
            <span class="app-name">店铺保证金</span>
          </div>
          <div class="app-info">
            <div class="info-line">ID: A658426774903569</div>
          </div>
          <div class="balance-display" style="font-weight: bold; font-size: 20px; margin: 10px 0;">¥ 0.00</div>
          <div class="app-footer">
            <el-tag type="success" class="status-tag">启用</el-tag>
            <div class="action-icons">
              <el-icon class="icon-btn" title="编辑"><Edit /></el-icon>
              <el-icon class="icon-btn" title="备注"><List /></el-icon>
              <el-icon class="icon-btn" title="更多"><MoreFilled /></el-icon>
            </div>
          </div>
        </div>

        <!-- 新增账户按钮卡片 -->
        <div class="app-card add-app-card">
          <el-icon :size="48" color="#C0C4CC"><Plus /></el-icon>
          <div class="add-label">新增账户</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Management,
  Setting,
  User,
  DocumentCopy,
  ShoppingCart,
  DataAnalysis,
  Histogram,
  Connection,
  Link,
  Wallet,
  Edit,
  List,
  MoreFilled,
  Plus
} from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.base-info {
  padding: 20px;

  .header-section {
    display: flex;
    gap: 20px;
    margin-bottom: 40px;

    .shop-card {
      flex: 0 0 380px;
      background: #fff;
      border-radius: 4px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .shop-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #f0f0f0;

        .shop-name {
          margin: 0;
          font-size: 18px;
          font-weight: 500;
          color: #303133;
        }

        .shop-status {
          padding: 2px 12px;
        }
      }

      .shop-info {
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;

          .label {
            color: #606266;
            min-width: 80px;
          }

          .value {
            color: #303133;
            font-weight: 500;
          }

          .link {
            color: #409EFF;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }

          .cert-status {
            padding: 2px 12px;
          }
        }
      }
    }

    .management-center {
      flex: 1;
      background: #fff;
      border-radius: 4px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .center-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 1px solid #f0f0f0;

        .title {
          font-size: 16px;
          font-weight: 500;
          color: #303133;
        }
      }

      .config-items {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;

        .config-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            .item-icon {
              transform: scale(1.1);
              color: #409EFF;
            }
          }

          .item-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            color: #606266;
          }

          .item-label {
            font-size: 14px;
            color: #606266;
            text-align: center;
            transition: all 0.3s;
          }

          &:hover .item-label {
            color: #409EFF;
            font-weight: 500;
          }
        }
      }
    }
  }

  .apps-section {
    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 20px;
    }

    .apps-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;

      .app-card {
        background: #fff;
        border-radius: 4px;
        padding: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        flex-direction: column;

        &:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .app-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;

          .app-name {
            font-size: 16px;
            font-weight: 500;
            color: #303133;
          }
        }

        .app-info {
          flex: 1;
          margin-bottom: 16px;

          .info-line {
            font-size: 12px;
            color: #909399;
          }
        }

        .app-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .status-tag {
            padding: 2px 12px;
            font-size: 12px;
          }

          .action-icons {
            display: flex;
            gap: 12px;

            .icon-btn {
              cursor: pointer;
              color: #606266;
              transition: all 0.3s;

              &:hover {
                color: #409EFF;
                transform: scale(1.2);
              }
            }
          }
        }

        &.add-app-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 200px;
          border: 1px dashed #D9D9D9;
          background: #FAFAFA;

          &:hover {
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            border-color: #409EFF;
            background: #F5F7FA;

            .add-label {
              color: #409EFF;
            }
          }

          .add-label {
            font-size: 14px;
            color: #909399;
            transition: all 0.3s;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1600px) {
  .base-info {
    .header-section {
      flex-direction: column;

      .shop-card {
        flex: 1;
      }

      .management-center {
        .config-items {
          grid-template-columns: repeat(4, 1fr);
        }
      }
    }

    .apps-section {
      .apps-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }
}

@media (max-width: 1200px) {
  .base-info {
    .apps-section {
      .apps-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>