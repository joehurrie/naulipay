// ─── NauliPay API Client ──────────────────────────────────────────────────────
// Typed wrappers for every backend endpoint described in the OpenAPI spec.

import type {
  ActivateRouteRequest,
  AdminCardAssignOut,
  CardMappingOut,
  CardNotLinkedOut,
  CreditLineOut,
  CreditRepaymentCreate,
  CreditRepaymentOut,
  DriverAssign,
  FareEstimateOut,
  FavoriteVehicleOut,
  HealthResponse,
  LocationPingIn,
  LoopMerchantAccountIn,
  LoopMerchantAccountOut,
  LoyaltyPointOut,
  MerchantPaymentConfigOut,
  MerchantPaymentConfigUpdate,
  NearbySearchResponse,
  NotificationOut,
  OTPRequest,
  OTPResponse,
  OTPVerify,
  PayoutOut,
  PayoutSummary,
  PayoutWithdrawRequest,
  QRPaymentSessionOut,
  QRScanRequest,
  RegisterCardsRequest,
  RouteCreate,
  RouteOut,
  RouteUpdate,
  ShareLinkResponse,
  STKPushRequestOut,
  TapCardOut,
  TapPaymentRequest,
  TokenResponse,
  TopUpOut,
  TopUpRequest,
  TransactionOut,
  TripCreate,
  TripOut,
  UserOut,
  UserUpdate,
  VehicleCreate,
  VehicleDocumentCreate,
  VehicleDocumentOut,
  VehicleLocationOut,
  VehicleOut,
  VehicleQROut,
  VehicleUpdate,
  WalletOut,
  WalletQRPayRequest,
} from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://3.231.57.223.sslip.io'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('np_token')
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('np_token', token)
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('np_token')
  }
}

export class ApiError extends Error {
  status: number
  data: unknown
  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  opts: { public?: boolean; readerKey?: string } = {}
): Promise<T> {
  const url = `${API_BASE}${path}`
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  if (opts.readerKey) {
    headers.set('X-Reader-Key', opts.readerKey)
  } else if (!opts.public) {
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, { ...options, headers })
  let data: unknown
  const text = await res.text()
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!res.ok) {
    const msg = typeof data === 'object' && data && 'detail' in data
      ? String((data as { detail?: string }).detail)
      : res.statusText
    throw new ApiError(msg || res.statusText, res.status, data)
  }

  return data as T
}

function get<T>(path: string, opts?: { public?: boolean; readerKey?: string }) {
  return request<T>(path, { method: 'GET' }, opts)
}

function post<T>(path: string, body?: unknown, opts?: { public?: boolean; readerKey?: string }) {
  return request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }, opts)
}

function patch<T>(path: string, body?: unknown) {
  return request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined })
}

function del<T>(path: string) {
  return request<T>(path, { method: 'DELETE' })
}

function queryString(params: Record<string, string | number | boolean | undefined>) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) qs.set(k, String(v))
  })
  return qs.toString()
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  requestOtp: (body: OTPRequest) => post<OTPResponse>('/auth/otp/request', body, { public: true }),
  verifyOtp: (body: OTPVerify) => post<TokenResponse>('/auth/otp/verify', body, { public: true }),
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  me: () => get<UserOut>('/users/me'),
  updateMe: (body: UserUpdate) => patch<UserOut>('/users/me', body),
  activateTapCard: (cardUid: string) =>
    post<TapCardOut>(`/users/me/tap-card?${queryString({ card_uid: cardUid })}`, {}),
  listTapCards: () => get<TapCardOut[]>('/users/me/tap-cards'),
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export const walletApi = {
  me: () => get<WalletOut>('/wallet/me'),
  topup: (body: TopUpRequest) => post<TopUpOut>('/wallet/topup', body),
  topupStatus: (topupId: string) => get<TopUpOut>(`/wallet/topup/${topupId}`),
}

// ─── Vehicles / Fleet ─────────────────────────────────────────────────────────

export const vehiclesApi = {
  list: (plateNumber?: string) =>
    get<VehicleOut[]>(`/vehicles?${queryString({ plate_number: plateNumber })}`),
  create: (body: VehicleCreate) => post<VehicleOut>('/vehicles', body),
  nearby: (lat: number, lng: number, category?: string) =>
    get<NearbySearchResponse>(`/vehicles/nearby/search?${queryString({ lat, lng, category })}`, { public: true }),
  get: (id: string) => get<VehicleOut>(`/vehicles/${id}`, { public: true }),
  location: (id: string) => get<VehicleLocationOut | null>(`/vehicles/${id}/location`),
  update: (id: string, body: VehicleUpdate) => patch<VehicleOut>(`/vehicles/${id}`, body),
  activateRoute: (id: string, body: ActivateRouteRequest) =>
    post<VehicleOut>(`/vehicles/${id}/activate-route`, body),
  generateQR: (id: string) => post<VehicleQROut>(`/vehicles/${id}/qr`, undefined, { public: true }),
  assignDriver: (id: string, body: DriverAssign) =>
    post<{ driver_id: string; vehicle_id: string }>(`/vehicles/${id}/assign-driver`, body),
  uploadDocument: (id: string, body: VehicleDocumentCreate) =>
    post<VehicleDocumentOut>(`/vehicles/${id}/documents`, body),
  listDocuments: (id: string) => get<VehicleDocumentOut[]>(`/vehicles/${id}/documents`, { public: true }),
  verifyDocument: (vehicleId: string, docId: string) =>
    post<VehicleDocumentOut>(`/vehicles/${vehicleId}/documents/${docId}/verify`, {}),
  ping: (id: string, body: LocationPingIn) =>
    post<{ status: string }>(`/vehicles/${id}/ping`, body, { public: true }),
  favorite: (id: string) => post<FavoriteVehicleOut>(`/vehicles/${id}/favorite`, {}),
  unfavorite: (id: string) => request<void>(`/vehicles/${id}/favorite`, { method: 'DELETE' }),
}

