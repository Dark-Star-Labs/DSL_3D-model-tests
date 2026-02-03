import './style.css'

import ReactDOM from 'react-dom/client'
import { Suspense } from 'react'
import { DSLloader } from './dsl/loader/dslLoader'
import { Analytics } from '@vercel/analytics/react'
import App from './app'

// Create root for the CSS 'div' to reference //
const root = ReactDOM.createRoot(document.querySelector('#root'))

// Create root for the CSS 'div' to reference //
root.render(
   <>  
    {/* Launches a Three.js Canvas, 'className' takes input from the 
        r3f CSS in styles.css - https://r3f.docs.pmnd.rs/api/canvas */}

        
        {/* Wrapping the App in Suspense ensures the app is hidden until all elements 
            within it are loads, simples. - https://react.dev/reference/react/Suspense  */}
        <Suspense fallback={<DSLloader/>}>

            {/* Load the app.jsx */}
            <App />
            <Analytics/>

        </Suspense>   


    {/* Displays a simple loader until the app is ready to display, relies 
        on suspense - https://drei.docs.pmnd.rs/loaders/loader#loader */}
    
  
    </>
)


