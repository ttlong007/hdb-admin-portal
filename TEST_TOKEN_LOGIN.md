# 🧪 Test Plan - Token Login Fix

## ✅ Các thay đổi đã implement

### 1. **App.tsx**
- ✅ Thêm error handling cho loginByTokenMutation
- ✅ Show loading spinner với message "Đang xác thực..." trong khi login
- ✅ Prevent RootRoutes render cho đến khi login hoàn tất
- ✅ Thêm console.log để debug

### 2. **Unauthorize.tsx**
- ✅ Remove redundant token checking logic
- ✅ Simplify component - chỉ handle unauthorized state
- ✅ Improve UI với message rõ ràng hơn

## 🧪 Test Cases

### Test Case 1: Login thành công với token hợp lệ ✅

**Steps:**
1. Clear localStorage (hoặc logout nếu đang login)
2. Mở URL: `http://localhost:5173/?token=VALID_TOKEN`
3. Quan sát console log

**Expected Result:**
- ✅ Show loading spinner với text "Đang xác thực..."
- ✅ Console log: "Starting login by token..."
- ✅ API call `/v1/admin/auth/login-by-token` thành công
- ✅ Tokens được lưu vào localStorage
- ✅ Redirect đến trang Master Merchants
- ✅ Token được remove khỏi URL
- ❌ KHÔNG bị redirect đến /unauthorize

### Test Case 2: Login thất bại với token không hợp lệ ❌

**Steps:**
1. Clear localStorage
2. Mở URL: `http://localhost:5173/?token=INVALID_TOKEN`

**Expected Result:**
- ✅ Show loading spinner
- ✅ Toast error hiển thị: "Không thể đăng nhập. Vui lòng thử lại."
- ✅ Redirect đến `/unauthorize`
- ✅ Show button "Đăng nhập" để về trang login chính

### Test Case 3: Login thất bại do network error 🌐

**Steps:**
1. Disconnect internet hoặc turn off API server
2. Mở URL với token
3. Check behavior

**Expected Result:**
- ✅ Show loading spinner
- ✅ Toast error: "Không thể đăng nhập. Vui lòng thử lại."
- ✅ Redirect đến `/unauthorize`

### Test Case 4: User đã có session, mở URL không có token 🔐

**Steps:**
1. Login bình thường (có accessToken trong localStorage)
2. Mở URL: `http://localhost:5173/`

**Expected Result:**
- ✅ KHÔNG show loading spinner
- ✅ Redirect trực tiếp đến Master Merchants
- ✅ Giữ nguyên session

### Test Case 5: Race condition test (quan trọng!) ⚡

**Steps:**
1. Clear localStorage
2. Mở URL với token
3. Nhanh chóng refresh page nhiều lần trong vòng 2-3 giây

**Expected Result:**
- ✅ loginAttempted.current ref prevent duplicate API calls
- ✅ Chỉ 1 API call được thực hiện
- ✅ Không bị loop hoặc multiple redirects

## 🔍 Debug Checklist

### Console Logs để quan sát:
```
1. "Starting login by token..." - khi bắt đầu login
2. Network tab: POST /v1/admin/auth/login-by-token
3. Redux DevTools: auth state changes
4. localStorage: accessToken và refreshToken được set
```

### Common Issues:
- ❌ Vẫn bị redirect đến /unauthorize → Check API response
- ❌ Infinite loop → Check loginAttempted.ref
- ❌ Token không clear khỏi URL → Check window.history.replaceState
- ❌ Loading spinner không hiện → Check isLoggingIn state

## 📱 Test trên các môi trường

### Local Development
```bash
npm run dev
# Test với URL: http://localhost:5173/?token=xxx
```

### UAT Environment
```bash
# Deploy to UAT first
# Test với URL: https://admin-uat.agentbanking.hdbank.com.vn/?token=xxx
```

### Production (sau khi UAT pass)
```bash
# Deploy to production
# Test với actual Agent Banking Portal link
```

## ✅ Success Criteria

Fix được coi là thành công khi:
1. ✅ Lần đầu mở URL với token → Login thành công, KHÔNG bị đá về /unauthorize
2. ✅ Token invalid → Show error message rõ ràng
3. ✅ User experience smooth, không thấy flash/flicker giữa các trang
4. ✅ Console không có error logs (trừ expected errors)
5. ✅ Token được clean khỏi URL sau khi login thành công

## 🚀 Next Steps

1. Run local test với token thật từ Agent Banking Portal
2. Nếu local test pass → Deploy to UAT
3. Test trên UAT với actual flow
4. Nếu UAT test pass → Deploy to Production
5. Monitor Production logs trong 24h đầu

---

**Note:** Để lấy token test, có thể:
- Inspect network tab khi click vào Agent Banking Portal
- Copy token từ URL query parameter
- Hoặc contact backend team để get test token
