import React from 'react'
import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb, message, Button, Switch, Checkbox } from 'antd'
import { Input, Select } from 'rizzui'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { NavLink } from 'react-router-dom'
import { routes } from '@/config/routes'

interface MerchantFormValues {
  name: string
  code: string
  address: string
  ward: string
  district: string
  accountOption: boolean
  accountSelect: string
  monthlyLimit: number
  dailyLimit: number
  needApprove: boolean
  approveThreshold: number
  transactionTypes: string[]
}

export default function CreateMerchant() {
  const { handleSubmit, control } = useForm<MerchantFormValues>({
    defaultValues: {
      name: '',
      code: '',
      address: '',
      ward: '1',
      district: '1',
      accountOption: false,
      accountSelect: '',
      monthlyLimit: 0,
      dailyLimit: 0,
      needApprove: false,
      approveThreshold: 0,
      transactionTypes: [],
    },
  })

  // Create mutation for submitting the payload
  const createMerchantMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post(
        '/v1/admin/store/create',
        payload
      )
      return data
    },
    onSuccess: () => {
      message.success('Đại lý được tạo thành công!')
    },
    onError: () => {
      message.error('Không thể tạo đại lý.')
    },
  })

  // Map form values to payload structure and submit
  const onSubmit = (data: MerchantFormValues) => {
    const payload = {
      address: data.address,
      approve_threshold: data.approveThreshold,
      company_id: 1, // Set to the appropriate company ID
      name: data.name,
      need_approve_transaction: data.needApprove,
      need_approve_transaction_types: data.transactionTypes,
      parent_id: 1, // Set to the appropriate parent ID
    }

    const fakePayload = {
      address: 'string',
      approve_threshold: 0,
      company_id: 1,
      name: 'string',
      need_approve_transaction: true,
      need_approve_transaction_types: ['string'],
      parent_id: 0,
    }
    createMerchantMutation.mutate(fakePayload)
  }

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex justify-start items-center gap-2 mb-4">
        <NavLink
          to={routes.merchant}
          className={({ isActive }) =>
            `text-base font-semibold hover:underline ${
              !isActive ? 'text-[#A1AAB2]' : 'text-[#000000]'
            }`
          }
        >
          Quản lý điểm đại lý
        </NavLink>
        <div className="text-base font-semibold text-[#A1AAB2]">/</div>
        <span className="text-base font-semibold text-[#A1AAB2]">
          Đăng ký điểm đại lý
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <main className="flex p-6 flex-col items-start gap-6 rounded-lg bg-white">
          <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal">
            Thông tin điểm đại lý công ty A
          </div>

          <div className="grid grid-cols-2 gap-6 w-full">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Tên điểm đại lý *"
                  placeholder="Nhập tên điểm đại lý"
                  className="w-full"
                />
              )}
            />
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Mã điểm đại lý *"
                  placeholder="Nhập mã điểm đại lý"
                  className="w-full"
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Địa chỉ *"
                  placeholder="Nhập địa chỉ"
                  className="w-full"
                />
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <Controller
                name="ward"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Phường/Xã *"
                    placeholder="Chọn phường/xã"
                    className="w-full"
                    options={[
                      { label: 'Phường 1', value: '1' },
                      { label: 'Phường 2', value: '2' },
                    ]}
                    defaultValue="1"
                  />
                )}
              />
              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Quận/Huyện *"
                    placeholder="Chọn quận/huyện"
                    className="w-full"
                    options={[
                      { label: 'Quận 1', value: '1' },
                      { label: 'Quận 2', value: '2' },
                    ]}
                    defaultValue="1"
                  />
                )}
              />
            </div>

            <div className="col-span-1">
              <Controller
                name="accountOption"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} className="w-full">
                    Tài khoản chuyên thu bằng chuyên chi
                  </Checkbox>
                )}
              />
            </div>
            <div className="col-span-1" />

            <div className="col-span-2">
              <Controller
                name="accountSelect"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Tài khoản chuyên chi *"
                    placeholder="Chọn tài khoản chuyên chi"
                    className="w-full"
                    options={[]} // Populate options as needed
                    defaultValue="1"
                  />
                )}
              />
            </div>
          </div>

          <div className="text-[#212B36] text-[28px] not-italic font-bold leading-normal">
            Hạn mức giao dịch
          </div>
          <div className="grid grid-cols-4 gap-6 w-full">
            <Controller
              name="monthlyLimit"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Hạn mức trong tháng *"
                  placeholder="Nhập hạn mức trong tháng"
                  className="w-full"
                />
              )}
            />
            <Controller
              name="dailyLimit"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Hạn mức trong ngày *"
                  placeholder="Nhập hạn mức trong ngày"
                  className="w-full"
                />
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="needApprove"
              control={control}
              render={({ field }) => <Switch {...field} />}
            />
            <span className="text-[#212B36] text-[28px] not-italic font-bold leading-normal">
              Yêu cầu trưởng cửa hàng duyệt giao dịch
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full">
            <Controller
              name="approveThreshold"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Ngưỡng giá trị cần duyệt *"
                  placeholder="Nhập ngưỡng giá trị cần duyệt"
                  className="w-full"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-4 gap-6 w-full">
            <Controller
              name="transactionTypes"
              control={control}
              render={({ field }) => (
                <div className="flex gap-6">
                  <Checkbox
                    {...field}
                    value="Rút tiền"
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...(field.value || []), 'Rút tiền'])
                      } else {
                        field.onChange(
                          (field.value || []).filter(
                            (val: string) => val !== 'Rút tiền'
                          )
                        )
                      }
                    }}
                  >
                    Rút tiền
                  </Checkbox>
                  <Checkbox
                    {...field}
                    value="Nộp tiền"
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...(field.value || []), 'Nộp tiền'])
                      } else {
                        field.onChange(
                          (field.value || []).filter(
                            (val: string) => val !== 'Nộp tiền'
                          )
                        )
                      }
                    }}
                  >
                    Nộp tiền
                  </Checkbox>
                  <Checkbox
                    {...field}
                    value="Ủy nhiệm chi"
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...(field.value || []), 'Ủy nhiệm chi'])
                      } else {
                        field.onChange(
                          (field.value || []).filter(
                            (val: string) => val !== 'Ủy nhiệm chi'
                          )
                        )
                      }
                    }}
                  >
                    Ủy nhiệm chi
                  </Checkbox>
                  <Checkbox
                    {...field}
                    value="Ủy nhiệm thu"
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...(field.value || []), 'Ủy nhiệm thu'])
                      } else {
                        field.onChange(
                          (field.value || []).filter(
                            (val: string) => val !== 'Ủy nhiệm thu'
                          )
                        )
                      }
                    }}
                  >
                    Ủy nhiệm thu
                  </Checkbox>
                </div>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-4 w-full mt-8">
            <Button
              type="default"
              className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 text-black/60 text-base font-semibold"
            >
              Hủy bỏ
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              className="rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-900/20 inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#DA2128] text-base font-semibold text-white"
              // loading={createMerchantMutation.isLoading}
            >
              Tạo đại lý
            </Button>
          </div>
        </main>
      </form>
    </>
  )
}
