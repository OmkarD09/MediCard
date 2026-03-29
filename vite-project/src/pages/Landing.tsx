import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Shield, Activity, Clock, ArrowRight, QrCode } from "lucide-react";
import { motion } from "framer-motion";

export function Landing() {
  return (
    <Layout>
      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive font-semibold text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
              </span>
              Be Prepared for Emergencies
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1] mb-6">
              Your Medical ID <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">At A Glance.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Store your critical medical information and generate a unique QR code. 
              In an emergency, first responders can scan it to access your life-saving details instantly.
              <strong> Scan. Save. Survive.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
              <Link href="/profile/new">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 group">
                  Create Free Profile
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary transition-all" onClick={() => {
                alert("In a real environment, this would open a QR scanner or camera view.");
              }}>
                <QrCode className="mr-2 w-5 h-5" />
                Scan a Code
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>Takes 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Secure & Private</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-lg mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3 scale-105 -z-10 blur-xl"></div>
            <div className="bg-white p-2 rounded-3xl shadow-2xl shadow-black/5 border border-border/50 relative overflow-hidden">
              <img 
                src={`${import.meta.env.BASE_URL}images/hero-medical.png`} 
                alt="Medical ID Concept" 
                className="w-full h-auto rounded-2xl object-cover aspect-[4/3]"
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Critical Info</div>
                  <div className="text-xs text-muted-foreground">Always Accessible</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}
