import React, { useState } from 'react';
import { ChevronLeft, Brain, Sparkles, Wand2, Camera, ImageIcon } from 'lucide-react';;
import { useApp } from '../../hooks/useApp';;
import { Button } from '../common/Button';;
import { Input } from '../common/Input';;
import { TextArea } from '../common/TextArea';;
import { GradientSphereLogo } from '../common/GradientSphereLogo';;
import { C3_LIGHT_BG, C3_CARD_BG_LIGHT, C3_BORDER_LIGHT, C3_TEXT_PRIMARY_LIGHT, C3_TEXT_SECONDARY_LIGHT, C3_ERROR_RED } from '../../constants/styles';;

// --- Create Support Page Screen ---
export const CreateSupportPageScreen = () => {
  const { setScreen, createSupportPage, showToast, generateProjectImage, enhanceDescription, generateProjectTitle } = useApp();
  const [formData, setFormData] = useState({
    title: '', description: '', goal: '', category: 'Art', image: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [suggestedTitles, setSuggestedTitles] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description.trim()) {
      showToast('Please enter a basic description first', 'error');
      return;
    }

    setIsEnhancing(true);
    const enhanced = await enhanceDescription(formData.description, formData.category);
    setIsEnhancing(false);

    if (enhanced && enhanced !== formData.description) {
      setFormData(prev => ({ ...prev, description: enhanced }));
    }
  };

  const handleGenerateImage = async () => {
    if (!formData.title.trim()) {
      showToast('Please enter a project title first', 'error');
      return;
    }

    setIsGeneratingImage(true);
    const imageUrl = await generateProjectImage(formData.title, formData.category);
    setIsGeneratingImage(false);

    if (imageUrl) {
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleGenerateTitles = async () => {
    if (!formData.description.trim()) {
      showToast('Please enter a description first', 'error');
      return;
    }

    setIsGeneratingTitles(true);
    const titles = await generateProjectTitle(formData.description, formData.category);
    setIsGeneratingTitles(false);

    if (titles && titles.length > 0) { // Check if titles is not undefined
      setSuggestedTitles(titles);
    }
  };

  const selectTitle = (title) => {
    setFormData(prev => ({ ...prev, title }));
    setSuggestedTitles([]);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.goal) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const goalAmount = parseFloat(formData.goal);
    if (isNaN(goalAmount) || goalAmount <= 0) {
      showToast('Please enter a valid goal amount', 'error');
      return;
    }

    createSupportPage({ // Removed pageId, as it's generated in AppContext
      ...formData,
      goal: goalAmount,
      createdAt: new Date().toISOString()
    });

    showToast('Support page created successfully!', 'success');
    setScreen('Dashboard');
  };

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: C3_CARD_BG_LIGHT, borderBottom: `1px solid ${C3_BORDER_LIGHT}`, padding: '16px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <Button variant="secondary" onClick={() => setScreen('Dashboard')} size="sm" style={{ marginRight: '16px' }}>
            <ChevronLeft size={16} /> Back
          </Button>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GradientSphereLogo size={24} />
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT }}>
              Create Support Page
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ backgroundColor: C3_CARD_BG_LIGHT, padding: '32px', borderRadius: '16px', border: `1px solid ${C3_BORDER_LIGHT}` }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '24px' }}>
            Tell us about your project
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* AI-Enhanced Project Title */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Project Title <span style={{ color: C3_ERROR_RED }}>*</span>
                </label>
                <Button
                  onClick={handleGenerateTitles}
                  disabled={isGeneratingTitles || !formData.description.trim()}
                  variant="outline"
                  size="sm"
                  style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
                >
                  {isGeneratingTitles ? <Sparkles size={14} /> : <Brain size={14} />}
                  {isGeneratingTitles ? 'Generating...' : 'AI Suggest'}
                </Button>
              </div>
              <Input // Changed from raw input to Input component
                value={formData.title}
                onChange={(value) => handleInputChange('title', value)}
                placeholder="Give your project a compelling title"
                required // Added required prop to Input
              />

              {/* AI Title Suggestions */}
              {suggestedTitles.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <p style={{ fontSize: '12px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '8px' }}>
                    AI Suggestions:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {suggestedTitles.map((title, index) => (
                      <button
                        key={index}
                        onClick={() => selectTitle(title)}
                        style={{
                          padding: '8px 12px', border: `1px solid #8B5CF6`, borderRadius: '6px',
                          backgroundColor: 'transparent', color: '#8B5CF6', fontSize: '14px',
                          cursor: 'pointer', textAlign: 'left'
                        }}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI-Enhanced Description */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Project Description <span style={{ color: C3_ERROR_RED }}>*</span>
                </label>
                <Button
                  onClick={handleEnhanceDescription}
                  disabled={isEnhancing || !formData.description.trim()}
                  variant="outline"
                  size="sm"
                  style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
                >
                  {isEnhancing ? <Sparkles size={14} /> : <Wand2 size={14} />}
                  {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
                </Button>
              </div>
              <TextArea // Changed from raw textarea to TextArea component
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="Describe what you're creating and why it matters"
                rows={6}
                required // Added required prop to TextArea
              />
            </div>

            {/* AI Project Image */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Project Image
                </label>
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !formData.title.trim()}
                  variant="outline"
                  size="sm"
                  style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
                >
                  {isGeneratingImage ? <Sparkles size={14} /> : <Camera size={14} />}
                  {isGeneratingImage ? 'Generating...' : 'AI Generate'}
                </Button>
              </div>
              <div style={{
                width: '100%', height: '200px', border: `1px solid ${C3_BORDER_LIGHT}`,
                borderRadius: '8px', overflow: 'hidden', backgroundColor: C3_BORDER_LIGHT, // Use C3_BORDER_LIGHT for consistency
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {formData.image ? (
                  <img src={formData.image} alt="Project" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: C3_TEXT_SECONDARY_LIGHT }}>
                    <ImageIcon size={32} style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '14px' }}>No image yet</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Funding Goal"
                value={formData.goal}
                onChange={(value) => handleInputChange('goal', value)}
                placeholder="1000"
                type="number"
                required
              />

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', border: `1px solid ${C3_BORDER_LIGHT}`,
                    borderRadius: '6px', fontSize: '16px', backgroundColor: C3_CARD_BG_LIGHT,
                    color: C3_TEXT_PRIMARY_LIGHT
                  }}
                >
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Technology">Technology</option>
                  <option value="Film">Film</option>
                  <option value="Writing">Writing</option>
                  <option value="Games">Games</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <Button variant="secondary" onClick={() => setScreen('Dashboard')}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} style={{ flex: 1 }}>
                Create Support Page
              </Button>
            </div>

            {/* AI Helper Note */}
            <div style={{
              backgroundColor: '#F0F9FF', border: '1px solid #8B5CF6', borderRadius: '8px',
              padding: '12px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Brain size={16} color="#8B5CF6" />
              <p style={{ fontSize: '14px', color: '#8B5CF6', margin: 0 }}>
                <strong>Pro Tip:</strong> After creating your page, visit Budget Planner to auto-generate a detailed budget breakdown for your project!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
