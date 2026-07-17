/**
 * @fileoverview Type definitions for the Real-Time Rider Tracking System.
 */

export interface Coordinate {
  lat: number;
  lng: number;
}

export type LatLngTuple = [number, number];

export interface RiderProfile {
  id: string;
  name: string;
  phone: string;
  vehicleType?: string;
  vehicleNumber?: string;
  rating?: string | number;
  deliveries?: string | number;
  completedOrders?: number;
  completionRate?: string;
  profileImage?: string;
  status?: string;
  currentSpeed?: number;
}

export interface TrackingSnapshot {
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  eta: number;
  distance: number;
  progress: number;
  status: string;
  orderStatus: string;
  riderName: string | null;
  riderPhone: string | null;
  riderId: string | null;
  traffic: number;
  updatedAt: string;
}

export interface TrackingContext {
  orderId: string;
  store: Coordinate;
  customer: Coordinate;
  route?: Array<Coordinate | LatLngTuple>;
  rider?: Partial<RiderProfile>;
  speed?: number;
  traffic?: number;
  durationMs?: number;
  tickMs?: number;
}

export interface LiveTrackingState {
  loading: boolean;
  error: string | null;
  customerLoc: LatLngTuple | null;
  storeLoc: LatLngTuple;
  route: LatLngTuple[];
  displayPosition: { lat: number; lng: number; heading: number };
  remainingRoute: LatLngTuple[];
  telemetry: TrackingSnapshot | null;
  targetProgress: number;
}
