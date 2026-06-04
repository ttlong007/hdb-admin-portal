# Module: Reconcile History (Lịch sử đối soát)

> Tài liệu tích hợp 3 endpoint quản lý **lịch sử đối soát** (Admin Portal) — bao gồm spec API, mapping FE, plan đặt file, và code skeleton bám đúng convention của project (xem [.ai-context/project-overview.md](../project-overview.md)).

---

## 1. Tổng quan

| Mục | Giá trị |
|---|---|
| Base URL | `{API_HOST}/api/v1/admin` (đã có sẵn trong `VITE_API_URL` + axios baseURL — chỉ truyền path bắt đầu bằng `/v1/admin/...`) |
| Auth | Bearer JWT → tự gắn bởi `axiosInstance` ở [src/config/axios.ts](../../src/config/axios.ts) |
| Content-Type | `application/json` |
| Số endpoint | **3** (list / view / download) |
| Permission yêu cầu | `ADMIN_VIEW` (admin role) |
| Vị trí dự kiến trên FE | Sidebar **"Quản lý đối soát" → "Lịch sử đối soát"** (route gợi ý: `/reconcile-history`) |

### Response envelope (chuẩn chung toàn admin API)
```jsonc
{
  "trace_id": "...",
  "status_code": "ACCEPT",   // "ACCEPT" = thành công; "REJECT" / khác = lỗi nghiệp vụ
  "reason_code": "...",
  "reason_message": "...",
  "time_ms": 12,
  "data": { ... }            // hoặc [...] cho list
}
```

List endpoint kèm `page_data`:
```jsonc
{
  "trace_id": "...",
  "status_code": "ACCEPT",
  "data": [ ... ],
  "page_data": { "page": 1, "limit": 20, "total": 134 }
}
```

Lỗi HTTP 4xx/5xx → body `errorhelper.HTTPError` `{ message, status_code }`. Axios interceptor sẽ tự refresh token cho 401; component chỉ cần catch các lỗi nghiệp vụ.

---

## 2. Hằng số chung

| Field | Giá trị hợp lệ | Hiển thị (vi-VN) |
|---|---|---|
| `type` | `TRANSACTION` | Tài chính |
| | `BUSINESS_STAFF` | Phi tài chính - NV |
| | `BUSINESS_CONTRACTOR` | Phi tài chính - CTV |
| `status` | `SUCCESS` | Thành công |
| | `FAILED` | Thất bại |

Đặt trong [src/config/constants.ts](../../src/config/constants.ts) (giữ pattern `RECONCILE_*` để đồng bộ với `TRANSACTION_STATUS`, `MERCHANT_STATUS` đã có):

```ts
export const RECONCILE_TYPE = [
  { value: 'TRANSACTION', label: 'Tài chính' },
  { value: 'BUSINESS_STAFF', label: 'Phi tài chính - NV' },
  { value: 'BUSINESS_CONTRACTOR', label: 'Phi tài chính - CTV' },
]

export const RECONCILE_STATUS = [
  { value: 'SUCCESS', label: 'Thành công' },
  { value: 'FAILED', label: 'Thất bại' },
]

export const RECONCILE_STATUS_COLOR_MAP: Record<string, string> = {
  SUCCESS: 'green',
  FAILED: 'red',
}
```

---

## 3. Endpoints

### 3.1. List — `POST /v1/admin/reconcile-history/list`

#### Request body
```ts
interface ReconcileHistoryListRequest {
  company_id?: number       // int64, optional
  type?: 'TRANSACTION' | 'BUSINESS_STAFF' | 'BUSINESS_CONTRACTOR'
  year?: number             // int
  month?: number            // 1..12
  status?: 'SUCCESS' | 'FAILED'

  page?: number             // default 1
  limit?: number            // default 20, max 500
  order_by_column?: string  // default 'created_at'
  descending?: boolean      // default true
}
```

