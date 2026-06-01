import React from "react";
import { Table, Tag, Button, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import {
  RECONCILE_STATUS,
  RECONCILE_STATUS_COLOR_MAP,
  RECONCILE_TYPE,
} from "@/config/constants";
import { useReconcileHistory } from "@/hooks/useReconcileHistory";
import { useDownloadReconcileHistory } from "@/hooks/useDownloadReconcileHistory";
import { useFilter } from "@/store/filterSlice/useFilter";
import Filters from "./components/Filters";
import type { ReconcileHistoryItem } from "./types";

const ReconcileHistory: React.FC = () => {
  const { reconcileHistoryFilters, setReconcileHistoryFilters } = useFilter();
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<"ascend" | "descend" | null>(
    "descend",
  );

  const { isPending, dataSource, total, page, limit } = useReconcileHistory({
    sortField,
    sortOrder,
  });
  const download = useDownloadReconcileHistory();

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      render: (_: any, __: any, index: number) =>
        (page - 1) * limit + index + 1,
    },
    {
      title: "Đại lý tổng",
      dataIndex: "company_name",
      key: "company_name",
      render: (text: string) => text || "---",
    },
    {
      title: "Loại đối soát",
      dataIndex: "type",
      key: "type",
      render: (v: string) =>
        RECONCILE_TYPE.find((t) => t.value === v)?.label || "---",
    },
    {
      title: "Tháng đối soát",
      key: "period",
      sorter: true,
      render: (_: any, r: ReconcileHistoryItem) =>
        r.month && r.year
          ? `${String(r.month).padStart(2, "0")}/${r.year}`
          : "---",
    },
    // {
    //   title: 'Trạng thái',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (status: string) => {
    //     const label =
    //       RECONCILE_STATUS.find((s) => s.value === status)?.label || '---'
    //     const color = RECONCILE_STATUS_COLOR_MAP[status] || 'default'
    //     return <Tag color={color}>{label}</Tag>
    //   },
    // },
    {
      title: "Tài liệu đối soát",
      key: "file",
      render: (_: any, r: ReconcileHistoryItem) => {
        const canDownload = r.status === "SUCCESS" && Boolean(r.file_path);
        const isLoading = download.isPending && download.variables?.id === r.id;
        return (
          <Space>
            {canDownload ? (
              <button
                type="button"
                disabled={isLoading}
                onClick={() =>
                  download.mutate({ id: r.id, fileName: r.file_name })
                }
                className="text-blue-600 underline hover:opacity-80 disabled:opacity-50 text-left"
              >
                {r.file_name || "---"}
              </button>
            ) : (
              <span className="text-gray-500">{r.file_name || "---"}</span>
            )}
            <Button
              type="text"
              icon={<DownloadOutlined />}
              disabled={!canDownload}
              loading={isLoading}
              onClick={() =>
                download.mutate({ id: r.id, fileName: r.file_name })
              }
            />
          </Space>
        );
      },
    },
  ];

  const onTableChange = (pagination: any, _f: any, sorter: any) => {
    setReconcileHistoryFilters({
      page: pagination.current,
      limit: pagination.pageSize,
    });
    if (sorter.field) {
      setSortField(sorter.field === "period" ? "year" : sorter.field);
      setSortOrder(sorter.order);
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  };

  return (
    <div className="px-6 py-4 bg-white rounded-lg shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)] flex flex-col justify-start items-start gap-4">
      <div className="self-stretch inline-flex justify-between items-center border-b border-[#DDE4EE] py-4">
        <div className="justify-start text-black text-3xl font-bold">
          Báo cáo đối soát hàng tháng
        </div>
      </div>

      <Filters />

      <div className="w-full">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          loading={isPending}
          scroll={{ x: 1200 }}
          pagination={{
            total,
            current: page,
            pageSize: limit,
            showSizeChanger: true,
            showTotal: (t: number, range: [number, number]) =>
              `Hiển thị ${range[0]}-${range[1]} trên ${t} kết quả`,
            pageSizeOptions: ["10", "20", "50", "100"],
            locale: { items_per_page: "kết quả / trang" },
          }}
          onChange={onTableChange}
        />
      </div>
    </div>
  );
};

export default ReconcileHistory;
