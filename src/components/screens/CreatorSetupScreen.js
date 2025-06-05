import React, { useState } from 'react';
import { Rocket, User, Wand2, Sparkles } from 'lucide-react';;
import { useApp } from '../../hooks/useApp';;
import { Button } from '../common/Button';;
import { Input } from '../common/Input';;
import { TextArea } from '../common/TextArea';;
import { GradientSphereLogo } from '../common/GradientSphereLogo';;
import { C3_LIGHT_BG, C3_TEXT_PRIMARY_LIGHT, C3_TEXT_SECONDARY_LIGHT, C3_BORDER_LIGHT, C3_ERROR_RED } from '../../constants/styles';;

// --- Creator Setup Screen ---
export const CreatorSetupScreen = () => {
  const { setIsCreatorVerified, setScreen, showToast, generateAvatar } = useApp();
  const [step, setStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    name: '', bio: '', twitter: '', website: '', avatar: ''
  });
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const handleInputChange = (field, value) => {
    setVerificationData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateAvatar = async () => {
    if (!verificationData.name.trim()) {
      showToast('Please enter your name first', 'error');
      return;
    }

    setIsGeneratingAvatar(true);
    const avatarUrl = await generateAvatar(verificationData.name);
    setIsGeneratingAvatar(false);

    if (avatarUrl) {
      setVerificationData(prev => ({ ...prev, avatar: avatarUrl }));
    }
  };

  const handleSubmit = () => {
    if (!verificationData.name.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    setIsCreatorVerified(true); // This state should ideally be managed in AppContext and persisted
    setScreen('Dashboard');
    showToast('Creator profile set up successfully!', 'success');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <GradientSphereLogo size={64} />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '12px' }}>
              Welcome to Backed
            </h1>
            <p style={{ fontSize: '18px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              The platform where creators get the support they need to bring their projects to life.
            </p>
            <Button onClick={() => setStep(2)} size="lg">
              Get Started <Rocket size={20} />
            </Button>
          </div>
        );

      case 2:
        return (
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '24px', textAlign: 'center' }}>
              Set Up Your Creator Profile
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Creator Name"
                value={verificationData.name}
                onChange={(value) => handleInputChange('name', value)}
                placeholder="Enter your name or brand"
                required
              />

              {/* AI Avatar Section */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Profile Avatar
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    backgroundColor: C3_BORDER_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {verificationData.avatar ? (
                      <img src={verificationData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={32} color={C3_TEXT_SECONDARY_LIGHT} />
                    )}
                  </div>
                  <Button
                    onClick={handleGenerateAvatar}
                    disabled={isGeneratingAvatar || !verificationData.name.trim()}
                    variant="outline"
                    style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
                  >
                    {isGeneratingAvatar ? <Sparkles size={16} /> : <Wand2 size={16} />}
                    {isGeneratingAvatar ? 'Generating...' : 'AI Generate'}
                  </Button>
                </div>
              </div>

              <TextArea
                label="Bio"
                value={verificationData.bio}
                onChange={(value) => handleInputChange('bio', value)}
                placeholder="Tell people about yourself and what you create"
                rows={4}
              />

              <Input
                label="Twitter"
                value={verificationData.twitter}
                onChange={(value) => handleInputChange('twitter', value)}
                placeholder="@yourusername"
              />

              <Input
                label="Website"
                value={verificationData.website}
                onChange={(value) => handleInputChange('website', value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} style={{ flex: 1 }}>
                Complete Setup
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {renderStep()}
      </div>
    </div>
  );
};
