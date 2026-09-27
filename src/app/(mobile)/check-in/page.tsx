"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { t } from "@/lib/i18n";
import {
  checkGeofence,
  DEFAULT_PONDOK_LAT,
  DEFAULT_PONDOK_LNG,
  DEFAULT_GEOFENCE_RADIUS,
} from "@/lib/geofence";
import { MapPin, ShieldCheck, MapPinOff, LocateOff, ArrowRight, Sun, ScanFace, ScanLine, Minus, Camera, CheckCircle2, RotateCcw, Check } from "lucide-react";

type CheckInStep = "location" | "photo" | "review" | "success";

export default function CheckInPage() {
  const router = useRouter();
  const [step, setStep] = useState<CheckInStep>("location");
  const [locationStatus, setLocationStatus] = useState<
    "loading" | "inside" | "outside" | "denied"
  >("loading");
  const [distance, setDistance] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Step 1: Location Check
  const checkLocation = useCallback(() => {
    setLocationStatus("loading");
    setErrorMsg("");

    if (!navigator.geolocation) {
      setLocationStatus("denied");
      setErrorMsg("Browser tidak mendukung geolokasi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setAccuracy(Math.round(accuracy));

        const result = checkGeofence(
          latitude,
          longitude,
          DEFAULT_PONDOK_LAT,
          DEFAULT_PONDOK_LNG,
          DEFAULT_GEOFENCE_RADIUS,
          accuracy
        );

        setDistance(result.distance);

        // DEV BYPASS: Force true for testing as requested by user
        if (true || result.withinRadius) {
          setLocationStatus("inside");
        } else {
          setLocationStatus("outside");
          setErrorMsg(
            `${t("geofenceBlocked")} (Jarak: ${result.distance}m, radius: ${DEFAULT_GEOFENCE_RADIUS}m)`
          );
        }
      },
      (error) => {
        setLocationStatus("denied");
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg(t("permissionDenied"));
        } else {
          setErrorMsg("Gagal mendapatkan lokasi. Coba lagi.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (step === "location") {
      checkLocation();
    }
  }, [step, checkLocation]);

  // Step 2: Camera
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setErrorMsg("Tidak dapat mengakses kamera. Pastikan izin kamera diaktifkan.");
    }
  }, []);

  useEffect(() => {
    if (step === "photo") {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [step, startCamera, stream]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setPhotoData(dataUrl);
      setStep("review");
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  };

  const submitAttendance = async () => {
    // In production, this would call an API to save the attendance record
    setStep("success");
  };

  const getStepNumber = () => {
    switch (step) {
      case "location":
        return 1;
      case "photo":
        return 2;
      case "review":
        return 3;
      case "success":
        return 3;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <AppHeader
        title={step === "success" ? t("success") : `${t("checkInNow")}`}
        showBack={step !== "success"}
        onBack={() => {
          if (step === "photo") {
            setStep("location");
            setPhotoData(null);
          } else if (step === "review") {
            setStep("photo");
          } else {
            router.back();
          }
        }}
      />

      <main className="flex flex-col relative w-full px-6 pt-24 pb-6">
        {/* Step Progress */}
        {step !== "success" && (
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                {t("step")} {getStepNumber()} {t("of")} 3
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                {step === "location" && t("locationCheck")}
                {step === "photo" && t("photoVerification")}
                {step === "review" && t("photoReview")}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                style={{ width: `${(getStepNumber() / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 text-sm p-4 rounded-2xl mb-4 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Step 1: Location Check */}
        {step === "location" && (
          <div className="flex flex-col gap-6" data-aos="fade-up">
            {/* Map Preview */}
            <div className="relative w-full h-[320px] rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 pointer-events-none"></div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient cx="50%" cy="50%" id="geofenceGlow" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25"></stop>
                    <stop offset="85%" stopColor="#10b981" stopOpacity="0.1"></stop>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.3"></stop>
                  </radialGradient>
                </defs>
                <circle cx="50%" cy="50%" fill="url(#geofenceGlow)" r="100" stroke="#10b981" strokeDasharray="6,4" strokeWidth="2"></circle>
              </svg>
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 pointer-events-none border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Geofence Kampus: R-100m</span>
              </div>
              {/* User Pin */}
              <div className="absolute z-10 transition-all duration-700 ease-out flex items-center justify-center" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-ping pointer-events-none"></div>
                <div className="absolute w-12 h-12 rounded-full bg-emerald-500/30 pointer-events-none"></div>
                <div className={`relative w-10 h-10 rounded-full text-white shadow-lg flex items-center justify-center transition-colors duration-300 ${locationStatus === "inside" ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"}`}>
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              {/* GPS Banner */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold">
                    {accuracy ? `${t("gpsAccuracy")}: ±${accuracy}m` : "Mencari GPS..."}
                  </span>
                </div>
                <button
                  aria-label="Refresh GPS"
                  className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors active:scale-95"
                  onClick={checkLocation}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Status Card */}
            <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              {locationStatus === "loading" && (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
                  <span className="ml-3 text-sm font-medium text-slate-500 dark:text-slate-400">Mencari lokasi...</span>
                </div>
              )}
              {locationStatus === "inside" && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-800">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900 dark:text-white">{t("withinArea")}</span>
                      <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">{t("verified")}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Anda berada di dalam radius presensi <strong className="text-slate-700 dark:text-slate-300 font-bold">(Masjid Jami&apos; & Gedung Asrama Putra)</strong>.
                    </p>
                    {distance !== null && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">Jarak dari titik nol: {distance}m</p>
                    )}
                  </div>
                </div>
              )}
              {locationStatus === "outside" && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 shadow-sm ring-1 ring-red-200 dark:ring-red-800">
                    <MapPinOff className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-bold text-slate-900 dark:text-white">{t("outsideArea")}</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {t("geofenceBlocked")}
                    </p>
                    {distance !== null && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-bold mt-2">Jarak: {distance}m (radius: {DEFAULT_GEOFENCE_RADIUS}m)</p>
                    )}
                  </div>
                </div>
              )}
              {locationStatus === "denied" && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 shadow-sm ring-1 ring-red-200 dark:ring-red-800">
                    <LocateOff className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-bold text-slate-900 dark:text-white">Izin Lokasi Diperlukan</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {t("permissionDenied")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {locationStatus === "inside" && (
              <button
                className="flex items-center justify-center w-full h-[56px] px-6 bg-emerald-600 text-white text-base font-bold rounded-2xl shadow-lg shadow-emerald-600/30 dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-emerald-700 active:scale-[0.98] transition-all group"
                onClick={() => setStep("photo")}
              >
                <span>Lanjut ke Foto Selfie</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        )}

        {/* Step 2: Photo */}
        {step === "photo" && (
          <div className="flex flex-col gap-6" data-aos="zoom-in">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900 flex flex-col items-center justify-between min-h-[500px] aspect-[3/4] border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>
              
              <div className="relative z-10 w-full pt-6 px-6 flex flex-col items-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white shadow-lg border border-white/20 dark:border-slate-800">
                  <Sun className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-bold truncate">Pastikan wajah terlihat jelas & cukup cahaya</span>
                </div>
              </div>
              
              <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full px-8">
                <div className="relative w-56 h-72 rounded-[50%] border-2 border-dashed border-white/90 flex flex-col items-center justify-between py-8 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                  <div className="w-full flex items-center justify-between px-8 pt-6 opacity-80 text-white">
                    <div className="flex flex-col items-center">
                      <ScanFace className="w-5 h-5" />
                      <span className="w-6 h-[2px] bg-white rounded-full mt-2"></span>
                    </div>
                    <div className="flex flex-col items-center">
                      <ScanFace className="w-5 h-5" />
                      <span className="w-6 h-[2px] bg-white rounded-full mt-2"></span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center pb-2 opacity-80 text-white">
                    <Minus className="w-5 h-5" />
                    <span className="text-[10px] tracking-widest uppercase font-bold mt-1">Dagu</span>
                  </div>
                  
                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl"></div>
                </div>
              </div>
              
              <div className="relative z-10 w-full pb-8 pt-4 px-8 flex items-center justify-center">
                <button
                  aria-label="Ambil Foto"
                  className="w-20 h-20 rounded-full p-[4px] bg-white/20 backdrop-blur-sm shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-90 select-none"
                  onClick={takePhoto}
                  type="button"
                >
                  <span className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center ring-2 ring-emerald-500/20">
                      <Camera className="w-8 h-8" />
                    </span>
                  </span>
                </button>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Step 3: Review */}
        {step === "review" && photoData && (
          <div className="flex flex-col gap-6" data-aos="fade-in">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
              <img src={photoData} alt="Foto kehadiran" className="w-full h-auto object-cover" />
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Ringkasan Presensi</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Waktu</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Lokasi</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Masjid Jami&apos;</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Jarak</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{distance}m</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="flex-1 flex items-center justify-center h-14 px-6 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 text-sm font-bold rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 active:scale-[0.98] transition-all"
                onClick={() => {
                  setPhotoData(null);
                  setStep("photo");
                }}
              >
                {t("retakePhoto")}
              </button>
              <button
                className="flex-1 flex items-center justify-center h-14 px-6 bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-[0.98] transition-all"
                onClick={submitAttendance}
              >
                {t("submitAttendance")}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center gap-6 py-10" data-aos="zoom-in">
            <div className="w-28 h-28 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shadow-lg ring-4 ring-emerald-50 dark:ring-slate-900 relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
              <Check className="w-14 h-14 text-emerald-600 dark:text-emerald-400 relative z-10" strokeWidth={3} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t("success")}</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">{t("attendanceRecorded")}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 w-full mt-2">
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Waktu</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Hadir Tepat Waktu</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Lokasi</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate ml-4">Masjid Jami&apos;</span>
                </div>
              </div>
            </div>
            <button
              className="flex items-center justify-center w-full h-14 mt-4 px-6 bg-emerald-600 text-white text-base font-bold rounded-2xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-[0.98] transition-all"
              onClick={() => router.push("/home")}
            >
              {t("done")}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
