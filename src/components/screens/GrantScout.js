import React, { useState } from 'react';
import { ChevronLeft, Brain, Sparkles, Award, FileText, Search } from 'lucide-react';;
import { useApp } from '../../hooks/useApp';;
import { Button } from '../common/Button';;
import { TextArea } from '../common/TextArea';;
import { GradientSphereLogo } from '../common/GradientSphereLogo';;
import { C3_LIGHT_BG, C3_CARD_BG_LIGHT, C3_BORDER_LIGHT, C3_TEXT_PRIMARY_LIGHT, C3_TEXT_SECONDARY_LIGHT } from '../../constants/styles';;
import { Input } from '../common/Input';; // Added for category select, though select is raw

// --- Grant Scout Screen ---
export const GrantScoutScreen = () => {
  const { setScreen, grants, generateGrantIdeas, showToast } = useApp(); // Added showToast
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState({
    description: '', category: 'Art'
  });

  const grantsArray = Array.from(grants.values());

  const handleSearchDataChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    if (!searchData.description.trim()) {
      showToast('Please enter a project description to find grants.', 'error');
      return;
    }

    setIsSearching(true);
    // Pass showToast and setGrants if they are used for feedback within the AI function
    const success = await generateGrantIdeas(searchData.description, searchData.category, showToast /*, setGrants */);
    setIsSearching(false);

    if (success) {
      setShowSearchForm(false); // Hide form on successful search
      // showToast is called within generateGrantIdeas in AppContext
    }
  };

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: C3_CARD_BG_LIGHT, borderBottom: `1px solid ${C3_BORDER_LIGHT}`, padding: '16px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="secondary" onClick={() => setScreen('Dashboard')} size="sm" style={{ marginRight: '16px' }}>
              <ChevronLeft size={16} /> Back
            </Button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <GradientSphereLogo size={24} />
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT }}>
                Grant Scout
              </h1>
            </div>
          </div>
          <Button onClick={() => setShowSearchForm(true)} style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', color: 'white' }}>
            <Brain size={16} /> Find Grants
          </Button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Award size={48} color="#8B5CF6" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
            AI-Powered Grant Discovery
          </h2>
          <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT, maxWidth: '600px', margin: '0 auto' }}>
            Discover funding opportunities tailored to your projects using advanced AI analysis.
          </p>
        </div>

        {/* Search Form */}
        {showSearchForm && (
          <div style={{
            backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '16px',
            border: `1px solid #8B5CF6`, marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Brain size={24} color="#8B5CF6" />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Describe Your Project for Grant Scouting
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <TextArea
                label="Project Description"
                value={searchData.description}
                onChange={(value) => handleSearchDataChange('description', value)}
                placeholder="Describe your project in detail (e.g., 'Developing an educational app for children with learning disabilities')"
                rows={4}
                required
              />

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                  Project Category
                </label>
                <select
                  value={searchData.category}
                  onChange={(e) => handleSearchDataChange('category', e.target.value)}
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
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Environment">Environment</option>
                  <option value="Social Impact">Social Impact</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" onClick={() => setShowSearchForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchData.description.trim()}
                style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', color: 'white' }}
              >
                {isSearching ? <Sparkles size={16} /> : <Search size={16} />}
                {isSearching ? 'Searching...' : 'Find Grants'}
              </Button>
            </div>
          </div>
        )}

        {/* Grants List */}
        {grantsArray.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Award size={48} color={C3_TEXT_SECONDARY_LIGHT} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
              No grants found yet
            </h3>
            <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '24px' }}>
              Use AI to discover funding opportunities for your projects.
            </p>
            <Button onClick={() => setShowSearchForm(true)} style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', color: 'white' }}>
              <Brain size={16} /> Start Grant Search
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT }}>
                Grant Opportunities ({grantsArray.length})
              </h3>
            </div>

            {grantsArray.map(grant => (
              <div key={grant.id} style={{
                backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '16px',
                border: `1px solid ${C3_BORDER_LIGHT}`
              }}>
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
                      {grant.name}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#8B5CF6', fontWeight: '500', marginBottom: '8px' }}>
                      {grant.organization}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: '#F0FDF4', color: '#15803D', // Green for amount
                      padding: '4px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '500'
                    }}>
                      {grant.amount}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px', lineHeight: '1.5' }}>
                  {grant.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
                      DEADLINE
                    </p>
                    <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                      {grant.deadline}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
                      ELIGIBILITY
                    </p>
                    <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                      {grant.eligibility}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, wordBreak: 'break-all' }}> {/* Ensure long website links break */}
                    {grant.website}
                  </span>
                  {grant.website && grant.website !== "Contact for info" && ( // Conditionally render button if website exists
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(grant.website, '_blank')} // Open link in new tab
                    >
                      <FileText size={14} /> Learn More
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
