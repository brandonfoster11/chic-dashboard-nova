import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/services/user/user.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Download, Trash2, UserX, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const { user, logout } = useAuth();
  const userService = UserService.getInstance();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnonymizing, setIsAnonymizing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleExportData = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      const { data, error } = await userService.exportUserData();
      
      if (error) throw error;
      
      // Create a downloadable JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `styleai-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Data exported successfully',
        description: 'Your data has been downloaded as a JSON file.',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Error exporting data',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmation !== 'DELETE') return;
    
    setIsDeleting(true);
    try {
      const { success, error } = await userService.deleteUserAccount();
      
      if (error) throw error;
      
      if (success) {
        await logout();
        toast({
          title: 'Account deleted',
          description: 'Your account and all associated data have been permanently deleted.',
          duration: 5000,
        });
        navigate('/');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error deleting account',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDeleteConfirmation('');
    }
  };

  const handleAnonymizeData = async () => {
    if (!user) return;
    
    setIsAnonymizing(true);
    try {
      const { success, error } = await userService.anonymizeUserData();
      
      if (error) throw error;
      
      if (success) {
        toast({
          title: 'Data anonymized',
          description: 'Your personal information has been anonymized while preserving your wardrobe and outfit data.',
          duration: 5000,
        });
      } else {
        throw new Error('Failed to anonymize data');
      }
    } catch (error) {
      console.error('Error anonymizing data:', error);
      toast({
        title: 'Error anonymizing data',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsAnonymizing(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy & Data Settings</h1>
      
      <Tabs defaultValue="privacy" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="data">Your Data</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>Last updated: April 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Overview</h3>
              <p>
                StyleAI is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
              </p>
              
              <h3 className="text-xl font-semibold">Data We Collect</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Email, name, and authentication details</li>
                <li><strong>Profile Information:</strong> Style preferences, body measurements, and other style-related data</li>
                <li><strong>Wardrobe Items:</strong> Images and details of clothing items you upload</li>
                <li><strong>Outfits:</strong> Combinations of wardrobe items you create</li>
                <li><strong>Usage Data:</strong> How you interact with our service</li>
              </ul>
              
              <h3 className="text-xl font-semibold">How We Use Your Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and improve our service</li>
                <li>To generate personalized outfit recommendations</li>
                <li>To maintain your wardrobe inventory</li>
                <li>To communicate with you about our service</li>
              </ul>
              
              <h3 className="text-xl font-semibold">Your Rights (CCPA Compliance)</h3>
              <p>
                Under the California Consumer Privacy Act (CCPA), you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Delete your personal data</li>
                <li>Know what personal data is being collected</li>
                <li>Know if your personal data is being sold or disclosed</li>
                <li>Opt out of the sale of your personal data</li>
                <li>Non-discrimination for exercising your rights</li>
              </ul>
              <p>
                You can exercise these rights through the "Your Data" tab.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Your Data</CardTitle>
                <CardDescription>Download a copy of all your StyleAI data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This will export all your data including profile information, wardrobe items, outfits, and style preferences in JSON format.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleExportData} 
                  disabled={isExporting || !user}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  {isExporting ? 'Exporting...' : 'Export My Data'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Anonymize Your Data</CardTitle>
                <CardDescription>Remove personal identifiers while keeping your wardrobe and outfits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This will remove your personal information (name, email, etc.) while preserving your wardrobe items and outfits. Your account will remain active but anonymized.
                </p>
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    This action will anonymize your profile information. You'll still be able to log in and use StyleAI.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleAnonymizeData} 
                  disabled={isAnonymizing || !user}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <UserX size={16} />
                  {isAnonymizing ? 'Anonymizing...' : 'Anonymize My Data'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Delete Your Account</CardTitle>
                <CardDescription>Permanently delete your account and all associated data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This will permanently delete your account and all associated data including profile information, wardrobe items, outfits, and style preferences.
                </p>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    This action cannot be undone. All your data will be permanently deleted.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      disabled={!user}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete My Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and all associated data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="mb-4">To confirm, type "DELETE" in the field below:</p>
                      <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Type DELETE to confirm"
                      />
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Password</h3>
                <p className="mb-4">
                  Strong passwords help protect your account from unauthorized access.
                </p>
                <Button variant="outline">Change Password</Button>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Login History</h3>
                <p className="mb-4">
                  Review recent login activity for your account.
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  <Shield size={16} />
                  View Login History
                </Button>
              </div>
              
              {/* Future MFA implementation would go here */}
              <div className="opacity-50">
                <h3 className="text-xl font-semibold mb-2">Two-Factor Authentication</h3>
                <p className="mb-4">
                  Add an extra layer of security to your account (coming soon).
                </p>
                <Button variant="outline" disabled className="flex items-center gap-2">
                  <Shield size={16} />
                  Enable 2FA (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Privacy;
