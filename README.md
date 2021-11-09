# xburner-table

## 简介
  ```
  二次封装 element ui 的 el-table
  ```
  ### 表格
    ```
    1、基本表格数据展示.初始化表格:initTableData()为入口、props为表格属性、thead为表头、tbody为表格数据;

    2、支持多级表头;使用如下
    thead = [
      {
          label: "姓名",
          key: "name",
          width: "150",
          children：[{
            label: "小嗨",
            key: "xiaoHai",
            width: "150",
            sortType:"string",
            formatter: {function},
            sortMethod: {function},
          }]
        },
    ]
    tbody = []

    3、表格基本属性设置,可参考elementui使用：[可继续拓展]
      ref\border\size\height\row-key\currentRowKey\rowClassName\highlightCurrentRow\headerCellStyle

    4、表格的基本事件，可参考elementui使用：[可继续拓展]
      selectionChange（勾选数据行）\selectAll（全选数据）\currentChange（当前行发生变化）\columnClick(点击某一行的事件)\rowDblclick（封装双击勾选数据）

    5、支持使用elementui表格的基本方法，可参考elementui使用：tableMethods（通过该方法可调用elementui的所有方法）

    6、数据列排序:sortMethod（无分页时使用，数据列默认排序方式为数字,支持自定义方法）

    7、数据列：formatter（格式化数据列）、fixed（固定数据列）、columnClick（点击事件）

    8、选数据多选列：show（是否显示多选列）、selectable（是否有勾选能力）、reserve（数据更新后是否保存勾选的数据）

    9、序号列：showIndex

    10、操作列：label(按钮名字)\icon（按钮图片）\isShow（按钮权限）\click（按钮事件）\color（按钮颜色）\size（按钮大小）\columnClick（点击事件）
  ```
  ### 分页
  ```
    pagination  分页插件，并且可自定义分页插件
        属性：page-sizes\current-page\page-size\total\layout
        方法：size-change\current-change

    根据需求进行配置，使用示例：
    pagination: { // 分页插件
      show: true,
      page: {
        pageNo: pageNo,
        pageSize: pageSize,
        total: total
      },
      pageSizes: [20, 40, 80, 120],
      paginationLayout: 'total, sizes, prev, pager, next, jumper'
    }
  ```
# 使用

