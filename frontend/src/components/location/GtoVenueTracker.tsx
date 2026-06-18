'use client'

import { useEffect, useMemo, useState } from 'react'

type Coordinates = {
  lat: number
  lng: number
}

const MOCK_GROUND: Coordinates = {
  lat: 18.5204,
  lng: 73.8567,
}

const EARTH_RADIUS_KM = 6371

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

function haversineDistanceKm(from: Coordinates, to: Coordinates) {
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)

  const lat1 = toRadians(from.lat)
  const lat2 = toRadians(to.lat)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function buildMapsUrl(from: Coordinates) {
  return `https://www.google.com/maps/dir/${from.lat},${from.lng}/${MOCK_GROUND.lat},${MOCK_GROUND.lng}/`
}

export default function GtoVenueTracker() {
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRouting, setIsRouting] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      position => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setAccuracy(position.coords.accuracy)
        setError(null)
      },
      err => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  const distanceToGround = useMemo(() => {
    if (!location) return null
    return haversineDistanceKm(location, MOCK_GROUND)
  }, [location])

  const handleRoute = () => {
    const origin = location ?? MOCK_GROUND
    setIsRouting(true)
    window.open(buildMapsUrl(origin), '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setIsRouting(false), 900)
  }

  return (
    <div className="w-full rounded-[28px] border border-white/10 bg-[#07111f] p-5 shadow-2xl md:p-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
            NavIC Protocol
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black tracking-[0.25em] text-emerald-300">
              L-BAND LOCK
            </span>
          </h3>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-400">
            Utilizing NavIC/IRNSS telemetry to detect your position and route you to the nearest verified mock GTO ground.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-200">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          {location ? 'Signal acquired' : 'Awaiting lock'}
        </div>
      </div>

      {error ? (
        <div className="max-w-xl rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
          {error}
        </div>
      ) : location ? (
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]" />
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
                Telemetry Feed
              </h4>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                  Latitude
                </p>
                <p className="mt-2 font-mono text-2xl font-black text-white">
                  {location.lat.toFixed(6)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                  Longitude
                </p>
                <p className="mt-2 font-mono text-2xl font-black text-white">
                  {location.lng.toFixed(6)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                  Accuracy
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {accuracy ? `${Math.round(accuracy)}m` : '—'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                  Ground Status
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  Live
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                Nearest GTO Ground
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Target vector calculated. Open turn-by-turn routing to the nearest mock ground.
              </p>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <div className="text-5xl font-black text-white">
                  {distanceToGround ? distanceToGround.toFixed(1) : '--'}
                  <span className="ml-2 text-lg font-black text-emerald-300">KM</span>
                </div>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                  From current position
                </p>
              </div>

              <button
                type="button"
                onClick={handleRoute}
                disabled={isRouting}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-400 px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-black transition-all active:scale-95 disabled:cursor-wait disabled:opacity-60"
              >
                {isRouting ? 'Routing…' : 'Route'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex max-w-xl items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="relative flex h-5 w-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-5 w-5 rounded-full bg-emerald-500" />
          </div>
          <p className="font-mono text-sm uppercase tracking-[0.25em] text-slate-300">
            Acquiring NavIC satellite lock…
          </p>
        </div>
      )}
    </div>
  )
}
