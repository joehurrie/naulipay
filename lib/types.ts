// ─── Auto-generated from NauliPay OpenAPI spec ───────────────────────────────
// Minor frontend-specific extensions at the bottom.

export type CreditHolderType = 'commuter' | 'owner'
export type CreditStatus = 'not_eligible' | 'eligible' | 'active' | 'suspended'
export type FlowPreference = 'direct_stk' | 'ussd_then_stk'
export type NotificationChannel = 'sms' | 'push' | 'email'
export type NotificationStatus = 'queued' | 'sent' | 'failed'
export type NotificationType =
  | 'trip_update'
  | 'payment_receipt'
  | 'payout_confirmation'
  | 'wallet_topup'
  | 'document_expiry'
  | 'credit_update'
  | 'otp'
export type PaymentProvider = 'ncba_loop' | 'other'
export type PayoutDestination = 'mpesa' | 'loop_till' | 'mpesa_till' | 'mpesa_paybill'
export type PayoutStatus = 'pending' | 'processing' | 'success' | 'failed' | 'unresolved'
export type QRSessionStatus =
  | 'scanned'
  | 'awaiting_ussd_input'
  | 'awaiting_stk_pin'
  | 'success'
  | 'failed'
  | 'expired'
export type Role = 'commuter' | 'owner' | 'driver' | 'admin'
export type STKStatus = 'initiated' | 'sent_to_device' | 'success' | 'failed' | 'cancelled' | 'timed_out'
export type TopUpStatus = 'pending' | 'success' | 'failed'
export type TransactionMethod = 'tap_card' | 'qr' | 'ussd' | 'whatsapp' | 'in_app'
export type TransactionStatus = 'pending' | 'success' | 'failed' | 'refunded'
export type TripStatus = 'searching' | 'booked' | 'in_progress' | 'completed' | 'cancelled'
export type VehicleCategory = 'matatu' | 'taxi' | 'boda'
export type VehicleStatus = 'active' | 'inactive' | 'suspended' | 'pending'
export type VehicleDocType = 'insurance' | 'inspection' | 'logbook' | 'psv_badge'
export type TapCardStatus = 'unassigned' | 'active' | 'suspended' | 'lost'

export interface ActivateRouteRequest {
  route_id: string
}

export interface CreditLineOut {
  id: string
  holder_type: CreditHolderType
  status: CreditStatus
  credit_limit: string
  outstanding_balance: string
  evaluated_at: string | null
}

export interface CreditRepaymentCreate {
  amount: number | string
  provider_reference?: string
}

export interface CreditRepaymentOut {
  id: string
  amount: string
  provider_reference: string
  paid_at: string
}

export interface DriverAssign {
  driver_id: string
}

export interface FareEstimateOut {
  base_charge: string
  dynamic_adjustment: string
  alternatives: Record<string, unknown>[]
  estimated_total: string
}

export interface HTTPValidationError {
  detail?: ValidationError[]
}

export interface LocationPingIn {
  latitude: number
  longitude: number
  heading?: number | null
  speed_kph?: number | null
}

export interface LoopMerchantAccountIn {
  consumer_key: string
  consumer_secret: string
  signing_secret: string
  loop_merchant_till: string
  callback_url?: string
}

export interface LoopMerchantAccountOut {
  id: string
  loop_merchant_till: string
  callback_url: string
  is_verified: boolean
  token_expires_at: string | null
}

export interface LoyaltyPointOut {
  points_balance: number
  completed_trip_count: number
  is_credit_eligible: boolean
}

export interface MerchantPaymentConfigOut {
  id: string
  owner_id: string
  flow_preference: FlowPreference
  provider: PaymentProvider
  till_or_paybill_number: string
  ussd_shortcode: string
  commission_rate: string
}

export interface MerchantPaymentConfigUpdate {
  flow_preference?: FlowPreference | null
  provider?: PaymentProvider | null
  till_or_paybill_number?: string | null
  ussd_shortcode?: string | null
  commission_rate?: number | string | null
}

export interface NotificationOut {
  id: string
  channel: NotificationChannel
  notification_type: NotificationType
  message: string
  status: NotificationStatus
  created_at: string
  sent_at: string | null
}

export interface OTPRequest {
  phone_number: string
  full_name?: string | null
  role?: Role
}

export interface OTPVerify {
  phone_number: string
  code: string
}

export interface PayoutOut {
  id: string
  owner_id: string
  vehicle_id: string | null
  period_start: string
  period_end: string
  gross_earnings: string
  commission_amount: string
  net_payout: string
  status: PayoutStatus
  destination_type: PayoutDestination | null
  destination: string
  failure_reason: string | null
  created_at: string
  paid_at: string | null
}

export interface PayoutSummary {
  gross: string | null
  net: string | null
  commission: string | null
}

export interface PayoutWithdrawRequest {
  destination_type: PayoutDestination
  destination: string
  amount?: number | string | null
}

