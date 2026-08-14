'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { VehicleType } from '@/lib/mock-data'

interface RideContextType {
  bookedVehicle: VehicleType | null
  setBookedVehicle: (v: VehicleType | null) => void
  rideSearched: boolean
  setRideSearched: (v: boolean) => void
}

const RideContext = createContext<RideContextType>({
  bookedVehicle: null,
  setBookedVehicle: () => {},
  rideSearched: false,
  setRideSearched: () => {},
})

export function RideProvider({ children }: { children: ReactNode }) {
  const [bookedVehicle, setBookedVehicle] = useState<VehicleType | null>(null)
  const [rideSearched, setRideSearched] = useState(false)

  return (
    <RideContext.Provider value={{ bookedVehicle, setBookedVehicle, rideSearched, setRideSearched }}>
      {children}
    </RideContext.Provider>
  )
}

export function useRide() {
  return useContext(RideContext)
}
