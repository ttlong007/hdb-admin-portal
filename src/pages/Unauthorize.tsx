import React from 'react'

import Atom from '@/components/core/components/AtomLoading'

const Unauthorize: React.FC = () => {
  return (
    <div className="h-[90%] flex flex-col items-center justify-center">
      <div className="mt-10 flex flex-col items-center">
        <Atom size={200} color="#FC0101" animationDuration="700" />
      </div>
    </div>
  )
}

export default Unauthorize
