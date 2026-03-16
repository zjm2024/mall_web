<template>
    <div>
        <el-dialog width="50%" heigth="60vh" v-model="state.isShowDialog" title="选择商户" :close-on-click-modal="false"
            draggable>



            <el-table :data="state.dataList" style="width: 100%;height:60vh" v-loading="state.loading" border
                @row-click="handleRowclick" @row-dblclick="handleRowdblclick">


                <el-table-column fixed="left" align="center" width="50" label="">
                    <template #default="scope">
                        <el-radio class="radio" v-model="state.selectrowid" :label="scope.row.businessId">
                            <span></span>
                        </el-radio>

                    </template>

                </el-table-column>




                <el-table-column label="#" type="index" width="60" />


                <el-table-column label="商户号" header-align="center" width="200">

                    <template #default="scope">


                        <span>{{ scope.row.businessNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="businessName" label="商户名称" header-align="center">
                </el-table-column>




            </el-table>

            <!-- 分页 -->
            <div class="pagination-section">
                <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                    :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
                </span>
            </template>


        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue"
import { ElMessage } from 'element-plus'
import { getShopPageList } from '@/api/modules/shop'
import { useUserStore } from '@/stores/user'


onMounted(async () => {
    // state.loading = true;
    // state.loading = false;
});

const emits = defineEmits(['handleQuery'])
// 数据
const userStore = useUserStore()

// 分页
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
})

// 提交表单数据
const state = reactive({
    loading: false,
    isShowDialog: false,
    selectrowid: '',
    dataList: [],

})

//打开弹窗
const openDialog = async () => {

    try {
        state.selectrowid = '';
        state.loading = true;
        await fetchShopList();
    } catch (error) {
        ElMessage.error('获取商户列表失败')
    } finally {
        state.loading = false;
    }
    state.isShowDialog = true;
}

// 关闭弹窗
const closeDialog = (res) => {
    emits('handleQuery', res);
    state.isShowDialog = false;
};

const fetchShopList = async (res) => {

    state.dataList = [];
    const appType = userStore.userInfo.appType

    let params = {
        pageIndex: pagination.currentPage,
        pageSize: pagination.pageSize,
        appType: appType,
        status: 1
    }



    const result = await getShopPageList(params)
    state.dataList = result.result || []
    pagination.total = result.count
};

const handleRowclick = async (row) => {
    state.selectrowid = row.businessId;

};

const handleRowdblclick = async (row) => {
    state.selectrowid = row.businessId;
    onSubmit();
};
//提交
const onSubmit = () => {

    //选择行
    let res = state.dataList.find(it => it.businessId === state.selectrowid);
    closeDialog(res);

};
// 取消
const cancel = () => {
    state.isShowDialog = false;
};

// 分页
const handleSizeChange = (val) => {
    pagination.pageSize = val
    fetchProductList()
}

const handleCurrentChange = (val) => {
    pagination.currentPage = val
    fetchProductList()
}
// 导出对象
defineExpose({ openDialog });
</script>



<style scoped></style>