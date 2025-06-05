import React from 'react';
import { Shield, UserCheck, Globe, Zap, CheckCircle } from 'lucide-react';;
import { IDKitWidget } from '@worldcoin/idkit';;
import { useApp } from '../../hooks/useApp';;
import { Button } from '../common/Button';;
import { GradientSphereLogo } from '../common/GradientSphereLogo';;
import { DashboardScreen } from './Dashboard';;
import { C3_LIGHT_BG, C3_TEXT_PRIMARY_LIGHT, C3_TEXT_SECONDARY_LIGHT, C3_CARD_BG_LIGHT, C3_BORDER_LIGHT } from '../../constants/styles';; // Added C3_BORDER_LIGHT based on usage

// --- World Landing Screen ---
export const WorldLandingScreen = () => {
  const { handleWorldIdVerification, handleSimulatedVerification, worldIdVerified, setScreen } = useApp(); // Added setScreen based on usage

  if (worldIdVerified) {
    // return <DashboardScreen />; // This creates a circular dependency if DashboardScreen also imports WorldLandingScreen indirectly.
    // It's better to handle screen switching in AppContent.js
    // For now, let AppContent handle the redirect.
    // If direct navigation is needed, setScreen('Dashboard') could be used in a useEffect.
    return null; // Or a loading indicator
  }

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative' }}>
              <GradientSphereLogo size={80} />
              <div style={{
                position: 'absolute', top: '-8px', right: '-8px',
                backgroundColor: '#22c55e', borderRadius: '50%', padding: '4px'
              }}>
                <Shield size={20} color="white" />
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '16px', lineHeight: '1.2' }}>
            The First <span style={{ color: '#22c55e' }}>Scam-Proof</span><br />Creator Platform
          </h1>

          <p style={{ fontSize: '20px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '32px', lineHeight: '1.5' }}>
            Fund creators you can trust. Every user is verified as a real human through World ID.
          </p>

          {/* Value Props */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: '#f0fdf4', borderRadius: '50%', width: '60px', height: '60px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
              }}>
                <UserCheck size={28} color="#22c55e" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
                No Fake Supporters
              </h3>
              <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                Every backer verified as real human
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: '#eff6ff', borderRadius: '50%', width: '60px', height: '60px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
              }}>
                <Globe size={28} color="#3b82f6" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
                Global Trust
              </h3>
              <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                Built on World Network verification
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: '#fef7ff', borderRadius: '50%', width: '60px', height: '60px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
              }}>
                <Zap size={28} color="#8b5cf6" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
                AI-Powered
              </h3>
              <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                Smart tools to launch faster
              </p>
            </div>
          </div>
        </div>

        {/* World ID Verification */}
        <div style={{
          backgroundColor: C3_CARD_BG_LIGHT, padding: '32px', borderRadius: '20px',
          border: `2px solid #22c55e`, marginBottom: '24px',
          boxShadow: '0 10px 25px rgba(34, 197, 94, 0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '16px' }}>
            Join the Verified Creator Community
          </h2>
          <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '24px' }}>
            Verify you're human to start creating and supporting projects
          </p>

          <IDKitWidget
            app_id={process.env.REACT_APP_WORLD_APP_ID || "app_staging_2a0c1a10e8b8af51e9c8f2c8a5b4a3d2"}
            action="backed_verification"
            onSuccess={handleWorldIdVerification}
            handleVerify={(result) => Promise.resolve(result)} // handleVerify is deprecated, but keeping for now
            // verification_level={VerificationLevel.Orb} // More specific verification if needed
          >
            {({ open }) => (
              <Button
                onClick={open}
                size="lg"
                style={{
                  backgroundColor: '#22c55e', // Directly using color value
                  // borderColor: '#22c55e', // Not needed if background is same and no explicit border
                  fontSize: '18px', padding: '16px 32px', borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
                }}
              >
                <Shield size={20} /> Verify with World ID
              </Button>
            )}
          </IDKitWidget>

          {/* Simulated Verification for Testing */}
          <div style={{
            marginTop: '16px', padding: '16px', backgroundColor: '#fef3c7',
            borderRadius: '12px', border: '1px dashed #d97706'
          }}>
            <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '12px', textAlign: 'center' }}>
              🧪 For testing: World ID not available in your region?
            </p>
            <Button
              onClick={handleSimulatedVerification}
              variant="secondary"
              size="sm"
              style={{
                backgroundColor: '#fbbf24', // Directly using color value
                // borderColor: '#f59e0b', // Not needed if background is same and no explicit border
                color: 'white',
                fontSize: '14px', width: '100%'
              }}
            >
              <Shield size={16} /> Use Simulated Verification
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={16} color="#22c55e" />
            <span>Privacy-preserving</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={16} color="#22c55e" />
            <span>Decentralized</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={16} color="#22c55e" />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
