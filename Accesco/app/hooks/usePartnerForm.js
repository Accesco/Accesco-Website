import { useState } from 'react';

export default function usePartnerForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    natureOfCollaboration: [],
    estimatedBudget: '',
    campaignBrief: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleCollabType = (type) => {
    setFormData((prev) => {
      const isSelected = prev.natureOfCollaboration.includes(type);
      return {
        ...prev,
        natureOfCollaboration: isSelected
          ? prev.natureOfCollaboration.filter((t) => t !== type)
          : [...prev.natureOfCollaboration, type]
      };
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      natureOfCollaboration: [],
      estimatedBudget: '',
      campaignBrief: ''
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    // Client-side quick checks
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setSubmitStatus('error');
      setErrorMessage('First Name and Last Name are required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Work Email is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.company.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Company / Brand Name is required.');
      setIsSubmitting(false);
      return;
    }

    if (formData.natureOfCollaboration.length === 0) {
      setSubmitStatus('error');
      setErrorMessage('Please select at least one Nature of Collaboration option.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.estimatedBudget || formData.estimatedBudget === 'Select Budget Range') {
      setSubmitStatus('error');
      setErrorMessage('Please select an Estimated Budget range.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        resetForm();
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Failed to submit partnership request. Please try again.');
      }
    } catch (error) {
      console.error('Submission hook error:', error);
      setSubmitStatus('error');
      setErrorMessage('A network error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    submitStatus,
    errorMessage,
    handleInputChange,
    handleSelectChange,
    toggleCollabType,
    handleSubmit,
    setSubmitStatus,
    setErrorMessage
  };
}
