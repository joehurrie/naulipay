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

export interface Transaction {
  id: string
  userId: string
  userName: string
  vehicleId: string
  amount: number
  type: 'fare' | 'commission' | 'credit' | 'payout'
  status: 'completed' | 'pending' | 'failed'
  timestamp: string
  paymentMethod: PaymentMethod
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

// ─── Admin Data ────────────────────────────────────────────────────────────────

export const allUsers: User[] = [
  { id: 'USR-8821', name: 'Amara Osei', phone: '+254 712 345 678', email: 'amara.osei@email.com', cardId: 'NP-CARD-00112', walletBalance: 2340, loyaltyPoints: 1847, totalTrips: 37, creditEligible: false, joinDate: '2024-01-15', status: 'active' },
  { id: 'USR-4456', name: 'Fatima Al-Rashid', phone: '+254 721 987 654', email: 'fatima.r@email.com', cardId: 'NP-CARD-00089', walletBalance: 5820, loyaltyPoints: 6230, totalTrips: 72, creditEligible: true, joinDate: '2023-09-03', status: 'active' },
  { id: 'USR-3317', name: 'David Mwangi', phone: '+254 733 112 233', email: 'david.mwangi@email.com', cardId: 'NP-CARD-00201', walletBalance: 340, loyaltyPoints: 920, totalTrips: 18, creditEligible: false, joinDate: '2024-05-22', status: 'active' },
  { id: 'USR-7703', name: 'Sarah Otieno', phone: '+254 700 445 566', email: 'sarah.o@email.com', cardId: 'NP-CARD-00156', walletBalance: 12400, loyaltyPoints: 8900, totalTrips: 94, creditEligible: true, joinDate: '2023-06-11', status: 'active' },
  { id: 'USR-2241', name: 'Kevin Njoroge', phone: '+254 745 778 899', email: 'kevin.n@email.com', cardId: 'NP-CARD-00344', walletBalance: 1450, loyaltyPoints: 200, totalTrips: 6, creditEligible: false, joinDate: '2024-07-30', status: 'suspended' },
  { id: 'USR-9912', name: 'Lucia Wambua', phone: '+254 710 234 567', email: 'lucia.w@email.com', cardId: 'NP-CARD-00078', walletBalance: 7800, loyaltyPoints: 11250, totalTrips: 128, creditEligible: true, joinDate: '2023-02-19', status: 'active' },
  { id: 'USR-5581', name: 'Omar Farah', phone: '+254 728 345 678', email: 'omar.f@email.com', cardId: 'NP-CARD-00290', walletBalance: 1200, loyaltyPoints: 3400, totalTrips: 43, creditEligible: false, joinDate: '2024-03-08', status: 'active' },
]

export const allTransactions: Transaction[] = [
  { id: 'TXN-001234', userId: 'USR-8821', userName: 'Amara Osei', vehicleId: 'V001', amount: 70, type: 'fare', status: 'completed', timestamp: '2024-08-14T08:23:11', paymentMethod: 'tap-to-pay' },
  { id: 'TXN-001235', userId: 'USR-4456', userName: 'Fatima Al-Rashid', vehicleId: 'V003', amount: 850, type: 'fare', status: 'completed', timestamp: '2024-08-14T08:15:44', paymentMethod: 'mpesa' },
  { id: 'TXN-001236', userId: 'USR-9912', userName: 'Lucia Wambua', vehicleId: 'V002', amount: 80, type: 'fare', status: 'completed', timestamp: '2024-08-14T07:58:22', paymentMethod: 'tap-to-pay' },
  { id: 'TXN-001237', userId: 'USR-7703', userName: 'Sarah Otieno', vehicleId: 'V004', amount: 120, type: 'fare', status: 'completed', timestamp: '2024-08-14T07:44:09', paymentMethod: 'wallet' },
  { id: 'TXN-001238', userId: 'USR-5581', userName: 'Omar Farah', vehicleId: 'V001', amount: 70, type: 'fare', status: 'pending', timestamp: '2024-08-14T07:30:55', paymentMethod: 'tap-to-pay' },
  { id: 'TXN-001239', userId: 'USR-4456', userName: 'Fatima Al-Rashid', vehicleId: '-', amount: 5000, type: 'credit', status: 'completed', timestamp: '2024-08-13T18:00:00', paymentMethod: 'wallet' },
  { id: 'TXN-001240', userId: 'USR-3317', userName: 'David Mwangi', vehicleId: 'V006', amount: 100, type: 'fare', status: 'failed', timestamp: '2024-08-13T17:45:30', paymentMethod: 'tap-to-pay' },
  { id: 'TXN-001241', userId: 'USR-9912', userName: 'Lucia Wambua', vehicleId: '-', amount: 12000, type: 'payout', status: 'completed', timestamp: '2024-08-13T16:00:00', paymentMethod: 'mpesa' },
]

export const pendingVehicles = [
  { id: 'REG-0051', plate: 'KDF 231R', type: 'matatu' as VehicleType, owner: 'James Kariuki', submitted: '2024-08-13', docs: 'complete' },
  { id: 'REG-0052', plate: 'KCG 884S', type: 'taxi' as VehicleType, owner: 'Mary Ndungu', submitted: '2024-08-12', docs: 'pending' },
  { id: 'REG-0053', plate: 'KBQ 112T', type: 'boda' as VehicleType, owner: 'John Gitau', submitted: '2024-08-12', docs: 'complete' },
]

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