> **Quy tắc filter (theo convention dự án):** chỉ truyền các field **có giá trị thật** (không gửi `''`, `null`, `undefined`, mảng rỗng). Filter trống → bỏ field, không gửi. Xem [useTransactionHistory.ts](../../src/hooks/useTransactionHistory.ts) đoạn `Object.fromEntries(...filter...)` làm reference.

#### Response 200
```jsonc
{
  "trace_id": "...",
  "status_code": "ACCEPT",
  "data": [
    {
      "id": 101,
      "company_id": 12,
      "store_id": null,
      "status": "SUCCESS",
      "type": "TRANSACTION",
      "month": 4,
      "year": 2026,
      "file_name": "AGE_reconciliation_trans_yyyymmdd.xlsx",
      "file_path": "export-data/transaction/2026-05-01/AGE_reconciliation_trans_HDB001_20260401.xlsx",
      "created_at": "2026-05-01 03:00:12",
      "updated_at": "2026-05-01 03:00:12"
    }
  ],
  "page_data": { "page": 1, "limit": 20, "total": 134 }
}
```

#### Field reference

| Field | Kiểu | Ghi chú |
|---|---|---|
| `id` | `number` (int64) | Khoá chính — dùng cho View & Download |
| `company_id` | `number` (int64) | ID công ty đối tác |
| `store_id` | `number \| null` | Hiện luôn `null` ở cấp company-level |
| `status` | `'SUCCESS' \| 'FAILED'` | Render `<Tag>` theo `RECONCILE_STATUS_COLOR_MAP` |
| `type` | `'TRANSACTION' \| 'BUSINESS_STAFF' \| 'BUSINESS_CONTRACTOR'` | Map label qua `RECONCILE_TYPE` |
| `month` / `year` | `number` | Kỳ đối soát (giờ VN của ngày 1 tháng trước) |
| `file_name` | `string` | Tên file hiển thị |
| `file_path` | `string` | **S3 object key — KHÔNG phải URL.** Không bao giờ link trực tiếp; luôn gọi `/download` để lấy presigned URL |
| `created_at`, `updated_at` | `string` | Format `YYYY-MM-DD HH:mm:ss` (**UTC**) — khi render phải convert sang giờ VN |

#### Lỗi thường gặp
| HTTP | Khi nào |
|---|---|
| 400 | Body sai schema (vd. `limit > 500`) |
| 401 | Thiếu/sai JWT — interceptor tự refresh |
| 403 | Admin thiếu permission `ADMIN_VIEW` |

---

### 3.2. View — `GET /v1/admin/reconcile-history/{id}`

#### Path params
| Param | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `id` | `number` (int64) | ✓ | ID record từ list |

#### Response 200
```jsonc
{
  "trace_id": "...",
  "status_code": "ACCEPT",
  "data": {
    "id": 101,
    "company_id": 12,
    "store_id": null,
    "status": "SUCCESS",
    "type": "TRANSACTION",
    "month": 4,
    "year": 2026,
    "file_name": "AGE_reconciliation_trans_yyyymmdd.xlsx",
    "file_path": "export-data/transaction/2026-05-01/AGE_reconciliation_trans_HDB001_20260401.xlsx",
    "created_at": "2026-05-01 03:00:12",
    "updated_at": "2026-05-01 03:00:12"
  }
}
```
> Schema `data` **giống hệt** item trong list ⇒ tái sử dụng type `ReconcileHistoryItem`.

#### Lỗi
| HTTP | Khi nào |
|---|---|
| 400 | `id` không phải số nguyên |
| 404 | Không tìm thấy record |
| 401 / 403 | Như list |

---

### 3.3. Download — `GET /v1/admin/reconcile-history/{id}/download`

Trả về **presigned URL** từ S3 với `content-disposition: attachment`. URL có hạn dùng (theo `S3Config.PresignedURLExpiryMinutes` BE, mặc định vài chục phút).

