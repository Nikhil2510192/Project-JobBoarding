import React from 'react'
import { Briefcase } from 'lucide-react'

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-gradient-to-br from-primary-600 to-blue-600 p-2 rounded-lg">
        <Briefcase className="text-white" size={24 as number} />
      </div>
      <span className="text-2xl font-bold">
        Job<span className="text-primary-600">Boarding</span>
      </span>
    </div>
  )
}

export default Logo
