import LeadForm from '../components/LeadForm'

function Landing() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 gradient-text">
            Asenay LeadSense
          </h1>
          <p className="text-xl text-gray-300">
            Intelligent lead scoring powered by AI
          </p>
        </div>
        <LeadForm />
      </div>
    </div>
  )
}

export default Landing