> ⚠️ **KHÔNG cache URL** — mỗi lần user bấm **Tải xuống** phải gọi lại endpoint này.

#### Path params
| Param | Kiểu | Bắt buộc |
|---|---|---|
| `id` | `number` (int64) | ✓ |

#### Response 200
```jsonc
{
  "trace_id": "...",
  "status_code": "ACCEPT",
  "data": {
    "url": "https://s3.../export-data/transaction/.../AGE_reconciliation_trans_HDB001_20260401.xlsx?X-Amz-..."
  }
}
```

#### Lỗi
| HTTP | Khi nào |
|---|---|
| 400 | `id` không phải số nguyên |
| 404 | Record không tồn tại **hoặc** `file_path` rỗng (vd. cron ghi history với `status = FAILED`) |
| 401 / 403 | Như list |

> **UX khuyến nghị:** nếu `status === 'FAILED'` thì **disable** nút Tải xuống ở client để tránh hit 404. Vẫn nên `try/catch` 404 ở phía gọi để cover edge case.

---

## 4. Plan tích hợp Front-end

### 4.1. File layout dự kiến (bám đúng convention dự án)
```
src/
├── config/
│   ├── constants.ts                       # + RECONCILE_TYPE, RECONCILE_STATUS, RECONCILE_STATUS_COLOR_MAP
│   └── routes.ts                          # + reconcileHistory: '/reconcile-history'
│
├── hooks/
│   ├── useReconcileHistory.ts             # POST list — useQuery
│   ├── useReconcileHistoryDetail.ts       # GET {id}    — useQuery
│   └── useDownloadReconcileHistory.ts     # GET {id}/download — useMutation (chạy on-click)
│
├── pages/
│   └── ReconcileHistory/
│       ├── index.tsx                      # List page — table + filter + download
│       ├── types.ts                       # ReconcileHistoryItem & request types
│       └── components/
│           └── Filters.tsx                # Form filter (company, type, year, month, status)
│
├── store/
│   └── filterSlice/
│       └── index.ts                       # + reconcileHistory filter state + setter + reset
│
└── Routes.tsx                             # đăng ký { path: routes.reconcileHistory, element: <ReconcileHistory /> }
```

> Có thể tạo thêm trang `ReconcileHistoryDetail.tsx` nếu sau này có nghiệp vụ xem chi tiết riêng. Hiện 3 endpoint đủ cho UX list + download inline → **chưa cần Detail page**.

### 4.2. TypeScript types — `src/pages/ReconcileHistory/types.ts`

```ts
export type ReconcileType = 'TRANSACTION' | 'BUSINESS_STAFF' | 'BUSINESS_CONTRACTOR'
export type ReconcileStatus = 'SUCCESS' | 'FAILED'

export interface ReconcileHistoryItem {
  id: number
  company_id: number
  store_id: number | null
  status: ReconcileStatus
  type: ReconcileType
  month: number
  year: number
  file_name: string
  file_path: string
  created_at: string
  updated_at: string
}

export interface ReconcileHistoryListRequest {
  company_id?: number
  type?: ReconcileType
  year?: number
  month?: number
  status?: ReconcileStatus
  page?: number
  limit?: number
  order_by_column?: string
  descending?: boolean
}
```

### 4.3. Filter slice — bổ sung vào [src/store/filterSlice/index.ts](../../src/store/filterSlice/index.ts)

Thêm vào `FilterState`:
```ts
reconcileHistory: {
  company_id?: number
  type?: ReconcileType | ''
  year?: number
  month?: number
  status?: ReconcileStatus | ''
  page?: number
  limit?: number
}
```

Initial state:
```ts
reconcileHistory: {
  company_id: undefined,
  type: '',
  year: undefined,
  month: undefined,
  status: '',
  page: 1,
  limit: 10,
}
```

