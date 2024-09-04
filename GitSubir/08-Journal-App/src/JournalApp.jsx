import React from 'react'
import { AppRouter } from './router/AppRouter'
import { AppTheme } from './theme/AppTheme'
import { AuthRoutes } from './auth/routes/AuthRoutes'

export const JournalApp = () => {
  return (
    <>
    <AppTheme>
        <AppRouter />
    </AppTheme>
    </>
  )
}
