import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Sparkles, TrendingUp, Shield, Zap, CheckCircle, XCircle } from 'lucide-react'
import LeadForm from '../components/LeadForm'
import { supabase } from '../lib/supabaseClient'

export default function Landing() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('')


  const handleLeadSubmit = async (leadData) => {
    // Map leadData to form variable for consistency
    const form = leadData || {}
    
    // Get UTM parameters from URL
    const utm = {
      utm_campaign: searchParams.get('utm_campaign') || '',
      utm_source: searchParams.get('utm_source') || '',
    }

    // Validate required fields
    if (!form.name || !form.name.trim()) {
      setSubmitStatus('error')
      setErrorMessage('Name is required. Please enter your name.')
      setTimeout(() => setSubmitStatus(null), 5000)
      return
    }

    if (!form.email || !form.email.trim()) {
      setSubmitStatus('error')
      setErrorMessage('Email is required. Please enter your email address.')
      setTimeout(() => setSubmitStatus(null), 5000)
      return
    }

    // Set loading state to true before submission
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage('')

    try {
      const leadPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company || null,
        phone: form.phone || null,
        website: form.website || null,
        message: form.message || null,
        tags: Array.isArray(form.tags) ? form.tags : [],
        interest_category: form.interest_category || null,

        score: parseInt(form.score) || 0,
        category: ['Hot', 'Warm', 'Cold'].includes(form.category) ? form.category : 'Cold',
        status: ['New', 'In Review', 'Contacted', 'Converted', 'Disqualified'].includes(form.status) ? form.status : 'New',

        feedback_rating: form.feedback_rating ? parseInt(form.feedback_rating) : null,
        deal_value: form.deal_value ? parseFloat(form.deal_value) : null,
        contact_preference: ['Email', 'Call', 'WhatsApp'].includes(form.contact_preference) ? form.contact_preference : null,

        source: 'form',
        utm_campaign: utm.utm_campaign || null,
        utm_source: utm.utm_source || null,
        user_agent: navigator.userAgent || null,
        ip_address: null,
        location: null,

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log("📤 Submitting lead payload:", leadPayload)

      // Check for missing fields and log them
      if (!form.name) console.warn("⚠️ Missing field: name")
      if (!form.email) console.warn("⚠️ Missing field: email")
      if (!form.score && form.score !== 0) console.warn("⚠️ Missing field: score, using default 0")
      if (!form.category) console.warn("⚠️ Missing field: category, using default 'Cold'")
      if (!form.status) console.warn("⚠️ Missing field: status, using default 'New'")

      const { error } = await supabase.from("leads").insert([leadPayload])

      // Stop loading state IMMEDIATELY after insert completes
      setIsSubmitting(false)

      if (error) {
        console.error("❌ Supabase insert error:", error.message)
        console.error("❌ Full error details:", error)
        setSubmitStatus('error')
        setErrorMessage("Failed to submit lead: " + error.message)
        alert("Failed to submit lead: " + error.message)
      } else {
        console.log("✅ Lead saved successfully")
        setSubmitStatus('success')
        alert("Lead submitted successfully!")
        
        // Navigate to dashboard after 2 seconds (loading state already stopped)
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (error) {
      // Stop loading state IMMEDIATELY on error
      setIsSubmitting(false)
      console.error("❌ Error submitting lead:", error)
      setSubmitStatus('error')
      setErrorMessage(error.message || "Failed to submit lead. Please try again.")
      alert("Failed to submit lead: " + (error.message || "Unknown error"))
    }
  }

  return (
    <>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">
            <span className="gradient-text">Asenay Leadsense</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Intelligent lead management powered by AI. Score, track, and convert
            leads with precision.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="glass-card p-6">
            <Sparkles className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Scoring</h3>
            <p className="text-gray-400">
              Automatically score leads using advanced AI algorithms
            </p>
          </div>
          <div className="glass-card p-6">
            <TrendingUp className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
            <p className="text-gray-400">
              Track lead performance with comprehensive dashboards
            </p>
          </div>
          <div className="glass-card p-6">
            <Shield className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-gray-400">
              Enterprise-grade security for your lead data
            </p>
          </div>
        </div>

        {/* Lead Form Section */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Get Started Today</h2>
            </div>

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-400 font-medium">
                  Lead submitted successfully! Redirecting to dashboard...
                </p>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-red-400 font-medium">Submission Failed</p>
                  {errorMessage && (
                    <p className="text-red-300 text-sm mt-1">{errorMessage}</p>
                  )}
                </div>
              </div>
            )}

            {isSubmitting ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-400">Processing your lead...</p>
              </div>
            ) : (
              <LeadForm onSubmit={handleLeadSubmit} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

