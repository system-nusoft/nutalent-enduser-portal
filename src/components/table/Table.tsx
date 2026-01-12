import { Table as SimpleTable, Skeleton } from "antd";
import { ColumnType, TablePaginationConfig } from "antd/es/table";
import styles from "./styles.module.scss";

interface Props {
  dataSource: any[];
  columns: ColumnType<any>[];
  handleRowClick?: (val: any) => void;
  pagination?: TablePaginationConfig | false;
  heightAdjuster?: number;
  selection?: boolean; // Enable row selection
  onSelectionChange?: (selectedRows: any[]) => void; // Callback for selected rows
  staticHeight?: boolean;
  selectionRows?: any[];
  loading: boolean;
  simple?: boolean;
  footer?: any | undefined;
  size?: "small" | "middle" | "large";
}

export const Table = ({
  dataSource,
  columns,
  handleRowClick,
  pagination,
  heightAdjuster = 20,
  selection = false, // Default selection is false
  onSelectionChange,
  selectionRows,
  staticHeight = true,
  loading,
  simple,
  footer,
  size = "middle",
}: Props) => {
  const dataWithKeys = dataSource
    ? dataSource?.map((item, index) => ({
        ...item,
        key: item?.id || index, // Use existing 'key' or fallback to index
      }))
    : [];

  // Calculate the table height based on the viewport and heightAdjuster
  const tableHeightScroll = `calc(100vh - ${
    (simple && !heightAdjuster ? 20 : heightAdjuster) + 7.5
  }rem)`;

  const selectedKeys =
    selection && Array.isArray(selectionRows)
      ? selectionRows?.map((i: { engagementId: string }) => i?.engagementId)
      : [];

  // runtime error ignore for demo only
  // useEffect(() => {
  //   function hideError(e: any) {
  //     if (
  //       e.message ===
  //       "ResizeObserver loop completed with undelivered notifications."
  //     ) {
  //       const resizeObserverErrDiv = document.getElementById(
  //         "webpack-dev-server-client-overlay-div"
  //       );
  //       const resizeObserverErr = document.getElementById(
  //         "webpack-dev-server-client-overlay"
  //       );
  //       if (resizeObserverErr) {
  //         resizeObserverErr.setAttribute("style", "display: none");
  //       }
  //       if (resizeObserverErrDiv) {
  //         resizeObserverErrDiv.setAttribute("style", "display: none");
  //       }
  //     }
  //   }

  //   window.addEventListener("error", hideError);
  //   return () => {
  //     window.addEventListener("error", hideError);
  //   };
  // }, []);

  const loadingColumns = columns.map((col) => ({
    ...col,
    render: (value: any, record: any, index: number) =>
      loading ? (
        <Skeleton.Input active block />
      ) : (
        col.render?.(value, record, index) ?? value
      ),
  }));

  return (
    <div
      className={`${
        simple
          ? styles.customTableSimple
          : styles[`customTable_${heightAdjuster}`]
      } ${simple ? "" : " rounded-2xl"} w-full overflow-hidden`}
    >
      <SimpleTable
        key={Math.random().toString(36).substring(7)}
        dataSource={loading ? Array(6).fill({}) : dataWithKeys} // Use data with unique keys
        columns={loadingColumns}
        size={size}
        rowKey={selection ? "engagementId" : "id"}
        footer={footer}
        scroll={{ y: staticHeight ? undefined : tableHeightScroll }}
        onRow={(record) => {
          return {
            style: { cursor: "pointer" },
            onClick: () => {
              if (handleRowClick) handleRowClick(record);
            },
          };
        }}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onSelect: (key) => {
            if (onSelectionChange) onSelectionChange(key);
          },
        }}
        pagination={pagination}
      />
    </div>
  );
};