// ─── Favorites (track your matatu) ─────────────────────────────────────────────

export const favoritesApi = {
  list: () => get<FavoriteVehicleOut[]>('/favorites'),
}

// ─── Routes ───────────────────────────────────────────────────────────────────

export const routesApi = {
  list: () => get<RouteOut[]>('/routes'),
  create: (body: RouteCreate) => post<RouteOut>('/routes', body),
  update: (id: string, body: RouteUpdate) => patch<RouteOut>(`/routes/${id}`, body),
}

// ─── Trips ────────────────────────────────────────────────────────────────────

export const tripsApi = {
  list: () => get<TripOut[]>('/trips'),
  create: (body: TripCreate) => post<TripOut>('/trips', body),
  get: (id: string) => get<TripOut>(`/trips/${id}`, { public: true }),
  bookSeat: (id: string) => post<TripOut>(`/trips/${id}/book-seat`, {}),
  start: (id: string) => post<TripOut>(`/trips/${id}/start`, {}),
  complete: (id: string) => post<TripOut>(`/trips/${id}/complete`, {}),
  cancel: (id: string) => del<void>(`/trips/${id}/cancel`),
  shareLink: (id: string) => get<ShareLinkResponse>(`/trips/${id}/share-link`, { public: true }),
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export const paymentsApi = {
  tap: (body: TapPaymentRequest, readerKey: string) =>
    post<TransactionOut | CardNotLinkedOut>('/payments/tap', body, { readerKey }),
  qrPay: (body: WalletQRPayRequest) => post<TransactionOut>('/payments/qr', body),
  qrScan: (body: QRScanRequest) => post<QRPaymentSessionOut | STKPushRequestOut>('/payments/qr/scan', body),
  qrStatus: (sessionId: string) => get<QRPaymentSessionOut>(`/payments/qr/${sessionId}/status`, { public: true }),
  cancelQr: (sessionId: string) => request<void>(`/payments/qr/${sessionId}/cancel`, { method: 'DELETE' }, { public: true }),
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export const transactionsApi = {
  list: () => get<TransactionOut[]>('/transactions'),
  get: (id: string) => get<TransactionOut>(`/transactions/${id}`, { public: true }),
  refund: (id: string) => post<TransactionOut>(`/transactions/${id}/refund`, {}),
}

// ─── Payment Config ───────────────────────────────────────────────────────────

export const paymentConfigApi = {
  get: () => get<MerchantPaymentConfigOut>('/payments/config'),
  update: (body: MerchantPaymentConfigUpdate) => patch<MerchantPaymentConfigOut>('/payments/config', body),
  getLoopAccount: () => get<LoopMerchantAccountOut>('/payments/config/loop-account'),
  linkLoopAccount: (body: LoopMerchantAccountIn) =>
    post<LoopMerchantAccountOut>('/payments/config/loop-account', body),
  verifyLoopAccount: () => post<{ is_verified: boolean }>('/payments/config/loop-account/verify', {}),
}

// ─── Payouts ──────────────────────────────────────────────────────────────────

export const payoutsApi = {
  list: () => get<PayoutOut[]>('/payouts'),
  summary: () => get<PayoutSummary>('/payouts/summary'),
  creditEligibility: () => get<CreditLineOut>('/payouts/credit-eligibility'),
  get: (id: string) => get<PayoutOut>(`/payouts/${id}`),
  withdraw: (id: string, body: PayoutWithdrawRequest) =>
    post<PayoutOut>(`/payouts/${id}/withdraw`, body),
}

// ─── Loyalty ──────────────────────────────────────────────────────────────────

export const loyaltyApi = {
  get: () => get<LoyaltyPointOut>('/loyalty'),
  credit: () => get<CreditLineOut>('/loyalty/credit'),
  repay: (body: CreditRepaymentCreate) => post<CreditRepaymentOut>('/loyalty/credit/repay', body),
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  listCards: (status?: string) =>
    get<CardMappingOut[]>(`/admin/cards?${queryString({ status })}`),
  registerCards: (body: RegisterCardsRequest) => post<CardMappingOut[]>('/admin/cards', body),
  assignCard: (cardId: string, userId: string) =>
    post<AdminCardAssignOut>(`/admin/cards/${cardId}/assign?${queryString({ user_id: userId })}`),
  bulkIssueCards: (count: number) =>
    post<string[]>(`/admin/cards/bulk-issue?${queryString({ count })}`),
  fleetCompliance: () => get<Record<string, unknown>[]>('/admin/fleet-compliance'),
  fleetDensity: () => get<{ active_vehicles: number }>('/admin/fleet-density'),
  revenue: () => get<{ total_volume: string; transaction_count: number }>('/admin/revenue'),
}

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsApi = {
  list: () => get<NotificationOut[]>('/notifications'),
  markRead: (id: string) => post<void>(`/notifications/${id}/read`, {}),
}

// ─── Health ───────────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => get<HealthResponse>('/health', { public: true }),
}
