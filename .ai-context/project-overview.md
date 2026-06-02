# HDB Admin Portal — Project Overview

> Tài liệu mô tả tổng quan kiến trúc, quy ước và design system của dự án **hdb-admin-portal** (package name: `agent-banking`). Phục vụ cho việc onboarding cũng như làm ngữ cảnh cho các AI assistant khi đọc/sửa codebase.

---

## 1. Tech Stack

### Core framework & build
| Mục | Công nghệ | Ghi chú |
|---|---|---|
| Language | **TypeScript 5.7** | `strict: true`, `noImplicitAny: false` |
| UI framework | **React 19** | Function Component + Hooks (StrictMode bật) |
| Build tool | **Vite 6** | Plugin `@vitejs/plugin-react`, `vite-tsconfig-paths` |
| Routing | **React Router DOM 7** | `BrowserRouter` + `useRoutes` (config-based) |
| Linter | **ESLint 9** (flat config) + `typescript-eslint` | Rule `no-explicit-any`, `no-unused-vars` đang **off** |
| Test runner | **Vitest 4** + Testing Library + `jsdom` | Lệnh `yarn test` / `test:ui` / `test:coverage` |

### Data, state, server
| Mục | Công nghệ |
|---|---|
| Server state | **TanStack React Query 5** (+ Devtools) — query/mutation chuẩn cho mọi API call |
| Client state | **Redux Toolkit 2** + `react-redux` + **redux-persist** (whitelist: `auth`, `filter`) |
| HTTP client | **Axios** với singleton `axiosInstance` ở [src/config/axios.ts](src/config/axios.ts) — interceptor tự refresh token + queue request 401 |
| Form | **React Hook Form 7** + `@hookform/resolvers` (Yup hoặc Zod) |
| Validation | **Yup** và **Zod** đều được dùng |
| (Phụ) Atomic state | **Jotai 2** (có cài, ít dùng) |

### UI & styling
| Mục | Công nghệ |
|---|---|
| Primary component lib | **Ant Design 5** (`antd`) — `Table`, `Tabs`, `Modal`, `Spin`, `Tag`, `Space`, `Button`… dùng xuyên suốt |
| Phụ trợ | **RizzUI 1**, **@headlessui/react**, **react-select**, **react-datepicker**, **react-phone-input-2**, **react-quill-new**, **react-dropzone** |
| CSS framework | **Tailwind CSS 3.4** (utility-first), plugin `@tailwindcss/forms`, `@tailwindcss/container-queries`, `tailwind-merge`, `clsx` |
| Drag & Drop | `@dnd-kit/*` |
| Charts | `recharts` |
| Animation | `motion` (framer-motion successor) |
| Icons | `react-icons` (Bootstrap, Heroicons…), `@ant-design/icons` |
| Notification | `react-toastify` (chính) + `react-hot-toast` (có cài) |
| Date utils | `dayjs`, `date-arithmetic` |
| Khác | `lodash`, `swiper`, `simplebar-react`, `qrcode.react`, `react-to-print`, `file-saver`, `react-csv` |

---

## 2. Folder Structure

