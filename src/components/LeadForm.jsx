import { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Building,
  Globe,
  MessageSquare,
  Tag,
  TrendingUp,
  DollarSign,
  Send,
  X,
  Loader2,
  Bot,
} from 'lucide-react'

export default function LeadForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    // Message
    message: '',
    // Tags & Category
    tags: [],
    interest_category: '',
    // Scoring (auto-filled)
    score: 0,
    category: '', // Auto-set based on score (Hot, Warm, Cold)
    status: 'New', // Default to 'New'
    deal_value: '',
    feedback_rating: '',
    // Contact Preference
    contact_preference: '',
    // Metadata (auto-filled, no UI)
    source: 'form',
    utm_campaign: '',
    utm_source: '',
  })

  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        })
      }
      setTagInput('')
    }
  }

  const handleTagRemove = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    })
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Collect metadata (auto-filled, no UI)
      const metadata = {
        source: 'form',
        // These would be collected from browser/API in production
        ip_address: '', // Would be collected from API call or backend
        location: '', // Would be collected from API call or backend
        user_agent: navigator.userAgent || '',
      }

      // Merge form data with metadata
      const leadData = {
        ...formData,
        ...metadata,
        status: formData.status || 'New',
      }

      if (onSubmit) {
        await onSubmit(leadData)
      }

      // Stop loading state IMMEDIATELY after submission completes
      setIsSubmitting(false)

      // Auto-reset form after successful submit (2s delay)
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          website: '',
          message: '',
          tags: [],
          interest_category: '',
          score: 0,
          category: '',
          status: 'New',
          deal_value: '',
          feedback_rating: '',
          contact_preference: '',
          source: 'form',
          utm_campaign: '',
          utm_source: '',
        })
        setTagInput('')
        setErrors({})
      }, 2000)
    } catch (error) {
      // Stop loading state IMMEDIATELY on error
      setIsSubmitting(false)
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold gradient-text">Basic Info</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.name ? 'border-red-500' : 'border-white/10'
                }`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-white/10'
                }`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-300">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-2 text-gray-300">
              Company
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Acme Inc."
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="website" className="block text-sm font-medium mb-2 text-gray-300">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Message Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold gradient-text">Message</h2>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/5 backdrop-blur-md border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none ${
              errors.message ? 'border-red-500' : 'border-white/10'
            }`}
            placeholder="Tell us about your needs, project requirements, or any questions..."
          />
          {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
        </div>
      </div>

      {/* Lead Tags & Category Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold gradient-text">Lead Tags & Category</h2>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2 text-gray-300">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(index)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Type a tag and press Enter to add"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="interest_category" className="block text-sm font-medium mb-2 text-gray-300">
            Interest Category
          </label>
          <select
            id="interest_category"
            name="interest_category"
            value={formData.interest_category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white text-black dark:bg-white dark:text-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            disabled={isSubmitting}
          >
            <option value="">Select category</option>
            <option value="CRM">CRM</option>
            <option value="ERP">ERP</option>
            <option value="AI Agent">AI Agent</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Support">Support</option>
            <option value="Product">Product</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Lead Scoring Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold gradient-text">Lead Scoring</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="score" className="block text-sm font-medium mb-2 text-gray-300">
              Score
            </label>
            <input
              type="number"
              id="score"
              name="score"
              disabled
              value={formData.score}
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
              placeholder="Auto-calculated"
            />
            <p className="mt-1 text-xs text-gray-400">Automatically calculated by AI</p>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2 text-gray-300">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              disabled
              value={formData.category || 'Auto-set based on score'}
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-400">Auto-set: Hot, Warm, or Cold</p>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2 text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white text-black dark:bg-white dark:text-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isSubmitting}
            >
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
              <option value="Disqualified">Disqualified</option>
            </select>
          </div>

          <div>
            <label htmlFor="deal_value" className="block text-sm font-medium mb-2 text-gray-300">
              Deal Value
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                id="deal_value"
                name="deal_value"
                value={formData.deal_value}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="feedback_rating" className="block text-sm font-medium mb-2 text-gray-300">
              Feedback Rating
            </label>
            <select
              id="feedback_rating"
              name="feedback_rating"
              value={formData.feedback_rating}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white text-black dark:bg-white dark:text-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isSubmitting}
            >
              <option value="">Select rating (1-5)</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Preference Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold gradient-text">Contact Preference</h2>
        </div>

        <div>
          <label htmlFor="contact_preference" className="block text-sm font-medium mb-2 text-gray-300">
            Preferred Contact Method
          </label>
          <select
            id="contact_preference"
            name="contact_preference"
            value={formData.contact_preference}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white text-black dark:bg-white dark:text-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            disabled={isSubmitting}
          >
            <option value="">Select preference</option>
            <option value="Email">Email</option>
            <option value="Call">Call</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </div>
      </div>

      {/* Submit Button with Loading State */}
      <div className="pt-4">
        {isSubmitting ? (
          <div className="w-full py-4 px-6 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center gap-3 text-white">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Scoring your inquiry...
            </span>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative py-4 px-6 rounded-lg font-semibold text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: 'linear-gradient(135deg, #78c8ff 0%, #8aa3ff 50%, #b084ff 100%)',
              boxShadow: '0 0 20px rgba(120, 200, 255, 0.5), 0 0 40px rgba(138, 163, 255, 0.3)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              Submit Lead
            </span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, #8aa3ff 0%, #b084ff 50%, #78c8ff 100%)',
              }}
            />
          </button>
        )}
      </div>
    </form>
  )
}
