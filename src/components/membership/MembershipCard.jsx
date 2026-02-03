import React, { useState } from 'react';
import { motion } from 'framer-motion';
import QRModal from './QRModal';

const MembershipCard = ({ cardData }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  
  const {
    card_number,
    user_name,
    profile_photo,
    qr_code,
    expiry_date,
    is_active
  } = cardData;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative w-[400px] h-[250px] bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-xl overflow-hidden"
    >
      {/* SAE Logo */}
      <div className="absolute top-4 left-4">
        <img 
          src="/sae-logo-white.png" 
          alt="SAE Logo" 
          className="w-16 h-16 object-contain"
        />
      </div>

      {/* Member Photo */}
      <div className="absolute top-4 right-4 w-24 h-24 rounded-lg overflow-hidden border-2 border-white/50">
        {profile_photo ? (
          <img
            src={profile_photo}
            alt={user_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-xl">Photo</span>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="absolute bottom-20 left-4 text-white">
        <h3 className="text-xl font-bold">{user_name}</h3>
        <p className="text-sm opacity-80">Member ID: {card_number}</p>
        <p className="text-sm opacity-80">
          Valid until: {new Date(expiry_date).toLocaleDateString()}
        </p>
      </div>

      {/* QR Code */}
      <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-lg p-1 cursor-pointer hover:ring-2 hover:ring-white/50 transition-all duration-200" onClick={() => setShowQRModal(true)}>
        {qr_code && (
          <img
            src={qr_code}
            alt="Verification QR"
            className="w-full h-full"
          />
        )}
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        qrCode={qr_code}
        title="Membership Card QR Code"
      />

      {/* Validity Status */}
      {!is_active && (
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
          <span className="text-white text-xl font-bold">EXPIRED</span>
        </div>
      )}

      {/* Watermark */}
      <div className="absolute bottom-4 left-4 text-white/30 text-sm">
        SAE TKMCE Student Chapter
      </div>
    </motion.div>
  );
};

export default MembershipCard;