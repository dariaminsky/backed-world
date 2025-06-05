import React, { useState } from 'react';
import { ChevronLeft, Search, CheckCircle, Gift, Brain, Heart, MessageCircle, ShieldCheck } from 'lucide-react';;
import { useApp } from '../../hooks/useApp';;
import { Button } from '../common/Button';;
import { GradientSphereLogo } from '../common/GradientSphereLogo';; // Assuming this is used, if not remove
import { C3_LIGHT_BG, C3_CARD_BG_LIGHT, C3_BORDER_LIGHT, C3_TEXT_PRIMARY_LIGHT, C3_TEXT_SECONDARY_LIGHT, C3_ACCENT_COLOR, C3_ACCENT_BACKGROUND_ALPHA, C3_SUCCESS_GREEN } from '../../constants/styles';;
import { Input } from '../common/Input';; // For comment input

// --- Discovery Screen ---
export const DiscoveryScreen = () => {
  const { setScreen, supportPages, supportPage, isPageSupportedByMe, toggleLike, getPageLikes, isPageLikedByUser, addComment, getPageComments, worldIdVerified } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeComments, setActiveComments] = useState({}); // Key: pageId, Value: boolean
  const [newComment, setNewComment] = useState(''); // Single comment input for simplicity

  const supportPagesArray = Array.from(supportPages.values());

  const filteredPages = supportPagesArray.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSupport = (pageId) => {
    const amount = 10; // Default support amount
    supportPage(pageId, amount);
  };

  const handleAddComment = (pageId) => {
    if (newComment.trim() && worldIdVerified) {
      addComment(pageId, newComment.trim());
      setNewComment(''); // Clear comment input after submission
    } else if (!worldIdVerified) {
      // This case should ideally be handled by disabling comment input or showing a toast from useApp
      console.log("User not verified, cannot comment.");
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
                Discover Creators
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Search */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: C3_TEXT_SECONDARY_LIGHT }} />
            <input // Using raw input for search for now
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              style={{
                width: '100%', padding: '12px 12px 12px 40px', border: `1px solid ${C3_BORDER_LIGHT}`,
                borderRadius: '8px', fontSize: '16px', backgroundColor: C3_CARD_BG_LIGHT,
                color: C3_TEXT_PRIMARY_LIGHT
              }}
            />
          </div>
        </div>

        {/* Support Pages Grid */}
        {filteredPages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Search size={48} color={C3_TEXT_SECONDARY_LIGHT} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
              No projects found
            </h3>
            <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a support page!'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {filteredPages.map(page => {
              const progressPercentage = page.goal > 0 ? (page.amount / page.goal) * 100 : 0;
              const isSupported = isPageSupportedByMe(page.id);

              return (
                <div key={page.id} style={{
                  backgroundColor: C3_CARD_BG_LIGHT, borderRadius: '16px',
                  border: `1px solid ${C3_BORDER_LIGHT}`, overflow: 'hidden'
                }}>
                  {/* Project Image */}
                  {page.image && (
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={page.image} alt={page.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{
                          backgroundColor: `${C3_ACCENT_COLOR}${C3_ACCENT_BACKGROUND_ALPHA}`,
                          color: C3_ACCENT_COLOR, padding: '4px 8px', borderRadius: '6px',
                          fontSize: '12px', fontWeight: '500'
                        }}>
                          {page.category}
                        </span>
                        {page.image && ( // Assuming page.image implies AI enhancement for now
                          <span style={{
                            backgroundColor: '#F0F9FF', color: '#8B5CF6', // Using a purple shade for AI
                            padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '500',
                            display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                            <Brain size={10} /> AI Enhanced
                          </span>
                        )}
                      </div>
                      {isSupported && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: C3_SUCCESS_GREEN }}>
                          <CheckCircle size={16} />
                          <span style={{ fontSize: '12px', fontWeight: '500' }}>Supported</span>
                        </div>
                      )}
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
                      {page.title}
                    </h3>

                    <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px', lineHeight: '1.5' }}>
                      {page.description.length > 120 ? `${page.description.substring(0, 120)}...` : page.description}
                    </p>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                          ${page.amount.toFixed(2)} raised
                        </span>
                        <span style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                          ${page.goal.toFixed(2)} goal
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: C3_BORDER_LIGHT, borderRadius: '4px' }}>
                        <div style={{
                          width: `${Math.min(progressPercentage, 100)}%`, height: '100%',
                          backgroundColor: C3_SUCCESS_GREEN, borderRadius: '4px'
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '12px', color: C3_TEXT_SECONDARY_LIGHT }}>
                          {page.supporters} supporters
                        </span>
                        <span style={{ fontSize: '12px', color: C3_TEXT_SECONDARY_LIGHT }}>
                          {progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Social Actions */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                      <button
                        onClick={() => toggleLike(page.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                          color: isPageLikedByUser(page.id) ? '#EF4444' : C3_TEXT_SECONDARY_LIGHT,
                          fontSize: '14px'
                        }}
                      >
                        <Heart size={16} fill={isPageLikedByUser(page.id) ? '#EF4444' : 'none'} />
                        {getPageLikes(page.id)}
                      </button>

                      <button
                        onClick={() => setActiveComments(prev => ({
                          ...prev,
                          [page.id]: !prev[page.id]
                        }))}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                          color: C3_TEXT_SECONDARY_LIGHT, fontSize: '14px'
                        }}
                      >
                        <MessageCircle size={16} />
                        {getPageComments(page.id).length}
                      </button>

                      {/* Simplified: Assuming creator is always verified for listed projects */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        marginLeft: 'auto', fontSize: '12px', color: C3_SUCCESS_GREEN
                      }}>
                        <ShieldCheck size={14} />
                        Verified Creator
                      </div>
                    </div>

                    {/* Comments Section */}
                    {activeComments[page.id] && (
                      <div style={{
                        backgroundColor: C3_LIGHT_BG, padding: '16px', borderRadius: '8px',
                        marginBottom: '16px', border: `1px solid ${C3_BORDER_LIGHT}`
                      }}>
                        <div style={{ marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
                            Comments
                          </h4>

                          {getPageComments(page.id).length === 0 ? (
                            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
                              No comments yet. Be the first to comment!
                            </p>
                          ) : (
                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {getPageComments(page.id).map((comment, index) => (
                                <div key={index} style={{
                                  padding: '8px 0', borderBottom: index < getPageComments(page.id).length - 1 ? `1px solid ${C3_BORDER_LIGHT}` : 'none'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
                                      {comment.isVerified ? "Verified Human" : "Anonymous User"}
                                    </span>
                                    {comment.isVerified && <ShieldCheck size={12} color={C3_SUCCESS_GREEN} />}
                                    <span style={{ fontSize: '10px', color: C3_TEXT_SECONDARY_LIGHT }}>
                                      {new Date(comment.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p style={{ fontSize: '14px', color: C3_TEXT_PRIMARY_LIGHT }}>
                                    {comment.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {worldIdVerified ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Input // Using Input component for comments
                              value={newComment}
                              onChange={(val) => setNewComment(val)} // Input component passes value directly
                              placeholder="Add a comment..."
                              // Removed direct style manipulation, rely on Input's internal styling
                            />
                            <Button
                              onClick={() => handleAddComment(page.id)}
                              size="sm"
                              disabled={!newComment.trim()}
                            >
                              Post
                            </Button>
                          </div>
                        ) : (
                          <div style={{
                            textAlign: 'center', padding: '12px', backgroundColor: C3_CARD_BG_LIGHT,
                            borderRadius: '6px', border: `1px dashed ${C3_BORDER_LIGHT}`
                          }}>
                            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '8px' }}>
                              Verify with World ID to comment
                            </p>
                            <Button size="sm" onClick={() => setScreen('WorldLanding')}>
                              <ShieldCheck size={14} /> Verify Now
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      onClick={() => handleSupport(page.id)}
                      disabled={isSupported}
                      style={{ width: '100%' }}
                    >
                      {isSupported ? (
                        <>
                          <CheckCircle size={16} /> Supported
                        </>
                      ) : (
                        <>
                          <Gift size={16} /> Support $10
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
