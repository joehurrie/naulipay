// ─── Mock Data for Naulipass ──────────────────────────────────────────────────

export type VehicleType = 'matatu' | 'taxi' | 'boda'
export type TripStatus = 'completed' | 'active' | 'cancelled'
export type PaymentMethod = 'tap-to-pay' | 'wallet' | 'mpesa'

export interface Trip {
  id: string
  vehicleType: VehicleType
  route: string
  from: string
  to: string
  fare: number
  status: TripStatus
  date: string
  driver: string
  plate: string
  points: number
  paymentMethod: PaymentMethod
  duration: string
}

export interface Vehicle {
  id: string
  type: VehicleType
  plate: string
  driver: string
  status: 'active' | 'idle' | 'offline'
  currentRoute: string
  passengers: number
  capacity: number
  earnings: number
  lat: number
  lng: number
}

export interface User {
  id: string
  name: string
  phone: string
  email: string
  cardId: string
  walletBalance: number
  loyaltyPoints: number
  totalTrips: number
  creditEligible: boolean
  joinDate: string
  status: 'active' | 'suspended'
}

// ─── Commuter Data ─────────────────────────────────────────────────────────────

export const mockTrips: Trip[] = [
  { id: 'T001', vehicleType: 'matatu', route: '111', from: 'CBD', to: 'Westlands', fare: 70, status: 'completed', date: '2024-08-13', driver: 'James Omondi', plate: 'KBZ 234G', points: 14, paymentMethod: 'tap-to-pay', duration: '28 min' },
  { id: 'T002', vehicleType: 'boda', route: '-', from: 'Westlands', to: 'Parklands', fare: 120, status: 'completed', date: '2024-08-13', driver: 'Peter Waweru', plate: 'KCY 876M', points: 24, paymentMethod: 'wallet', duration: '12 min' },
  { id: 'T003', vehicleType: 'taxi', route: '-', from: 'JKIA', to: 'Kilimani', fare: 850, status: 'completed', date: '2024-08-12', driver: 'Grace Njeri', plate: 'KDD 512P', points: 170, paymentMethod: 'mpesa', duration: '45 min' },
  { id: 'T004', vehicleType: 'matatu', route: '105', from: 'Rongai', to: 'CBD', fare: 80, status: 'completed', date: '2024-08-12', driver: 'Samuel Kipchoge', plate: 'KBX 101F', points: 16, paymentMethod: 'tap-to-pay', duration: '55 min' },
  { id: 'T005', vehicleType: 'matatu', route: '46', from: 'CBD', to: 'Eastleigh', fare: 50, status: 'completed', date: '2024-08-11', driver: 'Ali Hassan', plate: 'KCM 320H', points: 10, paymentMethod: 'tap-to-pay', duration: '20 min' },
  { id: 'T006', vehicleType: 'boda', route: '-', from: 'Kasarani', to: 'Roysambu', fare: 100, status: 'cancelled', date: '2024-08-11', driver: 'Brian Mutua', plate: 'KCE 089J', points: 0, paymentMethod: 'wallet', duration: '-' },
  { id: 'T007', vehicleType: 'taxi', route: '-', from: 'Westlands', to: 'JKIA', fare: 900, status: 'completed', date: '2024-08-10', driver: 'Faith Achieng', plate: 'KDE 730Q', points: 180, paymentMethod: 'tap-to-pay', duration: '50 min' },
  { id: 'T008', vehicleType: 'matatu', route: '58', from: 'Karen', to: 'CBD', fare: 100, status: 'completed', date: '2024-08-10', driver: 'Moses Kamau', plate: 'KBR 445C', points: 20, paymentMethod: 'wallet', duration: '40 min' },
  { id: 'T009', vehicleType: 'matatu', route: '111', from: 'CBD', to: 'Westlands', fare: 70, status: 'active', date: '2024-08-14', driver: 'James Omondi', plate: 'KBZ 234G', points: 0, paymentMethod: 'tap-to-pay', duration: 'In progress' },
]

export const currentUser: User = {
  id: 'USR-8821',
  name: 'Amara Osei',
  phone: '+254 712 345 678',
  email: 'amara.osei@email.com',
  cardId: 'NP-CARD-00112',
  walletBalance: 2340,
  loyaltyPoints: 1847,
  totalTrips: 37,
  creditEligible: false,
  joinDate: '2024-01-15',
  status: 'active',
}

