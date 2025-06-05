import React from 'react';
import { Users, DollarSign, TrendingUp, Award, PlusCircle, Search, UserCheck } from 'lucide-react';;
import { useApp } from '../../hooks/useApp';;
import { Button } from '../common/Button';;
import { GradientSphereLogo } from '../common/GradientSphereLogo';;
import { C3_LIGHT_BG, C3_CARD_BG_LIGHT, C3_BORDER_LIGHT, C3_TEXT_PRIMARY_LIGHT, C3_TEXT_SECONDARY_LIGHT, C3_ACCENT_COLOR, C3_SUCCESS_GREEN, C3_LOGO_MID } from '../../constants/styles';;

// --- Dashboard Screen ---
export const DashboardScreen = () => {
  const { setScreen, supportPages, budgetItems, grants, worldIdVerified } = useApp();

  const totalSupportPages = supportPages.size;
  const totalSupport = Array.from(supportPages.values()).reduce((sum, page) => sum + page.amount, 0);
  const totalBudgetItems = budgetItems.size;
  const totalGrants = grants.size;

  return (
    <div style={{ backgroundColor: C3_LIGHT_BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: C3_CARD_BG_LIGHT, borderBottom: `1px solid ${C3_BORDER_LIGHT}`, padding: '16px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GradientSphereLogo size={32} />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, margin: 0 }}>
                Backed
              </h1>
              <p style={{ fontSize: '12px', color: C3_TEXT_SECONDARY_LIGHT, margin: 0 }}>
                Scam-Proof Creator Platform
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {worldIdVerified && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: '#f0fdf4', color: '#22c55e', padding: '4px 12px', borderRadius: '20px',
                fontSize: '12px', fontWeight: '500'
              }}>
                <UserCheck size={14} />
                Verified Human
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
            Creator Dashboard
          </h2>
          <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT }}>
            Manage your support pages and track your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', border: `1px solid ${C3_BORDER_LIGHT}` }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Users size={24} color={C3_ACCENT_COLOR} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Support Pages
              </h3>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
              {totalSupportPages}
            </p>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
              Active campaigns
            </p>
          </div>

          <div style={{ backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', border: `1px solid ${C3_BORDER_LIGHT}` }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <DollarSign size={24} color={C3_SUCCESS_GREEN} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Total Support
              </h3>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
              ${totalSupport.toFixed(2)}
            </p>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
              From supporters
            </p>
          </div>

          <div style={{ backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', border: `1px solid ${C3_BORDER_LIGHT}` }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <TrendingUp size={24} color={C3_LOGO_MID} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Budget Items
              </h3>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
              {totalBudgetItems}
            </p>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
              Tracked expenses
            </p>
          </div>

          <div style={{ backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px', border: `1px solid ${C3_BORDER_LIGHT}` }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Award size={24} color="#8B5CF6" />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Grant Leads
              </h3>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '4px' }}>
              {totalGrants}
            </p>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
              Opportunities found
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div
            onClick={() => setScreen('CreateSupportPage')}
            style={{
              backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px',
              border: `1px solid ${C3_BORDER_LIGHT}`, cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = C3_ACCENT_COLOR} // Use currentTarget
            onMouseLeave={(e) => e.currentTarget.style.borderColor = C3_BORDER_LIGHT} // Use currentTarget
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <PlusCircle size={24} color={C3_ACCENT_COLOR} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Create Support Page
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px' }}>
              Launch a new campaign to get support for your next project
            </p>
            <Button variant="outline" size="sm">
              Get Started
            </Button>
          </div>

          <div
            onClick={() => setScreen('Discovery')}
            style={{
              backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px',
              border: `1px solid ${C3_BORDER_LIGHT}`, cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = C3_ACCENT_COLOR} // Use currentTarget
            onMouseLeave={(e) => e.currentTarget.style.borderColor = C3_BORDER_LIGHT} // Use currentTarget
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Search size={24} color={C3_ACCENT_COLOR} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Discover Creators
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px' }}>
              Find and support other creators in the community
            </p>
            <Button variant="outline" size="sm">
              Explore
            </Button>
          </div>

          <div
            onClick={() => setScreen('Budgeting')}
            style={{
              backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px',
              border: `1px solid ${C3_BORDER_LIGHT}`, cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = C3_ACCENT_COLOR} // Use currentTarget
            onMouseLeave={(e) => e.currentTarget.style.borderColor = C3_BORDER_LIGHT} // Use currentTarget
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <DollarSign size={24} color={C3_ACCENT_COLOR} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Budget Planner
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px' }}>
              Plan and track your project expenses with AI assistance
            </p>
            <Button variant="outline" size="sm">
              Plan Budget
            </Button>
          </div>

          <div
            onClick={() => setScreen('GrantScout')}
            style={{
              backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '12px',
              border: `1px solid ${C3_BORDER_LIGHT}`, cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8B5CF6'} // Use currentTarget
            onMouseLeave={(e) => e.currentTarget.style.borderColor = C3_BORDER_LIGHT} // Use currentTarget
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Award size={24} color="#8B5CF6" />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                Grant Scout
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '16px' }}>
              AI-powered grant discovery tailored to your projects
            </p>
            <Button variant="outline" size="sm" style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}>
              <Users size={16} /> {/* Changed icon to Users as Brain was not imported */} Find Grants
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