Reducer + reset action theo đúng pattern các slice hiện có (`setReconcileHistoryFilter`, `resetReconcileHistoryFilter`). Đừng quên export ra `useFilter()` ở [src/store/filterSlice/useFilter.ts](../../src/store/filterSlice/useFilter.ts).

### 4.4. Hook list — `src/hooks/useReconcileHistory.ts`

Bám sát pattern [useTransactionHistory.ts](../../src/hooks/useTransactionHistory.ts):

```ts
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { useFilter } from '@/store/filterSlice/useFilter'
import type {
  ReconcileHistoryItem,
  ReconcileHistoryListRequest,
} from '@/pages/ReconcileHistory/types'

interface Params {
  sortField?: string | null
  sortOrder?: 'ascend' | 'descend' | null
}

export const useReconcileHistory = ({ sortField, sortOrder }: Params) => {
  const { reconcileHistoryFilters } = useFilter()

  const { isPending, data } = useQuery({
    queryKey: ['reconcile-history', reconcileHistoryFilters, sortField, sortOrder],
    queryFn: async () => {
      let body: ReconcileHistoryListRequest = {
        page: reconcileHistoryFilters.page,
        limit: reconcileHistoryFilters.limit,
        order_by_column: sortField || 'created_at',
        descending: sortOrder !== 'ascend',
        company_id: reconcileHistoryFilters.company_id || undefined,
        type: reconcileHistoryFilters.type || undefined,
        year: reconcileHistoryFilters.year || undefined,
        month: reconcileHistoryFilters.month || undefined,
        status: reconcileHistoryFilters.status || undefined,
      }

      body = Object.fromEntries(
        Object.entries(body).filter(([_, v]) => {
          if (v === null || v === undefined) return false
          if (typeof v === 'string' && v.trim() === '') return false
          return true
        })
      ) as ReconcileHistoryListRequest

      const res = await axiosInstance.post('/v1/admin/reconcile-history/list', body)
      if (res.data.status_code === 'ACCEPT') {
        return {
          data: res.data.data as ReconcileHistoryItem[],
          total: res.data.page_data?.total ?? 0,
        }
      }
      throw new Error(res.data.reason_message)
    },
  })

  return {
    isPending,
    dataSource: data?.data ?? [],
    total: data?.total ?? 0,
    page: reconcileHistoryFilters.page,
    limit: reconcileHistoryFilters.limit,
  }
}
```

### 4.5. Hook detail — `src/hooks/useReconcileHistoryDetail.ts`

```ts
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import type { ReconcileHistoryItem } from '@/pages/ReconcileHistory/types'

export const useReconcileHistoryDetail = (id?: number | string) => {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ['reconcile-history-detail', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/v1/admin/reconcile-history/${id}`)
      if (res.data.status_code === 'ACCEPT') {
        return res.data.data as ReconcileHistoryItem
      }
      throw new Error(res.data.reason_message)
    },
  })
}
```

### 4.6. Hook download — `src/hooks/useDownloadReconcileHistory.ts`

Dùng **`useMutation`** vì luôn trigger on-click và không nên cache URL:

```ts
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import axiosInstance from '@/config/axios'

