import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { StyleCard } from "@/components/StyleCard";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-8 animate-fade-up">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          <div className="space-y-6">
            <StyleCard title="Notifications">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your outfits and recommendations
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Style Report</p>
                    <p className="text-sm text-muted-foreground">
                      Get a weekly summary of your style choices
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </StyleCard>

            <StyleCard title="Privacy">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Share Style Analytics</p>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage of your style data
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </StyleCard>

            <StyleCard title="Account">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Change Password
                  </label>
                  <Input type="password" placeholder="Current password" className="mb-2" />
                  <Input type="password" placeholder="New password" className="mb-2" />
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button className="w-full md:w-auto">Update Password</Button>
              </div>
            </StyleCard>

            <StyleCard title="Danger Zone">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-destructive mb-2">
                    Delete Account
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </StyleCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;