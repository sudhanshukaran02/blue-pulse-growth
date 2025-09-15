import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NGORegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const areasOfWork = ['Education', 'Health', 'Environment', 'Livelihood', 'Other'];

export function NGORegistrationDialog({ open, onOpenChange }: NGORegistrationDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [registrationDate, setRegistrationDate] = useState<Date>();
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  
  // File states
  const [certificate12A80G, setCertificate12A80G] = useState<File | null>(null);
  const [fcraCertificate, setFcraCertificate] = useState<File | null>(null);
  const [registrationCertificate, setRegistrationCertificate] = useState<File | null>(null);
  const [annualReport, setAnnualReport] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    ngoName: '',
    ngoType: '',
    registrationNumber: '',
    actOfRegistration: '',
    ngoPanNumber: '',
    has12A80GRegistration: false,
    hasFcraRegistration: false,
    registeredOfficeAddress: '',
    contactEmail: '',
    contactPhone: '',
    keyPersonName: '',
    keyPersonDesignation: '',
    keyPersonContact: '',
    websiteSocialLinks: '',
    geographicFocus: '',
    pastCurrentProjects: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAreaChange = (area: string, checked: boolean) => {
    if (checked) {
      setSelectedAreas(prev => [...prev, area]);
    } else {
      setSelectedAreas(prev => prev.filter(a => a !== area));
    }
  };

  const handleFileChange = (file: File | null, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, JPG, or PNG files only.",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
    }
    setter(file);
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('ngo-uploads')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    return data.path;
  };

  const validateForm = () => {
    const required = ['ngoName', 'ngoType', 'registrationNumber', 'contactEmail', 'keyPersonName'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Upload files
      const [cert12A80GUrl, fcraCertUrl, regCertUrl, annualReportUrl] = await Promise.all([
        certificate12A80G ? uploadFile(certificate12A80G, '12a-80g') : null,
        fcraCertificate ? uploadFile(fcraCertificate, 'fcra') : null,
        registrationCertificate ? uploadFile(registrationCertificate, 'registration') : null,
        annualReport ? uploadFile(annualReport, 'annual-reports') : null
      ]);

      // Insert NGO data
      const { error } = await supabase
        .from('ngos')
        .insert({
          field_worker_id: user.id,
          ngo_name: formData.ngoName,
          ngo_type: formData.ngoType,
          registration_number: formData.registrationNumber,
          date_of_registration: registrationDate?.toISOString().split('T')[0],
          act_of_registration: formData.actOfRegistration,
          ngo_pan_number: formData.ngoPanNumber,
          has_12a_80g_registration: formData.has12A80GRegistration,
          certificate_12a_80g_url: cert12A80GUrl,
          has_fcra_registration: formData.hasFcraRegistration,
          fcra_certificate_url: fcraCertUrl,
          registration_certificate_url: regCertUrl,
          registered_office_address: formData.registeredOfficeAddress,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          key_person_name: formData.keyPersonName,
          key_person_designation: formData.keyPersonDesignation,
          key_person_contact: formData.keyPersonContact,
          website_social_links: formData.websiteSocialLinks,
          areas_of_work: selectedAreas,
          geographic_focus: formData.geographicFocus,
          past_current_projects: formData.pastCurrentProjects,
          annual_report_url: annualReportUrl
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "NGO details saved successfully!",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving NGO details:', error);
      toast({
        title: "Error",
        description: "Failed to save NGO details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  const FileUpload = ({ 
    file, 
    onFileChange, 
    label 
  }: { 
    file: File | null; 
    onFileChange: (file: File | null) => void; 
    label: string;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          className="flex-1"
        />
        {file && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onFileChange(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {file && <p className="text-sm text-muted-foreground">{file.name}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>NGO Registration Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="ngoName">NGO Name *</Label>
              <Input
                id="ngoName"
                value={formData.ngoName}
                onChange={(e) => handleInputChange('ngoName', e.target.value)}
                placeholder="Enter NGO name"
              />
            </div>

            <div className="space-y-2">
              <Label>Type of NGO *</Label>
              <Select value={formData.ngoType} onValueChange={(value) => handleInputChange('ngoType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select NGO type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trust">Trust</SelectItem>
                  <SelectItem value="Society">Society</SelectItem>
                  <SelectItem value="Section 8 Company">Section 8 Company</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number *</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                placeholder="Enter registration number"
              />
            </div>

            <div className="space-y-2">
              <Label>Date of Registration</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !registrationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {registrationDate ? format(registrationDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={registrationDate}
                    onSelect={setRegistrationDate}
                    className="pointer-events-auto"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actOfRegistration">Act of Registration</Label>
              <Input
                id="actOfRegistration"
                value={formData.actOfRegistration}
                onChange={(e) => handleInputChange('actOfRegistration', e.target.value)}
                placeholder="Enter act of registration"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ngoPanNumber">NGO PAN Number</Label>
              <Input
                id="ngoPanNumber"
                value={formData.ngoPanNumber}
                onChange={(e) => handleInputChange('ngoPanNumber', e.target.value)}
                placeholder="Enter PAN number"
              />
            </div>
          </div>

          {/* Registration & Certificates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Registration & Certificates</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.has12A80GRegistration}
                onCheckedChange={(checked) => handleInputChange('has12A80GRegistration', checked)}
              />
              <Label>12A / 80G Registration</Label>
            </div>
            
            {formData.has12A80GRegistration && (
              <FileUpload
                file={certificate12A80G}
                onFileChange={(file) => handleFileChange(file, setCertificate12A80G)}
                label="Upload 12A/80G Certificate"
              />
            )}

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.hasFcraRegistration}
                onCheckedChange={(checked) => handleInputChange('hasFcraRegistration', checked)}
              />
              <Label>FCRA Registration</Label>
            </div>
            
            {formData.hasFcraRegistration && (
              <FileUpload
                file={fcraCertificate}
                onFileChange={(file) => handleFileChange(file, setFcraCertificate)}
                label="Upload FCRA Certificate"
              />
            )}

            <FileUpload
              file={registrationCertificate}
              onFileChange={(file) => handleFileChange(file, setRegistrationCertificate)}
              label="Upload Registration Certificate"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="registeredOfficeAddress">Registered Office Address</Label>
              <Textarea
                id="registeredOfficeAddress"
                value={formData.registeredOfficeAddress}
                onChange={(e) => handleInputChange('registeredOfficeAddress', e.target.value)}
                placeholder="Enter registered office address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="Enter contact email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone Number</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyPersonName">Key Person Name *</Label>
              <Input
                id="keyPersonName"
                value={formData.keyPersonName}
                onChange={(e) => handleInputChange('keyPersonName', e.target.value)}
                placeholder="Enter key person name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyPersonDesignation">Key Person Designation</Label>
              <Input
                id="keyPersonDesignation"
                value={formData.keyPersonDesignation}
                onChange={(e) => handleInputChange('keyPersonDesignation', e.target.value)}
                placeholder="Enter designation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyPersonContact">Key Person Contact</Label>
              <Input
                id="keyPersonContact"
                value={formData.keyPersonContact}
                onChange={(e) => handleInputChange('keyPersonContact', e.target.value)}
                placeholder="Enter email/phone"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="websiteSocialLinks">NGO Website / Social Media Links</Label>
              <Textarea
                id="websiteSocialLinks"
                value={formData.websiteSocialLinks}
                onChange={(e) => handleInputChange('websiteSocialLinks', e.target.value)}
                placeholder="Enter website and social media links"
              />
            </div>

            <div className="space-y-2">
              <Label>Areas of Work</Label>
              <div className="grid grid-cols-2 gap-2">
                {areasOfWork.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedAreas.includes(area)}
                      onCheckedChange={(checked) => handleAreaChange(area, checked as boolean)}
                    />
                    <Label className="text-sm">{area}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="geographicFocus">Geographic Focus</Label>
              <Input
                id="geographicFocus"
                value={formData.geographicFocus}
                onChange={(e) => handleInputChange('geographicFocus', e.target.value)}
                placeholder="Enter district/state"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pastCurrentProjects">Past or Current Projects</Label>
              <Textarea
                id="pastCurrentProjects"
                value={formData.pastCurrentProjects}
                onChange={(e) => handleInputChange('pastCurrentProjects', e.target.value)}
                placeholder="Describe past or current projects"
              />
            </div>

            <FileUpload
              file={annualReport}
              onFileChange={(file) => handleFileChange(file, setAnnualReport)}
              label="Upload Annual Report / Financial Statements (Optional)"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={handleSkip} disabled={loading}>
            Skip for Now
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}