export const useDownloadReconcileHistory = () => {
  return useMutation({
    mutationFn: async ({ id, fileName }: { id: number; fileName?: string }) => {
      const res = await axiosInstance.get(`/v1/admin/reconcile-history/${id}/download`)
      if (res.data.status_code !== 'ACCEPT') {
        throw new Error(res.data.reason_message || 'Không lấy được link tải file')
      }
      const url: string = res.data.data.url

      // Trigger download — vì content-disposition: attachment đã set, browser sẽ tải xuống
      const a = document.createElement('a')
      a.href = url
      if (fileName) a.download = fileName
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
    onError: (err: any) => {
      const msg =
        err?.response?.status === 404
          ? 'File đối soát không tồn tại hoặc đã hết hạn.'
          : err?.message || 'Tải file thất bại.'
      toast.error(msg)
    },
  })
}
```

### 4.7. Page list — `src/pages/ReconcileHistory/index.tsx` (skeleton)

```tsx
import React from 'react'
import { Table, Tag, Button, Space } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import {
  RECONCILE_STATUS,
  RECONCILE_STATUS_COLOR_MAP,
  RECONCILE_TYPE,
} from '@/config/constants'
import { useReconcileHistory } from '@/hooks/useReconcileHistory'
import { useDownloadReconcileHistory } from '@/hooks/useDownloadReconcileHistory'
import { useFilter } from '@/store/filterSlice/useFilter'
import Filters from './components/Filters'
import type { ReconcileHistoryItem } from './types'

const ReconcileHistory: React.FC = () => {
  const { reconcileHistoryFilters, setReconcileHistoryFilters } = useFilter()
  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortOrder, setSortOrder] = React.useState<'ascend' | 'descend' | null>(
    'descend'
  )

  const { isPending, dataSource, total, page, limit } = useReconcileHistory({
    sortField,
    sortOrder,
  })
  const download = useDownloadReconcileHistory()

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      render: (_: any, __: any, index: number) =>
        (page - 1) * limit + index + 1,
    },
    {
      title: 'Loại đối soát',
      dataIndex: 'type',
      key: 'type',
      render: (v: string) =>
        RECONCILE_TYPE.find((t) => t.value === v)?.label || '---',
    },
    {
      title: 'Kỳ đối soát',
      key: 'period',
      render: (_: any, r: ReconcileHistoryItem) =>
        r.month && r.year
          ? `${String(r.month).padStart(2, '0')}/${r.year}`
          : '---',
    },
    {
      title: 'Tên file',
      dataIndex: 'file_name',
      key: 'file_name',
      render: (text: string) => text || '---',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const label =
          RECONCILE_STATUS.find((s) => s.value === status)?.label || '---'
        const color = RECONCILE_STATUS_COLOR_MAP[status] || 'default'
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      render: (date: string) =>
        date ? new Date(`${date}Z`).toLocaleString('vi-VN') : '---',
    },
    {
      title: 'Tác vụ',
      key: 'action',
      width: 120,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, r: ReconcileHistoryItem) => (
        <Space>
          <Button
            type="text"
            icon={<DownloadOutlined />}
            disabled={r.status !== 'SUCCESS' || !r.file_path}
            loading={download.isPending && download.variables?.id === r.id}
            onClick={() =>
              download.mutate({ id: r.id, fileName: r.file_name })
            }
          />
        </Space>
      ),
    },
  ]

  const onTableChange = (pagination: any, _f: any, sorter: any) => {
    setReconcileHistoryFilters({
      ...reconcileHistoryFilters,
      page: pagination.current,
      limit: pagination.pageSize,
    })
    if (sorter.field) {
      setSortField(sorter.field)
      setSortOrder(sorter.order)
    } else {
      setSortField(null)
      setSortOrder(null)
    }
  }

  return (
    <>
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
            showTotal: (t: number) => `Có ${t} kết quả`,
            pageSizeOptions: ['10', '20', '50', '100'],
            locale: { items_per_page: 'kết quả / trang' },
          }}
          onChange={onTableChange}
        />
      </div>
    </>
  )
}