```
hdb-admin-portal/
├── public/                       # Static assets phục vụ trực tiếp
├── src/
│   ├── main.tsx                  # Entry point — bọc Provider/Persistor/QueryClient/Router/Toast
│   ├── App.tsx                   # Xử lý login-by-token, redirect, render RootRoutes
│   ├── Routes.tsx                # Khai báo cây route (config object)
│   ├── index.css                 # Tailwind directives + CSS variables theme (light/dark)
│   ├── vite-env.d.ts
│   │
│   ├── assets/                   # Static images/SVG đi qua bundler
│   │
│   ├── config/                   # Cấu hình runtime tách khỏi business logic
│   │   ├── axios.ts              # Axios instance + interceptor refresh token
│   │   ├── routes.ts             # Map tên route → path string
│   │   ├── constants.ts          # Enum dạng dữ liệu (TRANSACTION_STATUS, MERCHANT_STATUS…)
│   │   ├── enums.ts              # Các enum TypeScript
│   │   ├── env.ts                # Helper đọc biến môi trường (VITE_*)
│   │   ├── messages.ts           # Chuỗi thông báo dùng chung
│   │   ├── color-presets.ts      # Preset màu cho theme picker
│   │   └── site.config.tsx       # Cấu hình site (title, logo…)
│   │
│   ├── components/
│   │   ├── core/                 # UI kit nội bộ — kế thừa từ Isomorphic/RizzUI template
│   │   │   ├── components/       # Component dùng lại (Card, Modal, UploadFileModal, PreviewUploadModal…)
│   │   │   ├── shared/           # modal-views, drawer-views (cấp app)
│   │   │   ├── modal-views/      # Hook + context cho modal stack
│   │   │   ├── drawer-views/     # Hook + context cho drawer stack
│   │   │   ├── providers/        # ThemeProvider, JotaiProvider… (export `Providers`)
│   │   │   ├── hooks/            # Hook dùng chung của UI kit
│   │   │   ├── utils/            # Helper UI (cn, format…)
│   │   │   ├── types/            # Type của UI kit
│   │   │   ├── config/           # Config của UI kit
│   │   │   ├── data/             # Data tĩnh demo
│   │   │   └── fonts.ts          # Khai báo Inter + Lexend Deca (font variable)
│   │   ├── data/                 # Mock data tĩnh (di sản template)
│   │   └── layouts/              # Layout shell của app
│   │       ├── Layout.tsx        # Layout entry — sidebar + header + Outlet
│   │       ├── hydrogen/         # Bộ layout “hydrogen” (header, sidebar, menu-items)
│   │       ├── nav-menu/         # Component menu dropdown phức tạp
│   │       ├── layout-icons/     # Icon dùng riêng cho layout
│   │       ├── settings/         # Drawer cài đặt theme
│   │       └── *-dropdown.tsx    # Header dropdown (profile, messages, notification)
│   │
│   ├── pages/                    # Mỗi feature 1 thư mục — entry tên `index.tsx`
│   │   ├── Dashboard/            # index.tsx + components/
│   │   ├── MasterMerchants/      # index.tsx + types.ts + MasterMerchantDetail/ + MasterMerchantEdit.tsx + components/
│   │   ├── Merchants/            # index.tsx + types.ts + CreateMerchant/MerchantDetail/MerchantEdit + components/
│   │   ├── Staffs/               # index.tsx + types.ts + CreateStaff/StaffDetail/StaffEdit + components/
│   │   ├── Transactions/         # index.tsx + TransactionDetail.tsx + NonFinancialTransactionDetail.tsx + components/
│   │   └── Unauthorize.tsx       # Trang đăng nhập thất bại
│   │   # Quy ước: `components/` cùng cấp chứa sub-component / Filters / Table riêng cho feature
│   │
│   ├── hooks/                    # Custom hook tầng domain — bao bọc React Query
│   │   # Pattern: 1 file = 1 hook, tên bắt đầu bằng `use*`
│   │   # Ví dụ: useMerchants.ts, useTransactionHistory.ts,
│   │   #         useExportNonFinancialTransactions.ts, useStaffDetail.ts, …
│   │
│   ├── providers/                # Context Provider cấp app
│   │   └── ConfirmProvider.tsx   # Hook `useConfirm()` mở confirm dialog
│   │
│   ├── store/                    # Redux Toolkit
│   │   ├── index.ts              # configureStore + persistReducer
│   │   ├── authSlice/            # index.ts (slice) + useAuth.ts (selector hook)
│   │   ├── layoutSlice/          # index.ts + useLayout.ts
│   │   ├── filterSlice/          # index.ts + useFilter.ts — lưu filter từng feature, persist
│   │   └── useAppSelector.ts     # Typed selector helper
│   │
│   ├── types/                    # Global type (PaginatedResponse…)
│   │   └── index.ts
│   │
│   └── tests/                    # Setup + helper cho Vitest
│
├── release/                      # Asset/script bundle phục vụ release
├── aws_prod.sh / aws_uat.sh      # Script deploy AWS
├── docker-compose.yml
├── Makefile
├── tailwind.config.ts            # Theme tokens (color, breakpoint, font)
├── postcss.config.ts
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.{json,app.json,node.json}
├── eslint.config.js              # Flat config
└── package.json
```

