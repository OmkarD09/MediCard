import { useParams } from "wouter";
import { useProfile } from "@/hooks/use-profiles";
import { ShieldPlus, PhoneCall, AlertTriangle, HeartPulse, Loader2, Info, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmergencyView() {
  const params = useParams();
  const id = params.id!;
  
  const { data: profile, isLoading, isError } = useProfile(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-destructive animate-spin mb-4" />
        <h2 className="text-xl font-bold">Loading Emergency Info...</h2>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground max-w-md">
          This emergency profile is invalid or has been removed. If this is an emergency, please call emergency services immediately.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Heavy Red Banner for Emergency Context */}
      <div className="bg-destructive text-destructive-foreground px-4 py-3 flex items-center justify-center gap-3 sticky top-0 z-50 shadow-md">
        <AlertTriangle className="w-6 h-6 animate-pulse" />
        <span className="font-black tracking-widest uppercase text-sm md:text-base">Emergency Medical Information</span>
        <AlertTriangle className="w-6 h-6 animate-pulse" />
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 pb-32">
        
        {/* Main Identity */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-6 md:p-10 mb-6 border border-border/50 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-400 to-primary" />
          
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartPulse className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-2 tracking-tight">
            {profile.fullName}
          </h1>
          <p className="text-slate-500 font-medium text-lg uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldPlus className="w-5 h-5" /> Verified Profile
          </p>
        </div>

        {/* Vital Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Blood Group - Highlighted Heavily */}
          <div className="bg-white rounded-3xl shadow-lg shadow-black/5 border-2 border-destructive p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:bg-destructive/5 transition-colors">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <HeartPulse className="w-32 h-32 text-destructive" />
            </div>
            <p className="text-destructive font-bold uppercase tracking-widest text-sm mb-2">Blood Group</p>
            <div className="text-6xl font-display font-black text-destructive leading-none">
              {profile.bloodGroup}
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-border/50 p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h2 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Allergies</h2>
            </div>
            {profile.allergies ? (
              <p className="text-xl font-bold text-slate-800 leading-tight">
                {profile.allergies}
              </p>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 italic bg-slate-50 p-3 rounded-xl">
                <Info className="w-4 h-4" /> No known allergies listed
              </div>
            )}
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-border/50 p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Medical Conditions</h2>
          </div>
          {profile.medicalConditions ? (
            <p className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
              {profile.medicalConditions}
            </p>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 italic bg-slate-50 p-4 rounded-xl">
              <Info className="w-5 h-5" /> No chronic conditions listed
            </div>
          )}
        </div>

      </div>

      {/* Fixed Emergency Contact Bar at Bottom */}
      {profile.emergencyContactPhone && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] p-4 md:p-6 z-40">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Emergency Contact</p>
              <p className="text-lg font-bold text-slate-900">{profile.emergencyContactName || "Primary Contact"}</p>
            </div>
            
            <a 
              href={`tel:${profile.emergencyContactPhone}`}
              className="w-full md:w-auto"
            >
              <Button size="lg" className="w-full md:w-auto h-16 px-8 rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20 text-xl font-bold group">
                <PhoneCall className="mr-3 w-6 h-6 group-hover:animate-bounce" />
                Call {profile.emergencyContactPhone}
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