export interface QRPaymentSessionOut {
  id: string
  commuter_id: string
  vehicle_id: string | null
  trip_id: string | null
  flow_used: FlowPreference
  tip_amount: string
  status: QRSessionStatus
  scanned_at: string
  expires_at: string
  resolved_at: string | null
}

export interface QRScanRequest {
  vehicle_id: string
  qr_payload: string
  trip_id?: string | null
  tip_amount?: number | string
}

export interface RegisterCardsRequest {
  card_uids: string[]
}

export interface RouteCreate {
  name: string
  start_point: string
  end_point: string
  base_fare: number | string
  stages?: Record<string, unknown>[]
}

export interface RouteOut {
  id: string
  owner_id: string
  name: string
  start_point: string
  end_point: string
  base_fare: string
  is_active: boolean
}

export interface RouteUpdate {
  name?: string | null
  base_fare?: number | string | null
  is_active?: boolean | null
}

export interface STKPushRequestOut {
  id: string
  qr_session_id: string
  provider: PaymentProvider
  phone_number: string
  amount: string
  checkout_request_id: string
  status: STKStatus
  result_code: string
  result_description: string
  initiated_at: string
  resolved_at: string | null
}

export interface SeatBookingOut {
  seat_number: number | null
  queued_at: string
}

export interface TapPaymentRequest {
  card_uid: string
  vehicle_id: string
  tip_amount?: number | string
}

export interface TokenResponse {
  access_token: string
  token_type?: string
  user: UserOut
}

export interface TopUpOut {
  id: string
  amount: string
  status: TopUpStatus
  checkout_request_id: string | null
  created_at: string
  resolved_at: string | null
}

export interface TopUpRequest {
  amount: number | string
}

export interface TransactionOut {
  id: string
  trip_id: string | null
  vehicle_id: string | null
  route_id: string | null
  payer_id: string
  owner_id: string | null
  method: TransactionMethod
  base_fare: string
  dynamic_charges: string
  tip_amount: string
  total_amount: string
  status: TransactionStatus
  failure_reason: string | null
  provider_reference: string
  created_at: string
  settled_at: string | null
}

export interface TripCreate {
  category: VehicleCategory
  pickup_lat: number
  pickup_lng: number
  dropoff_lat?: number | null
  dropoff_lng?: number | null
}

export interface TripOut {
  id: string
  commuter_id: string
  vehicle_id: string | null
  category: VehicleCategory
  status: TripStatus
  pickup_lat: number
  pickup_lng: number
  dropoff_lat: number | null
  dropoff_lng: number | null
  share_link_token: string
  fare_estimate?: FareEstimateOut | null
  seat_booking?: SeatBookingOut | null
  requested_at: string
}

export interface UserOut {
  id: string
  phone_number: string
  full_name: string | null
  role: Role
  is_active: boolean
}

export interface UserUpdate {
  full_name?: string | null
}

export interface ValidationError {
  loc: string | number[]
  msg: string
  type: string
}

export interface VehicleCreate {
  category: VehicleCategory
  plate_number: string
  ussd_code: string
  make?: string | null
  model?: string | null
  capacity?: number
}

export interface VehicleDocumentCreate {
  doc_type: VehicleDocType | string
  file_url: string
  issued_at?: string | null
  expires_at?: string | null
}

export interface VehicleDocumentOut {
  id: string
  vehicle_id: string
  doc_type: VehicleDocType | string
  file_url: string
  issued_at: string | null
  expires_at: string | null
  verified: boolean
}

export interface VehicleOut {
  id: string
  owner_id: string
  category: VehicleCategory
  plate_number: string
  ussd_code: string
  make: string | null
  model: string | null
  capacity: number
  status: VehicleStatus
  route_id: string | null
  created_at: string
}

export interface VehicleQROut {
  qr_payload: string
  expires_at: string
}

export interface VehicleUpdate {
  make?: string | null
  model?: string | null
  capacity?: number | null
  status?: VehicleStatus | null
}

export interface WalletOut {
  id: string
  balance: string
  currency: string
}

export interface WalletQRPayRequest {
  qr_payload: string
}

// ─── Frontend-specific extensions ─────────────────────────────────────────────

export interface TapCardOut {
  id: string
  card_uid: string
  status: TapCardStatus
  user_id?: string | null
  activated_at?: string | null
}

export interface CardMappingOut {
  id: string
  card_uid: string
  user_id: string | null
  status: TapCardStatus
  activated_at?: string | null
}

export interface CardNotLinkedOut {
  status: 'unassigned'
  card_uid: string
  detail: string
}

export interface AdminCardAssignOut {
  id: string
  card_uid: string
  user_id: string
  status: TapCardStatus
}

export interface NearbySearchResponse {
  vehicles: VehicleOut[]
  fare_comparison: Record<string, unknown>
}

export interface ShareLinkResponse {
  share_url: string
}

export interface HealthResponse {
  status: string
}

export interface OTPResponse {
  detail: string
  expires_in: number
}