### Path alias (TypeScript + Vite)
Khai báo trong [tsconfig.app.json](tsconfig.app.json#L26-L38) và áp dụng nhờ `vite-tsconfig-paths`:

| Alias | Map tới |
|---|---|
| `@/*` | `src/*` |
| `@core/*` | `src/components/core/*` |
| `@components/*` | `src/components/*` |
| `@layouts/*` | `src/components/layouts/*` |
| `@pages/*` | `src/pages/*` |
| `@hooks/*` | `src/hooks/*` |
| `@services/*` | `src/services/*` *(reserved — hiện không có thư mục `services/`, API call nằm trong `hooks/` hoặc inline tại component)* |
| `@utils/*` | `src/utils/*` *(reserved)* |
| `@assets/*` | `src/assets/*` |
| `@types/*` | `src/types/*` |
| `@public/*` | `public/*` |

> **Lưu ý:** Project hiện **không có thư mục `services/` riêng**. Mỗi API request được viết thẳng trong `useQuery` / `useMutation` của một hook trong [src/hooks/](src/hooks/), gọi qua `axiosInstance` từ [src/config/axios.ts](src/config/axios.ts). Khi thêm endpoint mới, tạo file `useXxx.ts` mới theo cùng pattern (không tạo `services/` trừ khi tái cấu trúc tổng thể).

---

## 3. Coding Standards

### 3.1. Đặt tên (Naming)
| Loại | Quy ước | Ví dụ |
|---|---|---|
| Component (file & symbol) | **PascalCase** | `MerchantDetail.tsx`, `NonFinancialTransactions.tsx`, `<Card />` |
| Hook (file & symbol) | **camelCase** với prefix `use*` | `useTransactionHistory.ts` → `useTransactionHistory()` |
| Page entry | `index.tsx` trong thư mục PascalCase của feature | `pages/Transactions/index.tsx` |
| Biến / function | **camelCase** | `isPending`, `onPaginationChange`, `setAuthState` |
| Constant export | **UPPER_SNAKE_CASE** | `TRANSACTION_STATUS`, `ROW_PER_PAGE_OPTIONS`, `ROLES` |
| Type / Interface | **PascalCase**, không prefix `I` | `FilterState`, `PaginatedResponse<T>`, `TransactionHistoryRequestBody` |
| Redux slice file | `index.ts` trong thư mục `{name}Slice/` | `store/authSlice/index.ts` |
| Hook selector của slice | `use{Slice}.ts` cùng thư mục | `store/authSlice/useAuth.ts`, `store/filterSlice/useFilter.ts` |
| **API field & DTO** | **snake_case** (vì backend trả snake_case, FE giữ nguyên) | `status_id`, `approval_status`, `transaction_code`, `store_code`, `staff_code`, `phone_number` |
| Route path | **kebab-case** | `/master-merchants`, `/transactions/non-financial/:id` |
| Route key trong `routes.ts` | **camelCase** | `nonFinancialTransactionDetail`, `editMasterMerchant` |

> **Quy tắc mixed-case quan trọng:** UI/business logic **camelCase**, dữ liệu đi/ra API **snake_case**. Đừng convert tên trường khi truyền vào `dataIndex` của `Table` — giữ nguyên `status_id`, `approval_status`… như backend trả về.

### 3.2. Component
- **Function Component bắt buộc** — toàn bộ codebase không có class component.
- Type prop: `React.FC<Props>` hoặc khai báo `interface Props` rồi `({ ... }: Props) =>`. Cả hai pattern đều đang dùng.
- Mỗi file `.tsx` export **default** một component duy nhất; helper component nhỏ dùng nội bộ thì để inline cùng file (xem cách `NonFinancialTransactions.tsx` khai báo `columns` ngay trong body).
- Sub-component theo feature đặt trong `pages/{Feature}/components/`, KHÔNG đặt vào `components/core/` (core/ chỉ chứa UI dùng chung toàn app).
- Khi cần fetch data, **luôn đi qua một custom hook** trong `src/hooks/` (chuẩn React Query). Không gọi `axiosInstance` trực tiếp trong component (trừ trường hợp đặc biệt như mutation đăng nhập trong `App.tsx`).

### 3.3. Quy ước phong cách viết
- **Indent**: 2 spaces. Không dùng dấu chấm phẩy ở cuối dòng (xem các file `.tsx` mới). Trailing comma theo Prettier mặc định.
- **Import** sắp xếp: thư viện ngoài → alias `@/…` → relative `./…`.
- **Strict TS** nhưng `noImplicitAny: false` → cho phép `any` khi cần (ESLint cũng tắt rule `no-explicit-any`). Khi nhận dữ liệu API tự do, dùng `any` hoặc generic `PaginatedResponse<T>`.
- **`render` cell mặc định**: `(text: string) => text || '---'` cho cột text-trống-fallback (xem [NonFinancialTransactions.tsx](src/pages/Transactions/components/NonFinancialTransactions.tsx)).

### 3.4. Styling
- **Tailwind CSS là cách styling chính**: dùng utility class trực tiếp trên JSX (`className="flex flex-col items-start gap-4 ..."`).
- **Không dùng styled-components / Emotion / CSS Modules** trong codebase (không có file `.module.css`, không có `styled.div\`...\`` trong source).
- **CSS global** chỉ nằm ở [src/index.css](src/index.css) — chứa Tailwind directives (`@tailwind base/components/utilities`) và **CSS variables theme** (`--primary-default`, `--gray-500`, …) cho light/dark mode (`[data-theme='dark']`).
- **AntD style override** dùng class Tailwind kết hợp prop `className` của AntD; khi cần override sâu hơn thì thêm class custom rồi viết rule trong `index.css` (ví dụ `.transaction-tabs`).
- **`clsx` + `tailwind-merge`** để compose class điều kiện (chuẩn `cn()` helper trong `@core/utils`).
- **`prettier-plugin-tailwindcss`** sort class tự động.

### 3.5. State & data flow
- Server state → React Query (`useQuery`, `useMutation`). Query key đặt theo dạng mảng có namespace: `['transaction-history', filters, sortField, sortOrder]`.
- Client state global → Redux Toolkit slice + custom hook `use{Slice}()` (KHÔNG `useSelector` lẻ trong component).
- Filter mỗi feature **đều persist** qua `redux-persist` (whitelist `filter`) — đảm bảo filter giữ nguyên khi user reload.
- Auth state cũng được persist; access/refresh token lưu **trong `localStorage`** (riêng), không trong redux-persist.
- Axios interceptor tự refresh token + retry với queue 401 — component không phải tự xử lý lỗi token.

---

## 4. Design System

### 4.1. Bảng màu chủ đạo (CSS Variables, định nghĩa tại [src/index.css](src/index.css))
Theme dùng cú pháp `rgb(<vars> / <alpha-value>)` của Tailwind v3 để hỗ trợ opacity. Sửa giá trị tại CSS variables sẽ ảnh hưởng toàn bộ app.

#### Brand
| Token | Hex | Mục đích |
|---|---|---|
| `--primary-lighter` | `#fee2e2` | Nền nhẹ, badge, hover surface |
| `--primary-default` | **`#DA2128`** | **HDBank red — màu thương hiệu chính** |
| `--primary-dark` | `#BE1128` | Trạng thái active/pressed |
| `--primary-foreground` | `#FFFFFF` | Text/icon đặt trên nền primary |

#### Secondary
| Token | Hex |
|---|---|
| `--secondary-lighter` | `#dde3ff` |
| `--secondary-default` | `#4e36f5` |
| `--secondary-dark` | `#432ad8` |
| `--secondary-foreground` | `#FFFFFF` |

#### Semantic
| Vai trò | lighter | default | dark |
|---|---|---|---|
| Red / Error | `#f7d4d6` | `#ee0000` | `#c50000` |
| Orange / Warning | `#ffefcf` | `#f5a623` | `#ab570a` |
| Blue / Info | `#d3e5ff` | `#0070f3` | `#0761d1` |
| Green / Success | `#b9f9cf` | `#11a849` | `#11843c` |

#### Gray scale (11 bậc, light theme)
`gray-0` `#ffffff` → `gray-50` `#fafafa` → `gray-100` `#f1f1f1` → `gray-200` `#e3e3e3` → `gray-300` `#dfdfdf` → `gray-400` `#929292` → `gray-500` `#666666` → `gray-600` `#484848` → `gray-700` `#333333` → `gray-800` `#222222` → `gray-900` `#111111` → `gray-1000` `#000000`.

Dark theme đảo ngược thang xám (`gray-0` `#000`, `gray-1000` `#fff`) — định nghĩa cùng file dưới selector `[data-theme='dark']`.

#### Surface
| Token | Light | Dark | Vai trò |
|---|---|---|---|
| `--background` | `#ffffff` | `#08090e` | Nền app |
| `--foreground` | `#484848` | `#dfdfdf` | Màu text mặc định |
| `--muted` | `#e3e3e3` | — | Border/divider nhẹ |
| `--muted-foreground` | `#929292` | — | Text phụ |

#### Trạng thái giao dịch / merchant (badge)
Định nghĩa ở [src/config/constants.ts](src/config/constants.ts):
- `TRANSACTION_STATUS_COLOR_MAP`: `SUCCESSFUL → green`, `FAILED/EXPIRED → red`, `TIME_OUT/WAITING_APPROVE → orange`, `CREATED → blue`.
- `MERCHANT_STATUS_COLOR_MAP`: `ACTIVE → green`, `REJECTED → red`, `WAITING_* → orange`, `INACTIVE_* → volcano`.
- Render qua `<Tag color={...}>` của AntD.

### 4.2. Typography
- **Font families** (khai báo Tailwind: [tailwind.config.ts](tailwind.config.ts#L74-L77)):
  - `font-inter` → biến `--font-inter` (**Inter** — sans-serif, dùng làm font UI mặc định).
  - `font-lexend` → biến `--font-lexend` (**Lexend Deca** — dùng cho heading/display khi cần).
- Khai báo gốc tại [src/components/core/fonts.ts](src/components/core/fonts.ts) (nguyên bản dùng `next/font/google` — di sản template Next.js; trong môi trường Vite hiện tại các biến CSS vẫn được set ở `index.css`/`Providers`).
- Hệ size dùng Tailwind mặc định (`text-xs` … `text-4xl`); heading lớn nhất gặp trong app là `text-3xl font-bold` (xem [Transactions/index.tsx](src/pages/Transactions/index.tsx#L62)).

### 4.3. Spacing, shadow, radius
- Spacing dùng scale Tailwind mặc định (`gap-2`, `p-6`, `px-6 py-4`…).
- Radius chính: `rounded-lg` (card list), `rounded-2xl` (Card lớn — xem [Card.tsx](src/components/core/components/Card.tsx#L10)).
- Shadow chuẩn của card: `shadow-[0px_1px_4px_0px_rgba(51,49,65,0.25)]` (panel list) và `shadow-[0_1px_4px_rgba(218,33,40,0.08)]` (Card brand-tinted).
- Breakpoint mở rộng: thêm `xs: 480px` và `3xl: 1920px`, `4xl: 2560px` so với mặc định Tailwind.

### 4.4. Dark mode
- Bật bằng attribute `data-theme="dark"` trên `<html>` (Tailwind config: `darkMode: ['class', '[data-theme="dark"]']`).
- Chuyển theme qua `ThemeProvider` trong `@core/providers` (prop `defaultTheme="light"` set ở [main.tsx](src/main.tsx#L41)).

---

## 5. Conventions tổng kết — checklist khi viết code mới

1. **Tạo page mới** → thêm thư mục `src/pages/{FeatureName}/`, file entry `index.tsx`, sub-component vào `components/`, type chung vào `types.ts`, route khai báo trong [src/config/routes.ts](src/config/routes.ts) + đăng ký ở [src/Routes.tsx](src/Routes.tsx).
2. **Gọi API mới** → tạo hook `src/hooks/useXxx.ts`, dùng `useQuery`/`useMutation` + `axiosInstance`, không gọi axios trực tiếp trong component.
3. **State persist** → thêm field vào slice tương ứng trong `src/store/`, expose qua hook `use{Slice}()`. Nếu là filter, đảm bảo có cả `setXxxFilter` và `resetXxxFilter`.
4. **Bảng (Table)** → dùng `antd` Table, columns định nghĩa inline trong component, mỗi cột có `dataIndex` khớp **snake_case** từ API, render fallback `'---'` cho text rỗng, dùng `<Tag color={...}>` cho status.
5. **Styling** → Tailwind utility trước; chỉ thêm CSS vào `index.css` khi cần override AntD hoặc set CSS variable.
6. **Toast** → `react-toastify` (`toast.success / toast.error`) — đã có `<ToastContainer />` ở root.
7. **Confirm dialog** → hook `useConfirm()` từ [src/providers/ConfirmProvider.tsx](src/providers/ConfirmProvider.tsx).
8. **Quyền (RBAC)** → đọc `isApprover` / `isCreator` / `isViewer` từ `useAuth()`; phân quyền tại component (ẩn/hiện nút).

---

_Cập nhật lần cuối: 2026-05-15. Khi cập nhật stack/quy ước, sửa trực tiếp file này để giữ là single-source-of-truth cho AI agent._
