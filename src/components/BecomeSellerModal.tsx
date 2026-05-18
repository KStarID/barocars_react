import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck } from 'lucide-react';

interface BecomeSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BecomeSellerModal({ isOpen, onClose }: BecomeSellerModalProps) {
  const [agreed, setAgreed] = useState(false);
  const { becomeSeller } = useAuth();

  const handleApprove = () => {
    becomeSeller();
    onClose();
  };

  const handleReject = () => {
    setAgreed(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleReject()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <DialogTitle className="text-center text-2xl">Become a Seller</DialogTitle>
          <DialogDescription className="text-center text-gray-500 mt-2">
            Read our terms and conditions before you start selling vehicles on Barocars.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-48 overflow-y-auto text-sm text-gray-600 mb-6 space-y-3">
            <p className="font-semibold text-gray-900">1. Seller Responsibility</p>
            <p>Seller is fully responsible for the accuracy of the specifications, price, and car photos uploaded. It is strictly forbidden to upload fake photos or fictitious cars.</p>
            
            <p className="font-semibold text-gray-900 mt-4">2. Price Transparency</p>
            <p>The price must be honest and not hidden. The admin has the right to freeze the seller's account if it is proven that they are cheating on price.</p>

            <p className="font-semibold text-gray-900 mt-4">3. Communication Ethics</p>
            <p>Seller is obliged to use polite language when contacted by potential buyers.</p>

            <p className="font-semibold text-gray-900 mt-4">4. Privacy Policy</p>
            <p>The car data you enter will be published publicly. We are not responsible for the misuse of data by third parties.</p>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="terms-seller" 
              checked={agreed} 
              onCheckedChange={(checked) => setAgreed(checked as boolean)} 
              className="mt-1"
            />
            <label
              htmlFor="terms-seller"
              className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 cursor-pointer"
            >
              I have read, understood, and agree to the Terms and Conditions of becoming a Seller at Barocars.
            </label>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleReject} className="w-full sm:w-auto">
            Reject
          </Button>
          <Button 
            onClick={handleApprove} 
            disabled={!agreed}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
          >
            Approve & Become a Seller
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
