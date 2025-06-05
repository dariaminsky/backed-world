import React, { useState } from 'react';
import { ChevronLeft, PlusCircle, Trash2, Brain, Sparkles, DollarSign } from 'lucide-react';;
import { useApp } from '../../hooks/useApp';;
import { Button } from '../common/Button';;
import { Input } from '../common/Input';;
import { TextArea } from '../common/TextArea';;
import { GradientSphereLogo } from '../common/GradientSphereLogo';;
import { C3_LIGHT_BG, C3_CARD_BG_LIGHT, C3_BORDER_LIGHT, C3_TEXT_PRIMARY_LIGHT, C3_TEXT_SECONDARY_LIGHT, C3_ACCENT_COLOR, C3_ACCENT_BACKGROUND_ALPHA, C3_ERROR_RED } from '../../constants/styles';;

// --- Budgeting Screen ---
export const BudgetingScreen = () => {
  const { setScreen, budgetItems, createBudgetItem, deleteBudgetItem, generateAIBudget, showToast } = useApp(); // Added showToast
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAIForm, setShowAIForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '', amount: '', category: 'Equipment', description: ''
  });
  const [aiFormData, setAiFormData] = useState({
    description: '', goal: '' // Removed supportPages from initial state
  });

  const budgetItemsArray = Array.from(budgetItems.values());
  const totalBudget = budgetItemsArray.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0); // Ensure amount is treated as number

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAIInputChange = (field, value) => {
    setAiFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.amount) {
      showToast('Item name and amount are required.', 'error'); // showToast for validation
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount.', 'error'); // showToast for validation
      return;
    }

    createBudgetItem({
      ...formData,
      amount,
      createdAt: new Date().toISOString(),
      isAIGenerated: false // Manually added items are not AI generated
    });

    setFormData({ name: '', amount: '', category: 'Equipment', description: '' });
    setShowAddForm(false);
    showToast('Budget item added successfully!', 'success');
  };

  const handleDelete = (itemId) => {
    deleteBudgetItem(itemId);
    showToast('Budget item deleted.', 'info');
  };

  const handleAIGenerate = async () => {
    if (!aiFormData.description.trim() || !aiFormData.goal) {
      showToast('Project description and goal are required for AI generation.', 'error');
      return;
    }

    setIsGenerating(true);
    // Pass showToast and setBudgetItems to the AI function if they are needed within it for feedback
    const success = await generateAIBudget(aiFormData.description, aiFormData.goal, showToast /*, setBudgetItems (already available via useApp if needed)*/);
    setIsGenerating(false);

    if (success) {
      setShowAIForm(false);
      setAiFormData({ description: '', goal: '' });
      // showToast is called within generateAIBudget in AppContext
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
                Budget Planner
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button onClick={() => setShowAIForm(true)} style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', color: 'white' }}>
              <Brain size={16} /> AI Generate
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <PlusCircle size={16} /> Add Item
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Summary Card */}
        <div style={{
          backgroundColor: C3_CARD_BG_LIGHT, padding: '32px', borderRadius: '16px',
          border: `1px solid ${C3_BORDER_LIGHT}`, marginBottom: '32px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '500', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '8px' }}>
              Total Budget
            </h2>
            <p style={{ fontSize: '40px', fontWeight: 'bold', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
              ${totalBudget.toFixed(2)}
            </p>
            <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT }}>
              {budgetItemsArray.length} items tracked
            </p>
          </div>
        </div>

        {/* AI Generate Form */}
        {showAIForm && (
          <div style={{
            backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '16px',
            border: `1px solid #8B5CF6`, marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Brain size={24} color="#8B5CF6" />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginLeft: '8px' }}>
                AI Budget Generator
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <TextArea
                label="Project Description"
                value={aiFormData.description}
                onChange={(value) => handleAIInputChange('description', value)}
                placeholder="Describe your project (e.g., 'Creating an indie game about space exploration')"
                rows={3}
                required
              />

              <Input
                label="Target Budget Amount" // Clarified label
                value={aiFormData.goal}
                onChange={(value) => handleAIInputChange('goal', value)}
                placeholder="5000"
                type="number"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" onClick={() => setShowAIForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiFormData.description.trim() || !aiFormData.goal.trim()} // Check goal trim
                style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', color: 'white' }}
              >
                {isGenerating ? <Sparkles size={16} /> : <Brain size={16} />}
                {isGenerating ? 'Generating...' : 'Generate Budget'}
              </Button>
            </div>
          </div>
        )}

        {/* Add Item Form */}
        {showAddForm && (
          <div style={{
            backgroundColor: C3_CARD_BG_LIGHT, padding: '24px', borderRadius: '16px',
            border: `1px solid ${C3_BORDER_LIGHT}`, marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '20px' }}>
              Add Budget Item
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <Input
                label="Item Name"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                placeholder="e.g. Camera equipment"
                required
              />

              <Input
                label="Amount"
                value={formData.amount}
                onChange={(value) => handleInputChange('amount', value)}
                placeholder="0.00"
                type="number"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '20px' }}>
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
                  <option value="Equipment">Equipment</option>
                  <option value="Software">Software</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Materials">Materials</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <TextArea
                label="Description (Optional)"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="Additional details about this expense"
                rows={3} // Kept rows to 3 as per original
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Add Item
              </Button>
            </div>
          </div>
        )}

        {/* Budget Items List */}
        {budgetItemsArray.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <DollarSign size={48} color={C3_TEXT_SECONDARY_LIGHT} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT, marginBottom: '8px' }}>
              No budget items yet
            </h3>
            <p style={{ fontSize: '16px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '24px' }}>
              Start planning your project budget by adding expense items or using AI.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <PlusCircle size={16} /> Add First Item
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {budgetItemsArray.map(item => (
              <div key={item.id} style={{
                backgroundColor: C3_CARD_BG_LIGHT, padding: '20px', borderRadius: '12px',
                border: `1px solid ${C3_BORDER_LIGHT}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT }}>
                      {item.name}
                    </h3>
                    <span style={{
                      backgroundColor: `${C3_ACCENT_COLOR}${C3_ACCENT_BACKGROUND_ALPHA}`,
                      color: C3_ACCENT_COLOR, padding: '2px 8px', borderRadius: '4px',
                      fontSize: '12px', fontWeight: '500'
                    }}>
                      {item.category}
                    </span>
                    {item.isAIGenerated && (
                      <span style={{
                        backgroundColor: '#F0F9FF', color: '#8B5CF6', // Purple shade for AI
                        padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <Brain size={10} /> AI
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p style={{ fontSize: '14px', color: C3_TEXT_SECONDARY_LIGHT, marginBottom: '4px' }}>
                      {item.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: C3_TEXT_PRIMARY_LIGHT }}>
                    ${parseFloat(item.amount || 0).toFixed(2)} {/* Ensure amount is number */}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    style={{ color: C3_ERROR_RED, borderColor: C3_ERROR_RED }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