// ─── Fleet & Earnings Data ─────────────────────────────────────────────────────

export const mockVehicles: Vehicle[] = [
  { id: 'V001', type: 'matatu', plate: 'KBZ 234G', driver: 'James Omondi', status: 'active', currentRoute: '111 CBD–Westlands', passengers: 10, capacity: 14, earnings: 8450, lat: -1.2921, lng: 36.8219 },
  { id: 'V002', type: 'matatu', plate: 'KBX 101F', driver: 'Samuel Kipchoge', status: 'active', currentRoute: '105 Rongai–CBD', passengers: 14, capacity: 14, earnings: 12300, lat: -1.3192, lng: 36.7800 },
  { id: 'V003', type: 'taxi', plate: 'KDD 512P', driver: 'Grace Njeri', status: 'idle', currentRoute: 'Awaiting booking', passengers: 0, capacity: 4, earnings: 21750, lat: -1.2864, lng: 36.8172 },
  { id: 'V004', type: 'boda', plate: 'KCY 876M', driver: 'Peter Waweru', status: 'active', currentRoute: 'Westlands–Parklands', passengers: 1, capacity: 1, earnings: 4200, lat: -1.2672, lng: 36.8100 },
  { id: 'V005', type: 'matatu', plate: 'KCM 320H', driver: 'Ali Hassan', status: 'offline', currentRoute: 'Off duty', passengers: 0, capacity: 14, earnings: 6800, lat: -1.2742, lng: 36.8365 },
  { id: 'V006', type: 'boda', plate: 'KCE 089J', driver: 'Brian Mutua', status: 'active', currentRoute: 'Kasarani–Roysambu', passengers: 1, capacity: 1, earnings: 3100, lat: -1.2200, lng: 36.8900 },
]

export const earningsData = {
  daily: [
    { label: 'Mon', earnings: 3200, trips: 12 },
    { label: 'Tue', earnings: 4100, trips: 16 },
    { label: 'Wed', earnings: 3800, trips: 14 },
    { label: 'Thu', earnings: 5200, trips: 20 },
    { label: 'Fri', earnings: 6800, trips: 26 },
    { label: 'Sat', earnings: 7500, trips: 29 },
    { label: 'Sun', earnings: 4300, trips: 17 },
  ],
  weekly: [
    { label: 'Wk 28', earnings: 28000, trips: 108 },
    { label: 'Wk 29', earnings: 31500, trips: 122 },
    { label: 'Wk 30', earnings: 29800, trips: 115 },
    { label: 'Wk 31', earnings: 35100, trips: 134 },
    { label: 'Wk 32', earnings: 38400, trips: 148 },
  ],
  monthly: [
    { label: 'Mar', earnings: 112000, trips: 432 },
    { label: 'Apr', earnings: 128000, trips: 494 },
    { label: 'May', earnings: 119500, trips: 461 },
    { label: 'Jun', earnings: 141200, trips: 545 },
    { label: 'Jul', earnings: 155800, trips: 601 },
    { label: 'Aug', earnings: 98500, trips: 380 },
  ],
}

// ─── Map pins (Nairobi area) ───────────────────────────────────────────────────

export const mapVehiclePins = [
  { id: 'p1',  type: 'matatu' as VehicleType, lat: 52, lng: 44, label: 'Route 111' },
  { id: 'p2',  type: 'matatu' as VehicleType, lat: 35, lng: 30, label: 'Route 105' },
  { id: 'p5',  type: 'matatu' as VehicleType, lat: 70, lng: 38, label: 'Route 46' },
  { id: 'p8',  type: 'matatu' as VehicleType, lat: 22, lng: 50, label: 'Route 58' },
  { id: 'p9',  type: 'matatu' as VehicleType, lat: 62, lng: 78, label: 'Route 33' },
  { id: 'p10', type: 'matatu' as VehicleType, lat: 44, lng: 18, label: 'Route 19' },
  { id: 'p11', type: 'matatu' as VehicleType, lat: 82, lng: 60, label: 'Route 42' },
  { id: 'p12', type: 'matatu' as VehicleType, lat: 30, lng: 85, label: 'Route 67' },
]

export const vehicleLabels: Record<VehicleType, string> = {
  matatu: 'Matatu',
  taxi: 'Taxi',
  boda: 'Boda',
}

export const vehicleEmojis: Record<VehicleType, string> = {
  matatu: '🚌',
  taxi: '🚕',
  boda: '🏍️',
}
