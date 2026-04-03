import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/contexts/AppContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useGetUserProfile, useSaveUserProfile } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Eye,
  LogOut,
  Moon,
  RefreshCw,
  Shield,
  Sun,
  User,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function SettingsPage() {
  const { demoMode, toggleDemoMode, theme, setTheme } = useAppContext();
  const { identity, clear } = useInternetIdentity();
  const { data: profile } = useGetUserProfile();
  const saveProfile = useSaveUserProfile();

  const [name, setName] = useState(profile?.name ?? "Sarah Jenkins");
  const [savedName, setSavedName] = useState(false);

  const handleSaveName = async () => {
    await saveProfile.mutateAsync({ name });
    setSavedName(true);
    toast.success("Profile updated");
    setTimeout(() => setSavedName(false), 2000);
  };

  const principal = identity?.getPrincipal().toString();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
          Preferences
        </p>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Settings
        </h1>
      </motion.div>

      {/* Profile */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card-elevated p-5 space-y-4"
      >
        <div className="flex items-center gap-2">
          <User size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        </div>
        <Separator className="bg-border" />
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">
              Display Name
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary border-border flex-1"
                data-ocid="settings.name.input"
              />
              <Button
                onClick={handleSaveName}
                disabled={saveProfile.isPending}
                className="bg-primary text-primary-foreground shrink-0"
                data-ocid="settings.name.save_button"
              >
                {saveProfile.isPending ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : savedName ? (
                  <CheckCircle2 size={14} />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
          {principal && (
            <div>
              <Label className="text-xs text-muted-foreground">
                Principal ID
              </Label>
              <p className="text-xs font-mono text-muted-foreground mt-1 break-all bg-secondary/50 p-2 rounded-lg">
                {principal}
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Privacy */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="card-elevated p-5 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Privacy</h2>
        </div>
        <Separator className="bg-border" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Demo Mode</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Masks all monetary values for screen sharing or demos
            </p>
          </div>
          <Switch
            checked={demoMode}
            onCheckedChange={toggleDemoMode}
            data-ocid="settings.demo_mode.switch"
          />
        </div>
        {demoMode && (
          <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg border border-warning/20">
            <Eye size={14} className="text-warning shrink-0" />
            <p className="text-xs text-warning">
              Demo Mode is currently active. All monetary values are hidden.
            </p>
          </div>
        )}
      </motion.section>

      {/* Appearance */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated p-5 space-y-4"
      >
        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <Moon size={16} className="text-primary" />
          ) : (
            <Sun size={16} className="text-primary" />
          )}
          <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
        </div>
        <Separator className="bg-border" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Switch between dark and light interface
            </p>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            data-ocid="settings.dark_mode.switch"
          />
        </div>
      </motion.section>

      {/* Household */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="card-elevated p-5 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Users size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Household</h2>
        </div>
        <Separator className="bg-border" />
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                SJ
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Sarah Jenkins
                </p>
                <p className="text-xs text-muted-foreground">
                  Primary account holder
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-xs border-primary/30 text-primary"
            >
              Admin
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                MJ
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Mark Jenkins
                </p>
                <p className="text-xs text-muted-foreground">
                  Shared household member
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Member
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-dashed border-border text-muted-foreground"
            data-ocid="settings.invite.button"
          >
            + Invite Household Member
          </Button>
        </div>
      </motion.section>

      {/* Subscription */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="card-elevated p-5 space-y-4"
      >
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Subscription
          </h2>
        </div>
        <Separator className="bg-border" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                Command Center Pro
              </p>
              <Badge className="bg-primary/20 text-primary border-none text-xs">
                Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              $12.99/month • Renews May 1, 2026
            </p>
            <ul className="mt-2 space-y-1">
              {[
                "Unlimited accounts",
                "AI categorization",
                "Household sharing",
                "Ad-free, no data selling",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle2 size={11} className="text-success shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <Shield size={24} className="text-primary shrink-0" />
        </div>
        <div className="flex items-center gap-2 p-3 bg-secondary/40 rounded-lg">
          <Shield size={12} className="text-primary shrink-0" />
          <p className="text-xs text-muted-foreground">
            SOC2 compliant • AES-256 encrypted • Read-only bank access • Zero
            data selling
          </p>
        </div>
      </motion.section>

      {/* Sign out */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
      >
        <Button
          variant="outline"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={clear}
          data-ocid="settings.logout.button"
        >
          <LogOut size={14} className="mr-2" />
          Sign Out
        </Button>
      </motion.section>
    </div>
  );
}