export default ReconcileHistory
```

### 4.8. Filters component — `src/pages/ReconcileHistory/components/Filters.tsx` (gợi ý field)

| Field UI | Loại control | Map sang request |
|---|---|---|
| Đại lý tổng (company) | `Select` (load options từ `useCompaniesOptions`) | `company_id` |
| Loại đối soát | `Select` (`RECONCILE_TYPE`) | `type` |
| Năm | `Select` / `InputNumber` | `year` |
| Tháng | `Select` 1..12 | `month` |
| Trạng thái | `Select` (`RECONCILE_STATUS`) | `status` |
| Nút "Áp dụng" / "Xoá lọc" | — | `setReconcileHistoryFilters` / `resetReconcileHistoryFilter` |

> Tham khảo pattern filter của [src/pages/Transactions/components/Filters.tsx](../../src/pages/Transactions/components/Filters.tsx) — đã có Select hãng và date-range, dễ adapt.

### 4.9. Routing — bổ sung 2 chỗ

[src/config/routes.ts](../../src/config/routes.ts):
```ts
reconcileHistory: '/reconcile-history',
```

[src/Routes.tsx](../../src/Routes.tsx) — thêm trong mảng `children` của Layout:
```tsx
{ path: routes.reconcileHistory, element: <ReconcileHistory /> },
```

Và bổ sung mục menu trong [src/components/layouts/hydrogen/menu-items.tsx](../../src/components/layouts/hydrogen/menu-items.tsx) nhóm **"Quản lý đối soát"**.

---

## 5. Lưu ý nghiệp vụ & edge cases

1. **`created_at` là UTC** → khi render bằng `toLocaleString('vi-VN')` cần append `Z` (`new Date(\`${created_at}Z\`)`) để JS hiểu đúng timezone, tránh lệch 7h.
2. **`file_path` không phải URL** — không bao giờ render anchor `<a href={file_path}>`. Luôn đi qua `/download`.
3. **Presigned URL có expiry** — không lưu vào state lâu, không bookmark; mỗi click = 1 request mới.
4. **Status `FAILED`** thường đi kèm `file_path` rỗng → disable nút Tải; nếu user vẫn bấm thì backend trả 404 → toast "File không tồn tại hoặc đã hết hạn".
5. **Permission `ADMIN_VIEW`** — nếu role hiện tại không có quyền sẽ nhận 403; UI nên ẩn menu này theo `useAuth()` (xem `isApprover`/`isCreator`/`isViewer`).
6. **Sort mặc định** = `created_at desc` (mới nhất trên cùng). Cho phép user click sort cột "Thời gian tạo".
7. **Pagination** — `limit` tối đa 500 ở BE, FE để options `[10, 20, 50, 100]` cho UX nhất quán với các bảng khác.
8. **Query key** dùng `['reconcile-history', filters, sortField, sortOrder]` — React Query auto refetch khi filter đổi; KHÔNG cần `refetch()` thủ công.
9. **`onError` của download** — phân biệt 404 (file không có) và lỗi mạng để toast khác nhau.
10. **Tên field từ BE giữ nguyên `snake_case`** khi đặt `dataIndex` của AntD Table (đúng convention `project-overview.md` mục 3.1).

---

## 6. Checklist khi implement

- [ ] Thêm `RECONCILE_TYPE`, `RECONCILE_STATUS`, `RECONCILE_STATUS_COLOR_MAP` vào `config/constants.ts`
- [ ] Thêm route `reconcileHistory` vào `config/routes.ts` + đăng ký trong `Routes.tsx`
- [ ] Bổ sung `reconcileHistory` filter state + reducer + reset action trong `filterSlice`, expose qua `useFilter`
- [ ] Tạo `pages/ReconcileHistory/types.ts`
- [ ] Tạo 3 hook: `useReconcileHistory`, `useReconcileHistoryDetail`, `useDownloadReconcileHistory`
- [ ] Tạo `pages/ReconcileHistory/index.tsx` + `components/Filters.tsx`
- [ ] Thêm menu item "Lịch sử đối soát" vào sidebar (`menu-items.tsx`)
- [ ] Disable nút tải khi `status !== 'SUCCESS'` hoặc `file_path` rỗng
- [ ] Convert `created_at` UTC → giờ VN khi hiển thị
- [ ] Test 3 case: list lọc/không lọc, download success, download record FAILED (404 toast)

---

_Tham chiếu chéo: [.ai-context/project-overview.md](../project-overview.md) — Section 2 (Folder Structure), Section 3 (Coding Standards), Section 5 (Checklist khi viết code mới)._
