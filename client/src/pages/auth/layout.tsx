import * as React from 'react'

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <main className="w-full h-full flex flex-col justify-center items-center p-4">
      <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3">{children}</div>
    </main>
  )
}

export default Layout
